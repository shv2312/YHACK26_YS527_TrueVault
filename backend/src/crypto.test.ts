import { encryptFile, decryptFile, generateHash } from './crypto';
import crypto from 'crypto';
import assert from 'assert';

// Set up env key for tests
process.env.FILE_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');

const sampleData = Buffer.from('This is a highly sensitive document content');

console.log('Running Crypto Tests...');

// 1. Consistent SHA-256
const hash1 = generateHash(sampleData);
const hash2 = generateHash(sampleData);
assert.strictEqual(hash1, hash2, 'SHA-256 should be consistent');

// 2. Hash mismatch
const hash3 = generateHash(Buffer.from('This is a modified document content'));
assert.notStrictEqual(hash1, hash3, 'Modified file hash should mismatch');

// 3. Encrypt and Decrypt
const { encrypted, iv, authTag } = encryptFile(sampleData);
const decrypted = decryptFile(encrypted, iv, authTag);
assert.strictEqual(decrypted.toString(), sampleData.toString(), 'Decrypted data must match original');

// 4. Different IV
const { encrypted: enc2, iv: iv2 } = encryptFile(sampleData);
assert.notStrictEqual(iv, iv2, 'IV must be unique per encryption');
assert.strictEqual(encrypted.equals(enc2), false, 'Ciphertext must be different for same data due to unique IV');

// 5. Tamper detection
const tampered = Buffer.from(encrypted);
tampered[0] = tampered[0] ^ 1;
let tamperDetected = false;
try {
  decryptFile(tampered, iv, authTag);
} catch (e) {
  tamperDetected = true;
}
assert.strictEqual(tamperDetected, true, 'Should reject modified ciphertext');

// 6. Wrong key
const oldKey = process.env.FILE_ENCRYPTION_KEY;
process.env.FILE_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
let wrongKeyDetected = false;
try {
  decryptFile(encrypted, iv, authTag);
} catch (e) {
  wrongKeyDetected = true;
}
assert.strictEqual(wrongKeyDetected, true, 'Should reject decryption with wrong key');
process.env.FILE_ENCRYPTION_KEY = oldKey;

console.log('All Crypto Tests PASSED.');
