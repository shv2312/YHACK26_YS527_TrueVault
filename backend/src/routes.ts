import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { authenticateToken, AuthRequest, requireRole } from './auth';
import { logEvent } from './audit';
import { blockchainAdapter } from './blockchainAdapter';
import { encryptFile, decryptFile, generateHash } from './crypto';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Configure multer for memory storage so we can hash/encrypt before saving to disk
const upload = multer({ storage: multer.memoryStorage() });
const PRIVATE_DIR = path.join(__dirname, '..', 'private');

if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
}

// Health Check
router.get('/health', async (req, res) => {
  try {
    const blockchainHealth = await blockchainAdapter.getHealth();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      blockchain: blockchainHealth
    });
  } catch (error) {
    res.json({ status: 'error', message: 'Blockchain UNAVAILABLE' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password, simulatedBiometric } = req.body;
    
    if (!username || !password) {
      await logEvent('LOGIN_FAILED', { username, reason: 'Missing credentials' });
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      await logEvent('LOGIN_FAILED', { username, reason: 'Invalid user' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      await logEvent('LOGIN_FAILED', { username: user.username, reason: 'Incorrect password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    const details: any = { userId: user.id, username: user.username };
    if (simulatedBiometric) {
      details.simulatedBiometric = "Simulated Biometric Success";
    }
    
    await logEvent('LOGIN_SUCCESS', details);
    
    // Never return passwordHash
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/auth/logout', authenticateToken, async (req: AuthRequest, res) => {
  await logEvent('LOGOUT', { userId: req.user?.id });
  res.json({ message: 'Logged out successfully' });
});

// Current User
router.get('/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Upload Asset
router.post('/assets/upload', authenticateToken, requireRole(['OWNER', 'ADMIN']), upload.single('file'), async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!file || !name) {
      return res.status(400).json({ error: 'File and name are required' });
    }

    // 4. Generate SHA-256 hash
    const fileHash = generateHash(file.buffer);
    await logEvent('HASH_GENERATED', { userId: req.user?.id, fileHash });

    // 5. Encrypt file using AES-256-GCM
    const { encrypted, iv, authTag } = encryptFile(file.buffer);
    await logEvent('ENCRYPTION_COMPLETED', { userId: req.user?.id, fileHash });

    // 6. Store encrypted file off-chain
    const filename = `${crypto.randomUUID()}.enc`;
    const filepath = path.join(PRIVATE_DIR, filename);
    fs.writeFileSync(filepath, encrypted);

    // 7. Store safe metadata in PostgreSQL
    const asset = await prisma.asset.create({
      data: {
        name,
        ownerId: req.user!.id,
        status: 'PENDING',
        filepath,
        iv,
        authTag,
      }
    });
    
    await logEvent('ASSET_UPLOADED', { assetId: asset.id, ownerId: req.user?.id });

    // 8 & 9. Blockchain operation
    try {
      const bcResult = await blockchainAdapter.mintOwnership(asset.id, req.user!.id);
      
      await prisma.chainOperation.create({
        data: {
          txHash: bcResult.txHash,
          status: bcResult.status as any
        }
      });
      
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: bcResult.status }
      });

      await logEvent(`BLOCKCHAIN_TRANSACTION_${bcResult.status}`, { assetId: asset.id, txHash: bcResult.txHash });
      return res.json({ message: 'Upload successful', asset: { id: asset.id, name: asset.name, status: bcResult.status } });
    } catch (bcError) {
      await logEvent('BLOCKCHAIN_UNAVAILABLE', { assetId: asset.id, error: String(bcError) });
    }

    res.json({ message: 'Upload successful', asset: { id: asset.id, name: asset.name, status: asset.status } });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Download/Access File
router.get('/assets/:id/download', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const assetId = req.params.id;
    
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      await logEvent('UNAUTHORIZED_ACCESS_DENIED', { userId: req.user?.id, assetId, reason: 'Missing asset' });
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check authorization: Owner or ADMIN (or VERIFIER with permission - mocked here)
    let authorized = false;
    if (asset.ownerId === req.user?.id || req.user?.role === 'ADMIN') {
      authorized = true;
    } else {
      // Mock: Ask blockchain if grantee has permission
      // In a real scenario, we'd check if blockchainAdapter.hasPermission(assetId, req.user.id)
      authorized = false; 
    }

    if (!authorized) {
      await logEvent('UNAUTHORIZED_ACCESS_DENIED', { userId: req.user?.id, assetId });
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!asset.filepath || !asset.iv || !asset.authTag) {
      await logEvent('FILE_CORRUPTED', { userId: req.user?.id, assetId, reason: 'Missing encryption metadata' });
      return res.status(500).json({ error: 'File corrupted or missing metadata' });
    }

    if (!fs.existsSync(asset.filepath)) {
      await logEvent('FILE_NOT_FOUND', { userId: req.user?.id, assetId, reason: 'File deleted from disk' });
      return res.status(404).json({ error: 'File not found on disk' });
    }

    try {
      const encryptedData = fs.readFileSync(asset.filepath);
      const decryptedData = decryptFile(encryptedData, asset.iv, asset.authTag);
      
      await logEvent('AUTHORIZED_ACCESS', { userId: req.user?.id, assetId });
      
      res.setHeader('Content-Disposition', `attachment; filename="${asset.name}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.send(decryptedData);
    } catch (decError) {
      await logEvent('TAMPER_DETECTED', { userId: req.user?.id, assetId, reason: 'Decryption failed (auth tag mismatch or corruption)' });
      return res.status(500).json({ error: 'Decryption failed: Data may be tampered with' });
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
