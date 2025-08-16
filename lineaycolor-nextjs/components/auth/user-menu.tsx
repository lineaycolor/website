"use client";

import { User } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
  // In a real app, this would check authentication status
  const isAuthenticated = false;

  return (
    <Link
      href={isAuthenticated ? "/account" : "/login"}
      className="p-2 text-primary hover:text-accent transition-colors"
      aria-label={isAuthenticated ? "My Account" : "Login"}
    >
      <User size={24} />
    </Link>
  );
}