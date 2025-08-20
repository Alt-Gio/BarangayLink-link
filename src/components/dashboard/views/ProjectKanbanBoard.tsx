"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar, 
  Clock, 
  Flag, 
  Paperclip, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  Users, 
  Filter, 
  Search, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Move,
  Copy,
  Star,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo: string[];
  assignedToNames: string[];
  tags: string[];
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  attachments: number;
  comments: number;
  subtasks: number;
  completedSubtasks: number;
  storyPoints: number;
  blockers: string[];
  dependencies: string[];
  epic?: string;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  description: string;
  color: string;
  limit?: number;
  tasks: Task[];
  isCollapsed: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  teamSize: number;
  sprintGoal: string;
  sprintEndDate: string;
}

const mockProject: Project = {
  id: '1',
  title: 'New Health Center Construction',
  description: 'Construction of a modern health center to serve the barangay community',
  status: 'IN_PROGRESS',
  progress: 65,
  totalTasks: 24,
  completedTasks: 15,
  teamSize: 8,
  sprintGoal: 'Complete foundation and structural work by month end',
  sprintEndDate: '2024-09-30',
};

const mockColumns: Column[] = [
  {
    id: 'BACKLOG',
    title: 'Backlog',
    description: 'Ideas and future tasks',
    color: 'bg-gray-700 border-gray-600',
    tasks: [],
    isCollapsed: false,
  },
  {
    id: 'TODO',
    title: 'To Do',
    description: 'Ready to start',
    color: 'bg-blue-900/20 border-blue-700',
    limit: 5,
    tasks: [],
    isCollapsed: false,
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    description: 'Currently working on',
    color: 'bg-yellow-900/20 border-yellow-700',
    limit: 3,
    tasks: [],
    isCollapsed: false,
  },
  {
    id: 'REVIEW',
    title: 'Review',
    description: 'Pending review/approval',
    color: 'bg-purple-900/20 border-purple-700',
    limit: 4,
    tasks: [],
    isCollapsed: false,
  },
  {
    id: 'TESTING',
    title: 'Testing',
    description: 'Quality assurance',
    color: 'bg-orange-900/20 border-orange-700',
    tasks: [],
    isCollapsed: false,
  },
  {
    id: 'DONE',
    title: 'Done',
    description: 'Completed tasks',
    color: 'bg-green-900/20 border-green-700',
    tasks: [],
    isCollapsed: false,
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Site Survey and Planning',
    description: 'Conduct detailed survey and create construction plans',
    status: 'DONE',
    priority: 'HIGH',
    assignedTo: ['ext1', 'survey'],
    assignedToNames: ['ABC Surveying Co.', 'Survey Team'],
    tags: ['survey', 'planning', 'foundation'],
    dueDate: '2024-06-15',
    estimatedHours: 40,
    actualHours: 38,
    attachments: 5,
    comments: 8,
    subtasks: 6,
    completedSubtasks: 6,
    storyPoints: 8,
    blockers: [],
    dependencies: [],
    epic: 'Site Preparation',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-14',
  },
  {
    id: '2',
    title: 'Foundation Excavation',
    description: 'Excavate and prepare foundation according to specifications',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedTo: ['ext2'],
    assignedToNames: ['XYZ Construction'],
    tags: ['excavation', 'foundation', 'heavy-work'],
    dueDate: '2024-08-30',
    estimatedHours: 120,
    actualHours: 85,
    attachments: 3,
    comments: 12,
    subtasks: 8,
    completedSubtasks: 5,
    storyPoints: 13,
    blockers: [],
    dependencies: ['1'],
    epic: 'Foundation Work',
    createdAt: '2024-07-15',
    updatedAt: '2024-08-20',
  },
  {
    id: '3',
    title: 'Permit Documentation',
    description: 'Prepare and submit all necessary construction permits',
    status: 'REVIEW',
    priority: 'CRITICAL',
    assignedTo: ['secretary'],
    assignedToNames: ['Maria Santos'],
    tags: ['permits', 'documentation', 'legal'],
    dueDate: '2024-07-30',
    estimatedHours: 32,
    actualHours: 35,
    attachments: 15,
    comments: 20,
    subtasks: 10,
    completedSubtasks: 9,
    storyPoints: 5,
    blockers: ['city-hall-approval'],
    dependencies: [],
    epic: 'Legal Compliance',
    createdAt: '2024-06-01',
    updatedAt: '2024-07-28',
  },
  {
    id: '4',
    title: 'Electrical System Design',
    description: 'Design comprehensive electrical system for the health center',
    status: 'TODO',
    priority: 'MEDIUM',
    assignedTo: ['electrical'],
    assignedToNames: ['ElectroTech Solutions'],
    tags: ['electrical', 'design', 'systems'],
    dueDate: '2024-09-15',
    estimatedHours: 60,
    actualHours: 0,
    attachments: 2,
    comments: 4,
    subtasks: 12,
    completedSubtasks: 0,
    storyPoints: 8,
    blockers: [],
    dependencies: ['2', '3'],
    epic: 'Infrastructure Systems',
    createdAt: '2024-08-01',
    updatedAt: '2024-08-01',
  },
  {
    id: '5',
    title: 'Plumbing Installation',
    description: 'Install water supply and drainage systems',
    status: 'TODO',
    priority: 'MEDIUM',
    assignedTo: ['plumbing'],
    assignedToNames: ['AquaFlow Plumbing'],
    tags: ['plumbing', 'water', 'drainage'],
    dueDate: '2024-09-30',
    estimatedHours: 80,
    actualHours: 0,
    attachments: 1,
    comments: 2,
    subtasks: 15,
    completedSubtasks: 0,
    storyPoints: 10,
    blockers: [],
    dependencies: ['2'],
    epic: 'Infrastructure Systems',
    createdAt: '2024-08-05',
    updatedAt: '2024-08-05',
  },
  {
    id: '6',
    title: 'Medical Equipment Procurement',
    description: 'Source and purchase necessary medical equipment',
    status: 'TESTING',
    priority: 'HIGH',
    assignedTo: ['councilor1'],
    assignedToNames: ['Ana Reyes'],
    tags: ['procurement', 'medical', 'equipment'],
    dueDate: '2024-10-15',
    estimatedHours: 40,
    actualHours: 32,
    attachments: 8,
    comments: 15,
    subtasks: 20,
    completedSubtasks: 18,
    storyPoints: 6,
    blockers: [],
    dependencies: [],
    epic: 'Equipment & Furnishing',
    createdAt: '2024-07-01',
    updatedAt: '2024-08-15',
  },
  {
    id: '7',
    title: 'Safety Inspection',
    description: 'Conduct comprehensive safety and quality inspection',
    status: 'BACKLOG',
    priority: 'CRITICAL',
    assignedTo: ['captain'],
    assignedToNames: ['Juan de la Cruz'],
    tags: ['safety', 'inspection', 'quality'],
    dueDate: '2024-11-30',
    estimatedHours: 24,
    actualHours: 0,
    attachments: 0,
    comments: 1,
    subtasks: 8,
    completedSubtasks: 0,
    storyPoints: 5,
    blockers: [],
    dependencies: ['2', '4', '5', '6'],
    epic: 'Final Inspection',
    createdAt: '2024-08-20',
    updatedAt: '2024-08-20',
  },
];

