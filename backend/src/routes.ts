import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from './auth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed data route for demo purposes (Hackathon)
router.post('/seed', async (req, res) => {
  try {
    const pwdHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { username: 'demo_admin' },
      update: {},
      create: {
        username: 'demo_admin',
        passwordHash: pwdHash,
        role: 'ADMIN'
      }
    });
    res.json({ message: 'Seeded demo_admin', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (Handled mostly client-side for JWT, but standard response is good)
router.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Current User
router.get('/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Example restricted route to test Roles
router.get('/admin-only', authenticateToken, requireRole(['ADMIN']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
