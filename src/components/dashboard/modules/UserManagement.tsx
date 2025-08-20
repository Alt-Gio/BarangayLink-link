"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@prisma/client';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  UserCheck, 
  UserX, 
  Crown, 
  Star, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  MoreHorizontal,
  Settings,
  Key,
  Activity,
  CheckCircle,
  AlertCircle,
  User,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BarangayUser {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  position: string;
  role: UserRole;
  employeeId?: string;
  department?: string;
  phoneNumber?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  loginCount: number;
  projectsManaged: number;
  tasksCompleted: number;
  eventsOrganized: number;
  documentsUploaded: number;
}

const mockUsers: BarangayUser[] = [
  {
    id: '1',
    clerkUserId: 'captain_123',
    name: 'Juan de la Cruz',
    email: 'captain@barangaybitano.gov.ph',
    position: 'Barangay Captain',
    role: 'BARANGAY_CAPTAIN',
    employeeId: 'BC-001',
    department: 'Executive Office',
    phoneNumber: '(052) 742-0123',
    profileImage: '/images/officials/captain.jpg',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-20',
    lastActiveAt: '2024-08-21T08:30:00',
    loginCount: 156,
    projectsManaged: 8,
    tasksCompleted: 34,
    eventsOrganized: 12,
    documentsUploaded: 28,
  },
  {
    id: '2',
    clerkUserId: 'secretary_456',
    name: 'Maria Santos',
    email: 'secretary@barangaybitano.gov.ph',
    position: 'Barangay Secretary',
    role: 'SECRETARY',
    employeeId: 'BS-001',
    department: 'Administrative Office',
    phoneNumber: '(052) 742-0124',
    profileImage: '/images/officials/secretary.jpg',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-20',
    lastActiveAt: '2024-08-21T09:15:00',
    loginCount: 198,
    projectsManaged: 2,
    tasksCompleted: 89,
    eventsOrganized: 6,
    documentsUploaded: 156,
  },
  {
    id: '3',
    clerkUserId: 'treasurer_789',
    name: 'Roberto Garcia',
    email: 'treasurer@barangaybitano.gov.ph',
    position: 'Barangay Treasurer',
    role: 'TREASURER',
    employeeId: 'BT-001',
    department: 'Finance Office',
    phoneNumber: '(052) 742-0125',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-19',
    lastActiveAt: '2024-08-20T16:45:00',
    loginCount: 142,
    projectsManaged: 1,
    tasksCompleted: 45,
    eventsOrganized: 2,
    documentsUploaded: 67,
  },
  {
    id: '4',
    clerkUserId: 'councilor1_101',
    name: 'Ana Reyes',
    email: 'councilor1@barangaybitano.gov.ph',
    position: 'Barangay Councilor - Education Committee',
    role: 'COUNCILOR',
    employeeId: 'BC-101',
    department: 'Education Committee',
    phoneNumber: '(052) 742-0126',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-18',
    lastActiveAt: '2024-08-19T14:20:00',
    loginCount: 98,
    projectsManaged: 3,
    tasksCompleted: 67,
    eventsOrganized: 8,
    documentsUploaded: 34,
  },
  {
    id: '5',
    clerkUserId: 'councilor2_102',
    name: 'Carlos Mendoza',
    email: 'councilor2@barangaybitano.gov.ph',
    position: 'Barangay Councilor - Health Committee',
    role: 'COUNCILOR',
    employeeId: 'BC-102',
    department: 'Health Committee',
    phoneNumber: '(052) 742-0127',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-17',
    lastActiveAt: '2024-08-18T10:30:00',
    loginCount: 76,
    projectsManaged: 2,
    tasksCompleted: 43,
    eventsOrganized: 5,
    documentsUploaded: 21,
  },
  {
    id: '6',
    clerkUserId: 'staff1_201',
    name: 'Lisa Fernandez',
    email: 'lisa.fernandez@barangaybitano.gov.ph',
    position: 'Administrative Assistant',
    role: 'STAFF',
    employeeId: 'BS-201',
    department: 'General Administration',
    phoneNumber: '(052) 742-0128',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-08-16',
    lastActiveAt: '2024-08-17T15:45:00',
    loginCount: 134,
    projectsManaged: 0,
    tasksCompleted: 156,
    eventsOrganized: 1,
    documentsUploaded: 78,
  },
  {
    id: '7',
    clerkUserId: 'staff2_202',
    name: 'Miguel Torres',
    email: 'miguel.torres@barangaybitano.gov.ph',
    position: 'Field Coordinator',
    role: 'STAFF',
    employeeId: 'BS-202',
    department: 'Field Operations',
    phoneNumber: '(052) 742-0129',
    isActive: true,
    createdAt: '2024-03-15',
    updatedAt: '2024-08-15',
    lastActiveAt: '2024-08-16T11:20:00',
    loginCount: 89,
    projectsManaged: 0,
    tasksCompleted: 98,
    eventsOrganized: 3,
    documentsUploaded: 23,
  },
  {
    id: '8',
    clerkUserId: 'admin_999',
    name: 'System Administrator',
    email: 'admin@barangaybitano.gov.ph',
    position: 'System Administrator',
    role: 'ADMIN',
    employeeId: 'ADMIN-001',
    department: 'Information Technology',
    phoneNumber: '(052) 742-0130',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-08-21',
    lastActiveAt: '2024-08-21T12:00:00',
    loginCount: 245,
    projectsManaged: 1,
    tasksCompleted: 12,
    eventsOrganized: 0,
    documentsUploaded: 45,
  },
];

