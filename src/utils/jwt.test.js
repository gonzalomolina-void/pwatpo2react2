import { describe, it, expect } from 'vitest';
import { parseJwt } from './jwt.js';

describe('JWT Utility - parseJwt', () => {
  it('debería retornar null para un token vacío, no-string o malformado', () => {
    expect(parseJwt(null)).toBeNull();
    expect(parseJwt(undefined)).toBeNull();
    expect(parseJwt(12345)).toBeNull();
    expect(parseJwt('not.a.jwt')).toBeNull();
    expect(parseJwt('justastring')).toBeNull();
  });

  it('debería decodificar correctamente un token JWT válido', () => {
    // Payload simulado: { id: 1, email: "admin@example.com", role: "admin" }
    // En base64url: eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiJ9
    const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const payload = 'eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiJ9';
    const signature = 'somesignaturehere';
    const validJwt = `${header}.${payload}.${signature}`;

    const decoded = parseJwt(validJwt);

    expect(decoded).not.toBeNull();
    expect(decoded.id).toBe(1);
    expect(decoded.email).toBe('admin@example.com');
    expect(decoded.role).toBe('admin');
  });

  it('debería retornar null si el payload no es un JSON válido', () => {
    const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const invalidPayload = 'bm90LWEtanNvbg'; // "not-a-json" en base64
    const signature = 'somesignaturehere';
    const badJwt = `${header}.${invalidPayload}.${signature}`;

    expect(parseJwt(badJwt)).toBeNull();
  });
});
