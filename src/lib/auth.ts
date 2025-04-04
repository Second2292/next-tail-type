// src/lib/auth.ts
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from './db';
import { User } from '@prisma/client';

// You'll need to add these dependencies:
// npm install bcrypt jsonwebtoken
// npm install @types/bcrypt @types/jsonwebtoken --save-dev

// Environment variables (add to .env)
// JWT_SECRET=your_jwt_secret_here
// SALT_ROUNDS=10

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'development_jwt_secret';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id }
  });
}

export async function authenticateUser(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return null;
  }

  // Verify password
  const passwordValid = await comparePasswords(password, user.password);
  if (!passwordValid) {
    return null;
  }

  // Generate token
  const token = generateToken(user);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
}