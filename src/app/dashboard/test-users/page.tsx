"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Shield, 
  Crown, 
  UserCheck, 
  UserX, 
  Eye, 
  EyeOff,
  Copy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestUser {
  email: string;
  name: string;
  role: string;
  position: string;
  accessLevel: string;
  description: string;
}

const testUsers: TestUser[] = [
  {
    email: 'admin@test.com',
    name: 'System Administrator',
    role: 'ADMIN',
    position: 'System Administrator',
    accessLevel: 'full',
    description: 'Full system access - can view and manage all projects, users, and system settings'
  },
  {
    email: 'captain@test.com',
    name: 'Barangay Captain',
    role: 'BARANGAY_CAPTAIN',
    position: 'Barangay Captain',
    accessLevel: 'executive',
    description: 'Executive access - can view all projects and approve/reject proposals'
  },
  {
    email: 'secretary@test.com',
    name: 'Barangay Secretary',
    role: 'SECRETARY',
    position: 'Barangay Secretary',
    accessLevel: 'departmental',
    description: 'Department access - can view assigned and public projects, manage documentation'
  },
  {
    email: 'treasurer@test.com',
    name: 'Barangay Treasurer',
    role: 'TREASURER',
    position: 'Barangay Treasurer',
    accessLevel: 'departmental',
    description: 'Department access - can view assigned and public projects, manage finances'
  },
  {
    email: 'councilor@test.com',
    name: 'Barangay Councilor',
    role: 'COUNCILOR',
    position: 'Barangay Councilor',
    accessLevel: 'committee',
    description: 'Committee access - can view committee and assigned projects, create own projects'
  },
  {
    email: 'staff@test.com',
    name: 'Staff Member',
    role: 'STAFF',
    position: 'Staff Member',
    accessLevel: 'assigned',
    description: 'Limited access - can view assigned tasks and public projects only'
  }
];

const roleColors = {
  ADMIN: 'bg-red-900/20 text-red-300 border-red-700',
  BARANGAY_CAPTAIN: 'bg-purple-900/20 text-purple-300 border-purple-700',
  SECRETARY: 'bg-blue-900/20 text-blue-300 border-blue-700',
  TREASURER: 'bg-green-900/20 text-green-300 border-green-700',
  COUNCILOR: 'bg-orange-900/20 text-orange-300 border-orange-700',
  STAFF: 'bg-gray-900/20 text-gray-300 border-gray-700'
};

const accessLevelColors = {
  full: 'bg-red-500',
  executive: 'bg-purple-500',
  departmental: 'bg-blue-500',
  committee: 'bg-orange-500',
  assigned: 'bg-gray-500',
  public: 'bg-green-500'
};

export default function TestUsersPage() {
  const { hasPermission } = useAuth();
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const canViewTestUsers = hasPermission('TEST_USERS_VIEW');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(text);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!canViewTestUsers) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Access Denied</h3>
          <p className="text-red-300">You do not have permission to view test users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Test User Management</h1>
        <p className="text-gray-400">
          Use these test accounts to verify role-based access control and hierarchy permissions.
        </p>
      </div>

      {/* Role Hierarchy Info */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-semibold text-blue-300">Role Hierarchy Structure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Level 6: ADMIN - Full system access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300">Level 5: BARANGAY_CAPTAIN - All projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Level 4: SECRETARY/TREASURER - Department projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300">Level 3: COUNCILOR - Committee projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-300">Level 1: STAFF - Assigned tasks only</span>
          </div>
        </div>
      </div>

      {/* Test Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testUsers.map((user) => (
          <div key={user.email} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            {/* User Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  roleColors[user.role as keyof typeof roleColors]
                )}>
                  {user.role.replace('_', ' ')}
                </span>
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  accessLevelColors[user.accessLevel as keyof typeof accessLevelColors]
                )}></div>
              </div>
            </div>

            {/* Email and Copy Button */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2">
                <code className="text-sm text-gray-300">{user.email}</code>
              </div>
              <button
                onClick={() => copyToClipboard(user.email)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Copy email"
              >
                {copiedEmail === user.email ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Info */}
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Password:</span>
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="p-1 text-gray-400 hover:text-gray-300"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm text-gray-300">
                  {showPasswords ? 'test123456' : '••••••••••'}
                </code>
                <button
                  onClick={() => copyToClipboard('test123456')}
                  className="p-1 text-gray-400 hover:text-blue-400"
                  title="Copy password"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Access Description */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-300">{user.description}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => copyToClipboard(`${user.email}\nPassword: test123456`)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy Login Info
              </button>
              <button
                onClick={() => copyToClipboard(`Login as ${user.name} (${user.role})`)}
                className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Copy Role Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Testing Instructions */}
      <div className="mt-8 bg-green-900/20 border border-green-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-300 mb-4">Testing Instructions</h3>
        <div className="space-y-3 text-sm text-green-200">
          <p>1. <strong>Copy login credentials</strong> for any test user above</p>
          <p>2. <strong>Log out</strong> of your current session</p>
          <p>3. <strong>Log in</strong> with the test user credentials</p>
          <p>4. <strong>Navigate to Projects</strong> to see role-based access in action</p>
          <p>5. <strong>Verify access levels</strong> - higher roles see more projects</p>
          <p>6. <strong>Test project creation</strong> - only Level 3+ can create projects</p>
        </div>
      </div>
    </div>
  );
}