const roleColors = {
  ADMIN: 'bg-red-900/20 text-red-300 border-red-700',
  BARANGAY_CAPTAIN: 'bg-purple-900/20 text-purple-300 border-purple-700',
  SECRETARY: 'bg-blue-900/20 text-blue-300 border-blue-700',
  TREASURER: 'bg-green-900/20 text-green-300 border-green-700',
  COUNCILOR: 'bg-orange-900/20 text-orange-300 border-orange-700',
  STAFF: 'bg-gray-700/20 text-gray-300 border-gray-600',
};

const roleIcons = {
  ADMIN: Crown,
  BARANGAY_CAPTAIN: Star,
  SECRETARY: UserCheck,
  TREASURER: Shield,
  COUNCILOR: Users,
  STAFF: User,
};

const getActivityStatus = (lastActiveAt: string) => {
  const lastActive = new Date(lastActiveAt);
  const now = new Date();
  const diffInHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) return { status: 'online', label: 'Online', color: 'text-green-400' };
  if (diffInHours < 24) return { status: 'recent', label: 'Recently Active', color: 'text-yellow-400' };
  if (diffInHours < 168) return { status: 'week', label: 'This Week', color: 'text-blue-400' };
  return { status: 'inactive', label: 'Inactive', color: 'text-gray-400' };
};

export function UserManagement() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<BarangayUser[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, officials: 0, online: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const canManageUsers = hasPermission(5); // Captain level and above
  const isSystemAdmin = hasPermission(6); // Admin only

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (roleFilter !== 'ALL') params.set('role', roleFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (departmentFilter !== 'ALL') params.set('department', departmentFilter);
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setDepartments(data.departments || []);
      setStats(data.stats || { total: 0, active: 0, officials: 0, online: 0 });
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
    }
  }, [canManageUsers, roleFilter, statusFilter, departmentFilter, searchTerm]);

  const filteredUsers = users;

  const UserCard = ({ user }: { user: BarangayUser }) => {
    const RoleIcon = roleIcons[user.role];
    const activity = getActivityStatus(user.lastActiveAt);
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-gray-600 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-600"
                />
              ) : (
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-gray-600">
                  <span className="text-white font-bold text-lg tracking-wide">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800",
                user.isActive ? "bg-green-400" : "bg-gray-500"
              )}></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 text-base leading-tight">{user.name}</h3>
              <p className="text-sm text-gray-300 font-medium">{user.position}</p>
              {user.employeeId && (
                <p className="text-xs text-gray-400 font-mono">ID: {user.employeeId}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border",
              roleColors[user.role]
            )}>
              <RoleIcon className="w-3 h-3" />
              {user.role.replace('_', ' ')}
            </span>
            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate font-medium">{user.email}</span>
          </div>
          {user.phoneNumber && (
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{user.phoneNumber}</span>
            </div>
          )}
          {user.department && (
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{user.department}</span>
            </div>
          )}
        </div>

        {/* Activity Status */}
        <div className="flex items-center gap-2.5 mb-5">
          <Activity className={cn("w-4 h-4", activity.color)} />
          <span className={cn("text-sm font-medium", activity.color)}>{activity.label}</span>
          <span className="text-xs text-gray-500 font-medium">
            • {user.loginCount} logins
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="text-center p-3 bg-gray-750 border border-gray-650 rounded-lg">
            <p className="text-xl font-bold text-gray-100">{user.projectsManaged}</p>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Projects</p>
          </div>
          <div className="text-center p-3 bg-gray-750 border border-gray-650 rounded-lg">
            <p className="text-xl font-bold text-gray-100">{user.tasksCompleted}</p>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Tasks</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-all" title="View Profile">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-all" title="Send Message">
              <Mail className="w-4 h-4" />
            </button>
            {canManageUsers && (
              <button className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded transition-all" title="Edit User">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isSystemAdmin && (
              <>
                <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded transition-all" title="Reset Password">
                  <Key className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-all" title="Deactivate">
                  <UserX className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">Access Restricted</h3>
        <p className="text-gray-400">You don&apos;t have permission to manage users.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="h-12 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">Error Loading Users</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 tracking-tight">User Management</h1>
          <p className="text-gray-400 font-medium">Manage barangay officials and staff accounts</p>
        </div>
        {isSystemAdmin && (
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900/30 border border-blue-700 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
              <p className="text-sm text-gray-400 font-medium">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-900/30 border border-green-700 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{stats.active}</p>
              <p className="text-sm text-gray-400 font-medium">Active Users</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-900/30 border border-purple-700 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{stats.officials}</p>
              <p className="text-sm text-gray-400 font-medium">Officials</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-900/30 border border-orange-700 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{stats.online}</p>
              <p className="text-sm text-gray-400 font-medium">Online Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100 placeholder-gray-400 font-medium"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100 font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="BARANGAY_CAPTAIN">Captain</option>
            <option value="SECRETARY">Secretary</option>
            <option value="TREASURER">Treasurer</option>
            <option value="COUNCILOR">Councilor</option>
            <option value="STAFF">Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100 font-medium"
          >
            <option value="ALL">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'No users have been added yet.'
            }
          </p>
          {isSystemAdmin && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add First User
            </button>
          )}
        </div>
      )}
    </div>
  );
}
