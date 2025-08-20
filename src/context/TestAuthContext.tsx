"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from '@prisma/client';

interface TestUser {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  position: string;
  role: UserRole;
  isTestUser: boolean;
  level: number;
}

interface TestAuthContextType {
  testUser: TestUser | null;
  isTestMode: boolean;
  loginAsTestUser: (user: TestUser) => void;
  logoutTestUser: () => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: React.ReactNode }) {
  const [testUser, setTestUser] = useState<TestUser | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check for test user in sessionStorage
    const storedTestUser = sessionStorage.getItem('testUser');
    if (storedTestUser) {
      try {
        const user = JSON.parse(storedTestUser);
        setTestUser(user);
        setIsTestMode(true);
      } catch (error) {
        console.error('Error parsing test user:', error);
        sessionStorage.removeItem('testUser');
      }
    }
  }, []);

  const loginAsTestUser = (user: TestUser) => {
    setTestUser(user);
    setIsTestMode(true);
    sessionStorage.setItem('testUser', JSON.stringify(user));
  };

  const logoutTestUser = () => {
    setTestUser(null);
    setIsTestMode(false);
    sessionStorage.removeItem('testUser');
  };

  return (
    <TestAuthContext.Provider value={{
      testUser,
      isTestMode,
      loginAsTestUser,
      logoutTestUser,
    }}>
      {children}
    </TestAuthContext.Provider>
  );
}

export function useTestAuth() {
  const context = useContext(TestAuthContext);
  if (context === undefined) {
    throw new Error('useTestAuth must be used within a TestAuthProvider');
  }
  return context;
}