const priorityColors = {
  LOW: 'text-gray-400 border-gray-400',
  MEDIUM: 'text-blue-400 border-blue-400',
  HIGH: 'text-orange-400 border-orange-400',
  CRITICAL: 'text-red-400 border-red-400',
};

const epicColors = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-indigo-600',
];

export function ProjectKanbanBoard({ projectId }: { projectId: string }) {
  const { hasPermission } = useAuth();
  const [columns, setColumns] = useState<Column[]>(() => {
    // Distribute tasks into columns
    const columnsWithTasks = mockColumns.map(column => ({
      ...column,
      tasks: mockTasks.filter(task => task.status === column.id)
    }));
    return columnsWithTasks;
  });
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');
  const [showProductivityPanel, setShowProductivityPanel] = useState(false);

  const canEdit = hasPermission(3);
  const canAssign = hasPermission(3);

  const project = mockProject; // In real app, fetch by projectId

  const handleTaskMove = useCallback((taskId: string, fromColumn: string, toColumn: string) => {
    if (!canEdit) return;

    setColumns(prev => prev.map(column => {
      if (column.id === fromColumn) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      if (column.id === toColumn) {
        const task = prev.find(c => c.id === fromColumn)?.tasks.find(t => t.id === taskId);
        if (task) {
          return {
            ...column,
            tasks: [...column.tasks, { ...task, status: column.id as any }]
          };
        }
      }
      return column;
    }));
  }, [canEdit]);

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
      const matchesAssignee = filterAssignee === 'ALL' || task.assignedTo.includes(filterAssignee);
      
      return matchesSearch && matchesPriority && matchesAssignee;
    })
  }));

  const TaskCard = ({ task, columnId }: { task: Task; columnId: string }) => {
    const progress = task.subtasks > 0 ? (task.completedSubtasks / task.subtasks) * 100 : 0;
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DONE';
    const hasBlockers = task.blockers.length > 0;
    const epicColor = epicColors[Math.abs(task.epic?.charCodeAt(0) || 0) % epicColors.length];

    return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => setSelectedTask(task.id)}
        draggable={canEdit}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, fromColumn: columnId }));
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flag className={cn("w-3 h-3", priorityColors[task.priority])} />
            <span className="text-xs text-gray-500">#{task.id}</span>
          </div>
          <div className="flex items-center gap-1">
            {task.epic && (
              <div className={cn("w-2 h-2 rounded-full", epicColor)} title={task.epic} />
            )}
            {hasBlockers && <AlertTriangle className="w-3 h-3 text-red-400" />}
            {isOverdue && <Clock className="w-3 h-3 text-orange-400" />}
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded">
              <MoreHorizontal className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="font-medium text-gray-100 mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>

        {/* Story Points */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">{task.storyPoints} pts</span>
          </div>
          {task.estimatedHours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{task.estimatedHours}h</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {task.subtasks > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{task.completedSubtasks}/{task.subtasks}</span>
            </div>
            <div className="bg-gray-700 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                #{tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                +{task.tags.length - 3}
              </span>
            )}
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
          
          {/* Assignees */}
          <div className="flex -space-x-1">
            {task.assignedToNames.slice(0, 3).map((name, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-green-600 border-2 border-gray-800 rounded-full flex items-center justify-center text-xs text-white font-medium"
                title={name}
              >
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            ))}
            {task.assignedToNames.length > 3 && (
              <div className="w-6 h-6 bg-gray-600 border-2 border-gray-800 rounded-full flex items-center justify-center text-xs text-white">
                +{task.assignedToNames.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProductivityPanel = () => {
    const totalStoryPoints = mockTasks.reduce((sum, task) => sum + task.storyPoints, 0);
    const completedStoryPoints = mockTasks
      .filter(task => task.status === 'DONE')
      .reduce((sum, task) => sum + task.storyPoints, 0);
    
    const velocity = Math.round(completedStoryPoints * 0.8); // Sprint velocity
    const burndownData = [100, 85, 70, 60, 45, 30, 15]; // Mock burndown
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Sprint Productivity</h3>
          <button
            onClick={() => setShowProductivityPanel(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* Sprint Goal */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <h4 className="font-medium text-blue-300 mb-2">Sprint Goal</h4>
          <p className="text-sm text-blue-200">{project.sprintGoal}</p>
          <div className="mt-2 text-xs text-blue-400">
            Ends: {new Date(project.sprintEndDate).toLocaleDateString()}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{velocity}</div>
            <div className="text-xs text-gray-400">Velocity (pts/sprint)</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{Math.round((completedStoryPoints / totalStoryPoints) * 100)}%</div>
            <div className="text-xs text-gray-400">Sprint Progress</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{project.completedTasks}</div>
            <div className="text-xs text-gray-400">Tasks Completed</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{project.teamSize}</div>
            <div className="text-xs text-gray-400">Team Members</div>
          </div>
        </div>

        {/* Burndown Chart Placeholder */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-200 mb-3">Sprint Burndown</h4>
          <div className="h-20 bg-gray-600 rounded flex items-end justify-between px-2 pb-2">
            {burndownData.map((value, index) => (
              <div
                key={index}
                className="bg-green-500 w-4 rounded-t"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Days remaining in sprint
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/projects"
          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-100">{project.title}</h1>
          <p className="text-gray-400">Kanban Board - Sprint Planning & Execution</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProductivityPanel(!showProductivityPanel)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Productivity
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
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
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Assignees</option>
            <option value="ext1">ABC Surveying Co.</option>
            <option value="ext2">XYZ Construction</option>
            <option value="secretary">Maria Santos</option>
            <option value="councilor1">Ana Reyes</option>
          </select>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            )}
            <button className="p-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-300px)]">
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {filteredColumns.map(column => (
              <div
                key={column.id}
                className={cn(
                  "flex-shrink-0 w-80 rounded-xl border p-4",
                  column.color
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  handleTaskMove(data.taskId, data.fromColumn, column.id);
                }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-200 text-sm">{column.title}</h3>
                    <p className="text-xs text-gray-400">{column.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                      {column.tasks.length}
                      {column.limit && `/${column.limit}`}
                    </span>
                    <button className="p-1 hover:bg-gray-700 rounded">
                      <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* WIP Limit Warning */}
                {column.limit && column.tasks.length > column.limit && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>WIP limit exceeded!</span>
                    </div>
                  </div>
                )}

                {/* Tasks */}
                <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto">
                  {column.tasks.map(task => (
                    <TaskCard key={task.id} task={task} columnId={column.id} />
                  ))}
                </div>

                {/* Add Task Button */}
                {canEdit && (
                  <button className="w-full mt-3 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Panel */}
        {showProductivityPanel && (
          <div className="w-80 flex-shrink-0">
            <ProductivityPanel />
          </div>
        )}
      </div>
    </div>
  );
}
