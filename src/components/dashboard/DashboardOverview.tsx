"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  CheckSquare, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  DollarSign,
  Target,
  FileText,
  Activity,
  Zap,
  ArrowUpRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  upcomingEvents: number;
  teamMembers: number;
  totalBudget: number;
  completedProjectsThisMonth: number;
  overdueItems: number;
  changes: {
    projects: number;
    tasks: number;
    users: number;
  };
  performance: {
    projectCompletion: number;
    onTimeDelivery: number;
    budgetEfficiency: number;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  user: string;
  status: string;
}

export function DashboardOverview() {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activity')
      ]);

      if (!statsResponse.ok || !activitiesResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const statsData = await statsResponse.json();
      const activitiesData = await activitiesResponse.json();

      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format stats for display
  const formatStats = (stats: DashboardStats) => [
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: FolderOpen,
      color: 'blue',
      change: stats.changes.projects > 0 ? `+${stats.changes.projects} from last month` : 
              stats.changes.projects < 0 ? `${stats.changes.projects} from last month` :
              'No change from last month',
      href: '/dashboard/projects'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      change: stats.changes.tasks > 0 ? `+${stats.changes.tasks} this week` :
              stats.changes.tasks === 0 ? 'No new tasks this week' :
              'Tasks completed this week',
      href: '/dashboard/tasks'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents.toString(),
      icon: Calendar,
      color: 'purple',
      change: stats.upcomingEvents > 0 ? `${stats.upcomingEvents} events scheduled` : 'No upcoming events',
      href: '/dashboard/events'
    },
    {
      title: 'Team Members',
      value: stats.teamMembers.toString(),
      icon: Users,
      color: 'green',
      change: stats.changes.users > 0 ? `+${stats.changes.users} new members` :
              stats.changes.users === 0 ? 'No new members this month' :
              'Stable team size',
      href: '/dashboard/admin/users'
    },
  ];

  // Quick actions configuration
  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start a new barangay project',
      icon: FolderOpen,
      href: '/dashboard/projects/create',
      color: 'bg-blue-600 hover:bg-blue-700',
      permission: 3
    },
    {
      title: 'Add Task',
      description: 'Create and assign a new task',
      icon: CheckSquare,
      href: '/dashboard/tasks/create',
      color: 'bg-green-600 hover:bg-green-700',
      permission: 3
    },
    {
      title: 'Schedule Event',
      description: 'Organize a community event',
      icon: Calendar,
      href: '/dashboard/events/create',
      color: 'bg-purple-600 hover:bg-purple-700',
      permission: 3
    },
    {
      title: 'Upload Document',
      description: 'Add new documents to library',
      icon: FileText,
      href: '/dashboard/documents/upload',
      color: 'bg-orange-600 hover:bg-orange-700',
      permission: 1
    },
  ];

  // Utility functions
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return FolderOpen;
      case 'task': return CheckSquare;
      case 'event': return Calendar;
      case 'document': return FileText;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'planned': return 'text-purple-400';
      case 'uploaded': return 'text-orange-400';
      case 'todo': return 'text-yellow-400';
      case 'done': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Loading Dashboard...</h1>
          <p className="text-green-100">Please wait while we fetch your data.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const displayStats = formatStats(stats);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'Administrator'}!
        </h1>
        <p className="text-green-100">
          Here's what's happening in your barangay today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-900/20 text-blue-400',
            orange: 'bg-orange-900/20 text-orange-400',
            purple: 'bg-purple-900/20 text-purple-400',
            green: 'bg-green-900/20 text-green-400',
          };

          return (
            <Link
              key={index}
              href={stat.href}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Additional Stats Row */}
      {stats.overdueItems > 0 && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <p className="font-medium text-red-300">
                {stats.overdueItems} Overdue Items
              </p>
              <p className="text-sm text-red-400">
                Projects and tasks that need immediate attention
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-100">Recent Activity</h2>
            <Link 
              href="/dashboard/activity" 
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <ActivityIcon className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-100 truncate">{activity.title}</p>
                      <p className="text-sm text-gray-400 truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className={`text-xs ${getStatusColor(activity.status)}`}>
                          {activity.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No recent activities</p>
                <p className="text-sm text-gray-500">Start by creating a project or task</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-100">Quick Actions</h2>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              const canAccess = !action.permission || hasPermission(action.permission);
              
              if (!canAccess) return null;
              
              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`${action.color} text-white p-4 rounded-lg transition-colors group`}
                >
                  <div className="flex items-center gap-3">
                    <ActionIcon className="w-5 h-5" />
                    <div className="flex-1">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                    <Plus className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-100">Performance Overview</h2>
          <button
            onClick={fetchDashboardData}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-100 mb-1">Project Completion</h3>
            <p className="text-2xl font-bold text-green-400 mb-1">{stats.performance.projectCompletion}%</p>
            <p className="text-sm text-gray-400">Average completion rate</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-100 mb-1">On-Time Delivery</h3>
            <p className="text-2xl font-bold text-blue-400 mb-1">{stats.performance.onTimeDelivery}%</p>
            <p className="text-sm text-gray-400">Projects delivered on time</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-100 mb-1">Budget Efficiency</h3>
            <p className="text-2xl font-bold text-purple-400 mb-1">{stats.performance.budgetEfficiency}%</p>
            <p className="text-sm text-gray-400">Average budget utilization</p>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-300 mb-2">Total Project Budget</h4>
              <p className="text-xl font-bold text-green-400">
                ₱{stats.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-300 mb-2">Completed This Month</h4>
              <p className="text-xl font-bold text-blue-400">
                {stats.completedProjectsThisMonth} Projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">System Status</h2>
        
        <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-300 font-medium">All systems operational</span>
          </div>
          <span className="text-sm text-green-400">Last updated: 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
}