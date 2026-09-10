import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Expect a 32-byte hex string or base64 from environment for AES-256
function getEncryptionKey(): Buffer {
  const keyStr = process.env.FILE_ENCRYPTION_KEY;
  if (!keyStr) {
    throw new Error('FILE_ENCRYPTION_KEY is not defined in environment variables');
  }
  const key = Buffer.from(keyStr, 'hex'); // Assuming hex encoded 32-byte key
  if (key.length !== 32) {
    throw new Error('FILE_ENCRYPTION_KEY must be exactly 32 bytes long');
  }
  return key;
}

export function encryptFile(buffer: Buffer): { encrypted: Buffer; iv: string; authTag: string } {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptFile(encrypted: Buffer, ivHex: string, authTagHex: string): Buffer {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted;
}

export function generateHash(buffer: Buffer): string {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(buffer);
  return hashSum.digest('hex');
}
