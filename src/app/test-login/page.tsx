"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Lock, Shield, AlertTriangle } from 'lucide-react';

// Test accounts for different roles
const TEST_ACCOUNTS = [
  {
    id: 'admin',
    name: 'System Administrator',
    email: 'admin@barangaylink.gov.ph',
    password: 'admin123',
    role: 'ADMIN',
    level: 6,
    color: 'bg-red-600',
    description: 'Full system control and management'
  },
  {
    id: 'captain',
    name: 'Juan de la Cruz',
    email: 'captain@barangaylink.gov.ph', 
    password: 'captain123',
    role: 'BARANGAY_CAPTAIN',
    level: 5,
    color: 'bg-purple-600',
    description: 'Executive authority and project oversight'
  },
  {
    id: 'secretary',
    name: 'Secretary',
    email: 'secretary@barangaylink.gov.ph',
    password: 'secretary123', 
    role: 'SECRETARY',
    level: 4,
    color: 'bg-blue-600',
    description: 'Documentation and information management'
  },
  {
    id: 'treasurer',
    name: 'Treasurer',
    email: 'treasurer@barangaylink.gov.ph',
    password: 'treasurer123',
    role: 'TREASURER', 
    level: 4,
    color: 'bg-green-600',
    description: 'Financial management and budget oversight'
  },
  {
    id: 'councilor',
    name: 'Count Duck',
    email: 'councilor1@barangaylink.gov.ph',
    password: 'councilor123',
    role: 'COUNCILOR',
    level: 3,
    color: 'bg-orange-600',
    description: 'Committee leadership and community programs'
  },
  {
    id: 'staff',
    name: 'Staff-San', 
    email: 'staff1@barangaylink.gov.ph',
    password: 'staff123',
    role: 'STAFF',
    level: 1,
    color: 'bg-gray-600',
    description: 'Administrative support and task execution'
  }
];

export default function TestLoginPage() {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if test login is enabled and redirect if disabled
  useEffect(() => {
    const isTestLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true';
    if (!isTestLoginEnabled) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (account: any) => {
    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store test user data in sessionStorage
      sessionStorage.setItem('testUser', JSON.stringify({
        id: `test_${account.id}`,
        clerkUserId: `test_${account.id}_clerk`,
        name: account.name,
        email: account.email,
        position: account.description,
        role: account.role,
        isTestUser: true,
        level: account.level
      }));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (accountId: string) => {
    const account = TEST_ACCOUNTS.find(acc => acc.id === accountId);
    if (account) {
      handleLogin(account);
    }
  };

  const selectedAccountData = TEST_ACCOUNTS.find(acc => acc.id === selectedAccount);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">BarangayLink Test Login</h1>
          <p className="text-gray-400 mb-6">
            Select a test account to explore the system with different permission levels
          </p>
          
          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-yellow-300 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Testing Environment</span>
            </div>
            <p className="text-yellow-200 text-sm">
              This is a demo environment with test data. All changes are temporary and will be reset.
            </p>
          </div>
        </div>

        {/* Quick Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TEST_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 cursor-pointer"
              onClick={() => handleQuickLogin(account.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${account.color} rounded-lg flex items-center justify-center`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">{account.name}</h3>
                  <p className="text-sm text-gray-400">{account.role}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">{account.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Level {account.level}</span>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Quick Login'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Manual Login Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Manual Login</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Test Account
              </label>
              <div className="space-y-2">
                {TEST_ACCOUNTS.map((account) => (
                  <label
                    key={account.id}
                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="account"
                      value={account.id}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className={`w-8 h-8 ${account.color} rounded flex items-center justify-center`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-200">{account.name}</div>
                      <div className="text-sm text-gray-400">{account.role}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <div>
              {selectedAccountData ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        value={selectedAccountData.email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={selectedAccountData.password}
                        readOnly
                        className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-200 mb-2">Account Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Role:</span>
                        <span className="text-gray-200">{selectedAccountData.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-gray-200">{selectedAccountData.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Access:</span>
                        <span className="text-gray-200">{selectedAccountData.description}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLogin(selectedAccountData)}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select an account to view login details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credentials Reference */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Test Credentials Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_ACCOUNTS.map((account) => (
              <div key={account.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 ${account.color} rounded`}></div>
                  <span className="font-medium text-gray-200">{account.role}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="text-gray-300">Email: {account.email}</div>
                  <div className="text-gray-300">Password: {account.password}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Main */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
