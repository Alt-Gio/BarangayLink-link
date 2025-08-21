"use client";

import { useState, useEffect } from 'react';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
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
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
}



const statusColumns = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-800 border-gray-700', count: 0 },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-900/20 border-blue-700', count: 0 },
  { id: 'REVIEW', title: 'Review', color: 'bg-purple-900/20 border-purple-700', count: 0 },
  { id: 'BLOCKED', title: 'Blocked', color: 'bg-red-900/20 border-red-700', count: 0 },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-900/20 border-green-700', count: 0 },
];

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

export function TaskManagement() {
  const { hasPermission } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const canCreate = hasPermission(MODULE_PERMISSIONS.TASK_MANAGEMENT.CREATE);
  const canEdit = hasPermission(MODULE_PERMISSIONS.TASK_MANAGEMENT.EDIT);
  const canAssign = hasPermission(MODULE_PERMISSIONS.TASK_MANAGEMENT.ASSIGN);

  // Fetch tasks from database
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tasks');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data || []);
      
      // Calculate stats from fetched data
      const taskStats: TaskStats = {
        total: data?.length || 0,
        todo: data?.filter((t: Task) => t.status === 'TODO').length || 0,
        inProgress: data?.filter((t: Task) => t.status === 'IN_PROGRESS').length || 0,
        review: data?.filter((t: Task) => t.status === 'REVIEW').length || 0,
        blocked: data?.filter((t: Task) => t.status === 'BLOCKED').length || 0,
        completed: data?.filter((t: Task) => t.status === 'COMPLETED').length || 0,
      };
      
      setStats(taskStats);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
      fetchTasks();
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
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || task.projectId === projectFilter;
    const matchesAssignee = assigneeFilter === 'ALL' || task.assignees.some(assignee => assignee.id === assigneeFilter);
    
    return matchesSearch && matchesPriority && matchesProject && matchesAssignee;
  });

  // Count tasks in each column
  const columnsWithCounts = statusColumns.map(column => ({
    ...column,
    count: filteredTasks.filter(task => task.status === column.id).length
  }));

  const projects = Array.from(new Set(tasks.map(task => task.project.name).filter(Boolean)));
  const assignees = Array.from(new Set(tasks.flatMap(task => task.assignees.map(a => a.name))));

  const TaskCard = ({ task }: { task: Task }) => {
    const PriorityIcon = priorityIcons[task.priority];
    const StatusIcon = statusIcons[task.status];
    const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' : false;
    const completedChecklists = task.checklists.filter(checklist => checklist.completed).length;
    const progressPercentage = task.checklists.length > 0 ? (completedChecklists / task.checklists.length) * 100 : 0;

    return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={() => setSelectedTask(task.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">#{task.id}</span>
          </div>
          <div className="flex items-center gap-1">
            <PriorityIcon className={cn("w-4 h-4", priorityColors[task.priority])} />
            {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400" />}
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded">
              <MoreHorizontal className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="font-medium text-gray-100 mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>

        {/* Project Badge */}
        {task.project.name && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 bg-blue-900/20 text-blue-300 rounded text-xs">
              <Target className="w-3 h-3 mr-1" />
              {task.project.name}
            </span>
          </div>
        )}

        {/* Progress */}
        {task.checklists.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Checklist</span>
              <span>{completedChecklists}/{task.checklists.length}</span>
            </div>
            <div className="bg-gray-700 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
              {task.assignedToName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKanbanView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {columnsWithCounts.map(column => (
        <div key={column.id} className={cn("rounded-lg border p-4", column.color)}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">{column.title}</h3>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
              {column.count}
            </span>
          </div>
          
          <div className="min-h-[400px]">
            {filteredTasks
              .filter(task => task.status === column.id)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
          
          {canCreate && (
            <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTasks.map(task => {
              const progressPercentage = task.subtasks > 0 ? (task.completedSubtasks / task.subtasks) * 100 : 0;
              const PriorityIcon = priorityIcons[task.priority];
              
              return (
                <tr key={task.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-100">{task.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">{task.description}</div>
                      {task.projectName && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-900/20 text-blue-300 rounded text-xs">
                            {task.projectName}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      task.status === 'TODO' ? "bg-gray-700 text-gray-300" :
                      task.status === 'IN_PROGRESS' ? "bg-blue-900/20 text-blue-300" :
                      task.status === 'REVIEW' ? "bg-purple-900/20 text-purple-300" :
                      task.status === 'BLOCKED' ? "bg-red-900/20 text-red-300" :
                      "bg-green-900/20 text-green-300"
                    )}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <PriorityIcon className={cn("w-4 h-4", priorityColors[task.priority])} />
                      <span className="text-sm text-gray-300">{task.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                        {task.assignedToName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm text-gray-300">{task.assignedToName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {task.subtasks > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{Math.round(progressPercentage)}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No subtasks</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <button className="p-1 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Task Management</h1>
          <p className="text-gray-400">Organize, assign, and track project tasks</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {statusColumns.map(column => {
          const count = tasks.filter(task => task.status === column.id).length;
          const StatusIcon = statusIcons[column.id];
          
          return (
            <div key={column.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <StatusIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{count}</p>
                  <p className="text-sm text-gray-400">{column.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
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
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Projects</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Assignees</option>
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-gray-700 border border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                viewMode === 'kanban' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"
              )}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                viewMode === 'list' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"
              )}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'kanban' ? renderKanbanView() : renderListView()}

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No tasks found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || priorityFilter !== 'ALL' || projectFilter !== 'ALL' || assigneeFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first task.'
            }
          </p>
          {canCreate && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          )}
        </div>
      )}
    </div>
  );
}