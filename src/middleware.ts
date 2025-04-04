// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Add paths that should be protected by authentication
const protectedPaths = [
  '/api/products/manage',
  '/api/orders',
  '/api/users'
];

// Add paths that should be accessible only by admins
const adminPaths = [
  '/api/users',
  '/api/products/manage'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this path should be protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  // Verify token
  const payload = verifyToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  // Check for admin role if it's an admin path
  if (isAdminPath && payload.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};