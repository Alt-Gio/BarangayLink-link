"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useTestAuth } from './TestAuthContext';

// Define UserRole enum locally since it's having import issues
type UserRole = 'ADMIN' | 'BARANGAY_CAPTAIN' | 'SECRETARY' | 'TREASURER' | 'COUNCILOR' | 'STAFF';

interface User {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  position: string;
  role: UserRole;
  employeeId?: string;
  phoneNumber?: string;
  profileImage?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  role: UserRole | null;
  isTestMode: boolean;
  hasPermission: (requiredLevel: number) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role hierarchy levels
const ROLE_LEVELS = {
  ADMIN: 6,
  BARANGAY_CAPTAIN: 5,
  SECRETARY: 4,
  TREASURER: 4,
  COUNCILOR: 3,
  STAFF: 1,
} as const;

// Module permissions based on user roles
export const MODULE_PERMISSIONS = {
  // Dashboard & Overview
  DASHBOARD: {
    VIEW: 1, // All roles
    ADMIN: 6,
  },
  
  // Project Management
  PROJECT_MANAGEMENT: {
    VIEW: 1,
    CREATE: 3,
    EDIT: 3,
    DELETE: 5,
    APPROVE: 5,
    MANAGE_BUDGET: 4,
  },
  
  // Task Management
  TASK_MANAGEMENT: {
    VIEW: 1,
    CREATE: 1,
    ASSIGN: 3,
    EDIT: 1,
    DELETE: 3,
    CLOSE: 1,
  },
  
  // Event Management
  EVENT_MANAGEMENT: {
    VIEW: 1,
    CREATE: 3,
    EDIT: 3,
    DELETE: 5,
    PUBLISH: 4,
    MANAGE_REGISTRATION: 3,
  },
  
  // Document System
  DOCUMENT_SYSTEM: {
    VIEW: 1,
    CREATE: 1,
    EDIT: 3,
    DELETE: 4,
    MANAGE_ACCESS: 4,
    OFFICIAL_DOCUMENTS: 3,
  },
  
  // Financial System
  FINANCIAL_SYSTEM: {
    VIEW_BUDGET: 3,
    MANAGE_EXPENSES: 4,
    APPROVE_BUDGET: 5,
    VIEW_REPORTS: 4,
    AUDIT: 6,
  },
  
  // Reports & Analytics
  REPORTS_ANALYTICS: {
    VIEW: 3,
    EXPORT: 4,
    ADVANCED: 5,
  },
  
  // User Management
  USER_MANAGEMENT: {
    VIEW: 5,
    CREATE: 6,
    EDIT: 6,
    DELETE: 6,
    MANAGE_ROLES: 6,
  },
  
  // System Settings
  SYSTEM_SETTINGS: {
    VIEW: 5,
    EDIT: 6,
    ADVANCED: 6,
  },
  
  // Announcements
  ANNOUNCEMENTS: {
    VIEW: 1,
    CREATE: 3,
    EDIT: 4,
    DELETE: 5,
    PUBLISH: 4,
  },
  
  // Landing Page Management
  LANDING_PAGE: {
    VIEW: 1,
    EDIT_CONTENT: 4,
    MANAGE_FEATURED: 5,
  },
};

// Role-specific access patterns
const ROLE_ACCESS = {
  ADMIN: {
    description: 'Full system control',
    modules: ['all'],
  },
  BARANGAY_CAPTAIN: {
    description: 'Executive authority',
    modules: ['projects', 'events', 'announcements', 'budget-approval', 'user-oversight'],
  },
  SECRETARY: {
    description: 'Documentation authority',
    modules: ['documents', 'meetings', 'announcements', 'information-publishing'],
  },
  TREASURER: {
    description: 'Financial authority',
    modules: ['budget', 'expenses', 'financial-reports', 'audit'],
  },
  COUNCILOR: {
    description: 'Legislative authority',
    modules: ['projects', 'events', 'committee-management', 'community-programs'],
  },
  STAFF: {
    description: 'Administrative support',
    modules: ['tasks', 'basic-reporting', 'field-operations'],
  },
} as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { testUser, isTestMode } = useTestAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      setIsLoading(true);
      
      // Check for test mode first
      if (isTestMode && testUser) {
        setUser({
          id: testUser.id,
          clerkUserId: testUser.clerkUserId,
          name: testUser.name,
          email: testUser.email,
          position: testUser.position,
          role: testUser.role,
          isActive: true,
        });
        setIsLoading(false);
        return;
      }
      
      if (!isLoaded) return;
      
      if (isSignedIn && clerkUser) {
        try {
          console.log('Syncing user with Clerk data:', {
            clerkUserId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
          });

          // Check if user exists in our database
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkUserId: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('User data synced successfully:', userData);
            setUser(userData);
          } else {
            console.error('Failed to sync user:', response.status, await response.text());
            setUser(null);
          }
        } catch (error) {
          console.error('Error syncing user:', error);
          setUser(null);
        }
      } else {
        console.log('User not signed in or no clerk user data');
        setUser(null);
      }
      
      setIsLoading(false);
    };

    syncUser();
  }, [isSignedIn, isLoaded, clerkUser, isTestMode, testUser]);

  const getRoleLevel = (role: UserRole): number => {
    return ROLE_LEVELS[role];
  };

  const hasPermission = (requiredLevel: number): boolean => {
    if (!user) return false;
    return getRoleLevel(user.role) >= requiredLevel;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const canAccess = (module: string): boolean => {
    if (!user) return false;
    
    // Admin can access everything
    if (user.role === 'ADMIN') return true;
    
    // Check role-specific access
    const roleAccess = ROLE_ACCESS[user.role];
    const modules = roleAccess.modules as readonly string[];
    if (modules.includes('all') || modules.includes(module)) {
      return true;
    }
    
    return false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: isSignedIn || isTestMode || false,
    role: user?.role || null,
    isTestMode,
    hasPermission,
    hasRole,
    canAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for role-based access
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredLevel: number
) {
  return function AuthenticatedComponent(props: P) {
    const { hasPermission, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (!hasPermission(requiredLevel)) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-100">Access Denied</h3>
            <p className="mt-1 text-sm text-gray-400">
              You don&apos;t have permission to access this resource.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Role badge component
export function RoleBadge({ role }: { role: UserRole }) {
  const roleColors = {
    ADMIN: 'bg-red-900/20 text-red-300 border-red-700',
    BARANGAY_CAPTAIN: 'bg-purple-900/20 text-purple-300 border-purple-700',
    SECRETARY: 'bg-blue-900/20 text-blue-300 border-blue-700',
    TREASURER: 'bg-green-900/20 text-green-300 border-green-700',
    COUNCILOR: 'bg-orange-900/20 text-orange-300 border-orange-700',
    STAFF: 'bg-gray-700 text-gray-300 border-gray-600',
  };

  const roleLabels = {
    ADMIN: 'Administrator',
    BARANGAY_CAPTAIN: 'Barangay Captain',
    SECRETARY: 'Secretary',
    TREASURER: 'Treasurer',
    COUNCILOR: 'Councilor',
    STAFF: 'Staff',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[role]}`}>
      {roleLabels[role]}
    </span>
  );
}

export default AuthContext;