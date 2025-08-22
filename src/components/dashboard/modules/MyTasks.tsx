"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Pause, 
  Play, 
  MoreHorizontal,
  Calendar,
  Target,
  Flag,
  Users,
  MessageSquare,
  Paperclip,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  RefreshCw,
  Loader2,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Zap,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  dueDate: string | null;
  startDate: string | null;
  completedDate: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  project: {
    id: string;
    name: string;
    category: string;
  };
  assignees: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  checklists: Array<{
    id: string;
    text: string;
    completed: boolean;
    order: number;
  }>;
  _count: {
    attachments: number;
    comments: number;
  };
}

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  blocked: number;
  completed: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

const statusColors = {
  TODO: 'bg-gray-800 text-gray-300 border-gray-700',
  IN_PROGRESS: 'bg-blue-900/20 text-blue-300 border-blue-700',
  REVIEW: 'bg-purple-900/20 text-purple-300 border-purple-700',
  COMPLETED: 'bg-green-900/20 text-green-300 border-green-700',
  CANCELLED: 'bg-red-900/20 text-red-300 border-red-700',
  BLOCKED: 'bg-red-900/20 text-red-300 border-red-700',
  ON_HOLD: 'bg-yellow-900/20 text-yellow-300 border-yellow-700',
};

const priorityColors = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-orange-400',
  URGENT: 'text-yellow-400',
  CRITICAL: 'text-red-400',
};

const priorityIcons = {
  LOW: Minus,
  MEDIUM: ArrowRight,
  HIGH: ArrowUp,
  URGENT: ArrowUp,
  CRITICAL: ArrowUp,
};

const statusIcons = {
  TODO: Clock,
  IN_PROGRESS: Play,
  REVIEW: Eye,
  COMPLETED: CheckCircle,
  CANCELLED: AlertTriangle,
  BLOCKED: AlertTriangle,
  ON_HOLD: Pause,
};

export function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Fetch my tasks from database
  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tasks/my-tasks');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data || []);
      
      // Calculate stats from fetched data
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);

      const taskStats: TaskStats = {
        total: data?.length || 0,
        todo: data?.filter((t: Task) => t.status === 'TODO').length || 0,
        inProgress: data?.filter((t: Task) => t.status === 'IN_PROGRESS').length || 0,
        review: data?.filter((t: Task) => t.status === 'REVIEW').length || 0,
        blocked: data?.filter((t: Task) => t.status === 'BLOCKED').length || 0,
        completed: data?.filter((t: Task) => t.status === 'COMPLETED').length || 0,
        overdue: data?.filter((t: Task) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'COMPLETED').length || 0,
        dueToday: data?.filter((t: Task) => t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()).length || 0,
        dueThisWeek: data?.filter((t: Task) => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) <= weekEnd).length || 0,
      };
      
      setStats(taskStats);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  // Update task status
  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to update task');
      }

      // Refresh tasks list
      fetchMyTasks();
      toast.success('Task status updated successfully!');
    } catch (err) {
      console.error('Error updating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      toast.error(errorMessage);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to delete task');
      }

      // Refresh tasks list
      fetchMyTasks();
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(errorMessage);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || task.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date < today) {
      return `Overdue (${date.toLocaleDateString()})`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getProgressPercentage = (task: Task) => {
    if (task.status === 'COMPLETED') return 100;
    if (task.checklists && task.checklists.length > 0) {
      const completed = task.checklists.filter(item => item.completed).length;
      return Math.round((completed / task.checklists.length) * 100);
    }
    return 0;
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = statusIcons[task.status];
    const PriorityIcon = priorityIcons[task.priority];
    const progress = getProgressPercentage(task);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 text-lg leading-tight">{task.title}</h3>
              <p className="text-sm text-gray-400">{task.project.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriorityIcon className={cn("w-4 h-4", priorityColors[task.priority])} />
            <div className="relative">
              <button className="p-1 hover:bg-gray-700 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border",
            statusColors[task.status]
          )}>
            {task.status.replace('_', ' ')}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className={cn(isOverdue && "text-red-400")}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          {task.estimatedHours && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Est: {task.estimatedHours}h</span>
            </div>
          )}
          {task.actualHours && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Actual: {task.actualHours}h</span>
            </div>
          )}
          {task.checklists && task.checklists.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckSquare className="w-4 h-4" />
              <span>{task.checklists.filter(item => item.completed).length}/{task.checklists.length} completed</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <StatusIcon className={cn(
              "w-4 h-4",
              task.status === 'COMPLETED' ? "text-green-400" :
              task.status === 'BLOCKED' ? "text-red-400" :
              task.status === 'IN_PROGRESS' ? "text-blue-400" : "text-gray-400"
            )} />
            <span className="text-xs text-gray-400">
              {task.status === 'COMPLETED' ? 'Completed' : 
               task.status === 'IN_PROGRESS' ? 'In Progress' : 
               task.status === 'BLOCKED' ? 'Blocked' : 'Pending'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Link 
              href={`/dashboard/tasks/${task.id}`}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link 
              href={`/dashboard/tasks/${task.id}/edit`}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded"
              title="Edit Task"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => handleDeleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">My Tasks</h1>
          <p className="text-gray-400">Manage and track your assigned tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard/tasks/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Link>
          <button 
            onClick={fetchMyTasks}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Failed to Load Tasks</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchMyTasks}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.total || 0}</p>
              )}
              <p className="text-sm text-gray-400">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.completed || 0}</p>
              )}
              <p className="text-sm text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.dueToday || 0}</p>
              )}
              <p className="text-sm text-gray-400">Due Today</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.overdue || 0}</p>
              )}
              <p className="text-sm text-gray-400">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                viewMode === 'kanban' 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              )}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                viewMode === 'list' 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              )}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {!loading && filteredTasks.length === 0 && !error && (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No tasks found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'You have no tasks assigned to you yet.'
            }
          </p>
          <Link 
            href="/dashboard/tasks/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </Link>
        </div>
      )}
    </div>
  );
}
