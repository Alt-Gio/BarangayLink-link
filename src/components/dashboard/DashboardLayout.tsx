"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTestAuth } from '@/context/TestAuthContext';
import { useRouter } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Building2, 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Calendar, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronDown,
  Home,
  Globe,
  Shield,
  UserCheck,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  requiredLevel?: number;
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    requiredLevel: 1,
  },
  {
    id: 'projects',
    label: 'Project Management',
    icon: FolderOpen,
    href: '/dashboard/projects',
    requiredLevel: 1,
    children: [
      { id: 'projects-list', label: 'All Projects', icon: FolderOpen, href: '/dashboard/projects', requiredLevel: 1 },
      { id: 'projects-create', label: 'Create Project', icon: FolderOpen, href: '/dashboard/projects/create', requiredLevel: 3 },
      { id: 'projects-approval', label: 'Project Approval', icon: UserCheck, href: '/dashboard/projects/approval', requiredLevel: 4 },
    ]
  },
  {
    id: 'tasks',
    label: 'Task Management',
    icon: CheckSquare,
    href: '/dashboard/tasks',
    requiredLevel: 1,
    children: [
      { id: 'tasks-assigned', label: 'My Tasks', icon: CheckSquare, href: '/dashboard/tasks/assigned', requiredLevel: 1 },
      { id: 'tasks-team', label: 'Team Tasks', icon: Users, href: '/dashboard/tasks/team', requiredLevel: 3 },
      { id: 'tasks-create', label: 'Create Task', icon: CheckSquare, href: '/dashboard/tasks/create', requiredLevel: 3 },
    ]
  },
  {
    id: 'events',
    label: 'Event Management',
    icon: Calendar,
    href: '/dashboard/events',
    requiredLevel: 1,
    children: [
      { id: 'events-calendar', label: 'Event Calendar', icon: Calendar, href: '/dashboard/events', requiredLevel: 1 },
      { id: 'events-create', label: 'Create Event', icon: Calendar, href: '/dashboard/events/create', requiredLevel: 3 },
      { id: 'events-registration', label: 'Registration Management', icon: Users, href: '/dashboard/events/registration', requiredLevel: 1 },
    ]
  },
  {
    id: 'documents',
    label: 'Document System',
    icon: FileText,
    href: '/dashboard/documents',
    requiredLevel: 1,
    children: [
      { id: 'documents-library', label: 'Document Library', icon: FileText, href: '/dashboard/documents', requiredLevel: 1 },
      { id: 'documents-official', label: 'Official Records', icon: Shield, href: '/dashboard/documents/official', requiredLevel: 4 },
      { id: 'documents-upload', label: 'Upload Documents', icon: FileText, href: '/dashboard/documents/upload', requiredLevel: 1 },
    ]
  },
  {
    id: 'financial',
    label: 'Financial System',
    icon: DollarSign,
    href: '/dashboard/financial',
    requiredLevel: 4,
    children: [
      { id: 'financial-overview', label: 'Financial Overview', icon: DollarSign, href: '/dashboard/financial', requiredLevel: 4 },
      { id: 'financial-budgets', label: 'Budget Management', icon: DollarSign, href: '/dashboard/financial/budgets', requiredLevel: 4 },
      { id: 'financial-expenses', label: 'Expense Tracking', icon: DollarSign, href: '/dashboard/financial/expenses', requiredLevel: 1 },
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: BarChart3,
    href: '/dashboard/reports',
    requiredLevel: 3,
    children: [
      { id: 'reports-overview', label: 'Reports Overview', icon: BarChart3, href: '/dashboard/reports', requiredLevel: 3 },
      { id: 'reports-projects', label: 'Project Reports', icon: FolderOpen, href: '/dashboard/reports/projects', requiredLevel: 3 },
      { id: 'reports-financial', label: 'Financial Reports', icon: DollarSign, href: '/dashboard/reports/financial', requiredLevel: 4 },
    ]
  },
  {
    id: 'productivity',
    label: 'Productivity & Goals',
    icon: Target,
    href: '/dashboard/productivity',
    requiredLevel: 1,
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Settings,
    href: '/dashboard/admin',
    requiredLevel: 5,
    children: [
      { id: 'admin-users', label: 'User Management', icon: Users, href: '/dashboard/admin/users', requiredLevel: 5 },
      { id: 'admin-settings', label: 'System Settings', icon: Settings, href: '/dashboard/admin/settings', requiredLevel: 6 },
      { id: 'admin-audit', label: 'Audit Logs', icon: Shield, href: '/dashboard/admin/audit', requiredLevel: 6 },
    ]
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const { user, hasPermission, isTestMode, isLoading, isSignedIn } = useAuth();
  const { logoutTestUser } = useTestAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoading, isSignedIn, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-300 mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please sign in to access the dashboard.</p>
          <Link 
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Show pending approval state for new users
  if (user && !user.isActive) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Account Pending Approval</h1>
          <p className="text-gray-400 mb-6">
            Your account is pending approval from barangay officials. You'll receive an email notification once approved.
          </p>
          <div className="flex gap-3 justify-center">
            <SignOutButton>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
            <Link 
              href="/"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredNavigation = navigationItems.filter(item => 
    !item.requiredLevel || hasPermission(item.requiredLevel)
  );

  const NavigationItem = ({ item, depth = 0 }: { item: NavigationItem; depth?: number }) => {
    const Icon = item.icon;
    const isActive = currentPage === item.href;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const visibleChildren = hasChildren ? item.children.filter(child => 
      !child.requiredLevel || hasPermission(child.requiredLevel)
    ) : [];

    return (
      <div>
        <div className={cn(
          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
          depth > 0 && "ml-6",
          isActive 
            ? "bg-green-900/20 text-green-300 border-r-2 border-green-500" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        )}>
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="flex items-center w-full text-left"
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isExpanded ? "rotate-180" : ""
              )} />
            </button>
          ) : (
            <Link href={item.href} className="flex items-center w-full">
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="ml-3 inline-block py-0.5 px-2 text-xs bg-green-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {visibleChildren.map(child => (
              <NavigationItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg transform transition-transform lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-700">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Building2 className="h-8 w-8 text-green-500" />
              <div className="ml-2">
                <span className="text-xl font-bold text-white">BarangayLink</span>
                {isTestMode && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-300 text-xs font-medium">TEST MODE</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map(item => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex-shrink-0 border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.role?.replace('_', ' ') || 'Role'}</p>
              </div>
            </div>
            {isTestMode && (
              <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-700 rounded">
                <button
                  onClick={logoutTestUser}
                  className="w-full text-yellow-400 hover:text-yellow-300 text-xs"
                >
                  Exit Test Mode
                </button>
              </div>
            )}
            <div className="mt-3 flex space-x-1">
              <Link
                href="/"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="View Public Site"
              >
                <Globe className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              {isTestMode ? (
                <button
                  onClick={logoutTestUser}
                  className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  title="Sign Out (Test Mode)"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              ) : (
                <SignOutButton>
                  <button className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </SignOutButton>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              {isTestMode && (
                <div className="flex items-center gap-2 px-2 py-1 bg-yellow-900/20 border border-yellow-700 rounded-full">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-300 text-xs font-medium">TEST</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              {isTestMode && (
                <button
                  onClick={logoutTestUser}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                  title="Exit Test Mode"
                >
                  Exit Test
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed top-4 right-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}