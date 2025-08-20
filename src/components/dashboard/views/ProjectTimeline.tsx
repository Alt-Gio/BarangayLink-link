"use client";

import { useState, useMemo } from 'react';
import { 
  Calendar, 
  ArrowLeft, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  MoreHorizontal,
  Filter,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  dependencies: string[];
  milestoneId?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'PENDING' | 'ACHIEVED' | 'DELAYED' | 'CANCELLED';
  tasks: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  manager: string;
  team: string[];
  tasks: Task[];
  milestones: Milestone[];
}

const mockProject: Project = {
  id: '1',
  title: 'New Health Center Construction',
  description: 'Construction of a modern health center to serve the barangay community with better medical facilities and services.',
  status: 'IN_PROGRESS',
  startDate: '2024-06-01',
  endDate: '2024-12-15',
  budget: 5000000,
  spent: 2100000,
  progress: 45,
  manager: 'Juan de la Cruz (Captain)',
  team: ['Maria Santos (Secretary)', 'Roberto Garcia (Treasurer)', 'Ana Reyes (Councilor)', 'Miguel Torres (Staff)'],
  milestones: [
    {
      id: 'ms1',
      title: 'Site Preparation Completed',
      description: 'Land clearing, surveying, and foundation preparation',
      targetDate: '2024-07-15',
      status: 'ACHIEVED',
      tasks: ['t1', 't2', 't3']
    },
    {
      id: 'ms2',
      title: 'Foundation & Structure',
      description: 'Foundation laying and basic structure completion',
      targetDate: '2024-09-30',
      status: 'PENDING',
      tasks: ['t4', 't5', 't6']
    },
    {
      id: 'ms3',
      title: 'Interior & Equipment',
      description: 'Interior finishing and medical equipment installation',
      targetDate: '2024-11-30',
      status: 'PENDING',
      tasks: ['t7', 't8', 't9']
    },
    {
      id: 'ms4',
      title: 'Project Completion',
      description: 'Final inspection, testing, and facility handover',
      targetDate: '2024-12-15',
      status: 'PENDING',
      tasks: ['t10', 't11']
    }
  ],
  tasks: [
    {
      id: 't1',
      title: 'Land Survey and Planning',
      description: 'Conduct detailed land survey and create construction plans',
      assignedTo: 'ext1',
      assignedToName: 'ABC Surveying Co.',
      status: 'COMPLETED',
      priority: 'HIGH',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      estimatedHours: 120,
      actualHours: 115,
      progress: 100,
      dependencies: [],
      milestoneId: 'ms1'
    },
    {
      id: 't2',
      title: 'Site Clearing and Preparation',
      description: 'Clear the construction site and prepare the area',
      assignedTo: 'staff1',
      assignedToName: 'Miguel Torres (Staff)',
      status: 'COMPLETED',
      priority: 'HIGH',
      startDate: '2024-06-16',
      endDate: '2024-06-30',
      estimatedHours: 200,
      actualHours: 190,
      progress: 100,
      dependencies: ['t1'],
      milestoneId: 'ms1'
    },
    {
      id: 't3',
      title: 'Permits and Documentation',
      description: 'Obtain all necessary construction permits and documentation',
      assignedTo: 'secretary',
      assignedToName: 'Maria Santos (Secretary)',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      startDate: '2024-06-01',
      endDate: '2024-07-15',
      estimatedHours: 80,
      actualHours: 95,
      progress: 100,
      dependencies: [],
      milestoneId: 'ms1'
    },
    {
      id: 't4',
      title: 'Foundation Excavation',
      description: 'Excavate and prepare foundation according to architectural plans',
      assignedTo: 'ext2',
      assignedToName: 'XYZ Construction',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: '2024-07-16',
      endDate: '2024-08-15',
      estimatedHours: 300,
      actualHours: 180,
      progress: 65,
      dependencies: ['t2', 't3'],
      milestoneId: 'ms2'
    },
    {
      id: 't5',
      title: 'Foundation Concrete Work',
      description: 'Pour concrete foundation and structural elements',
      assignedTo: 'ext2',
      assignedToName: 'XYZ Construction',
      status: 'NOT_STARTED',
      priority: 'HIGH',
      startDate: '2024-08-16',
      endDate: '2024-09-15',
      estimatedHours: 250,
      actualHours: 0,
      progress: 0,
      dependencies: ['t4'],
      milestoneId: 'ms2'
    },
    {
      id: 't6',
      title: 'Structural Framework',
      description: 'Construct main structural framework and walls',
      assignedTo: 'ext2',
      assignedToName: 'XYZ Construction',
      status: 'NOT_STARTED',
      priority: 'HIGH',
      startDate: '2024-09-16',
      endDate: '2024-09-30',
      estimatedHours: 400,
      actualHours: 0,
      progress: 0,
      dependencies: ['t5'],
      milestoneId: 'ms2'
    },
    {
      id: 't7',
      title: 'Electrical and Plumbing',
      description: 'Install electrical wiring and plumbing systems',
      assignedTo: 'ext3',
      assignedToName: 'Tech Solutions Inc.',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      startDate: '2024-10-01',
      endDate: '2024-10-30',
      estimatedHours: 320,
      actualHours: 0,
      progress: 0,
      dependencies: ['t6'],
      milestoneId: 'ms3'
    },
    {
      id: 't8',
      title: 'Interior Finishing',
      description: 'Complete interior walls, flooring, and ceiling work',
      assignedTo: 'ext2',
      assignedToName: 'XYZ Construction',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      startDate: '2024-11-01',
      endDate: '2024-11-20',
      estimatedHours: 280,
      actualHours: 0,
      progress: 0,
      dependencies: ['t7'],
      milestoneId: 'ms3'
    },
    {
      id: 't9',
      title: 'Medical Equipment Installation',
      description: 'Install and setup medical equipment and furniture',
      assignedTo: 'councilor1',
      assignedToName: 'Ana Reyes (Councilor)',
      status: 'NOT_STARTED',
      priority: 'HIGH',
      startDate: '2024-11-21',
      endDate: '2024-11-30',
      estimatedHours: 150,
      actualHours: 0,
      progress: 0,
      dependencies: ['t8'],
      milestoneId: 'ms3'
    },
    {
      id: 't10',
      title: 'Final Inspection',
      description: 'Conduct comprehensive inspection and testing of all systems',
      assignedTo: 'captain',
      assignedToName: 'Juan de la Cruz (Captain)',
      status: 'NOT_STARTED',
      priority: 'CRITICAL',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      estimatedHours: 60,
      actualHours: 0,
      progress: 0,
      dependencies: ['t9'],
      milestoneId: 'ms4'
    },
    {
      id: 't11',
      title: 'Project Handover',
      description: 'Complete documentation and facility handover to health department',
      assignedTo: 'secretary',
      assignedToName: 'Maria Santos (Secretary)',
      status: 'NOT_STARTED',
      priority: 'HIGH',
      startDate: '2024-12-11',
      endDate: '2024-12-15',
      estimatedHours: 40,
      actualHours: 0,
      progress: 0,
      dependencies: ['t10'],
      milestoneId: 'ms4'
    },
  ]
};

const statusColors = {
  NOT_STARTED: 'bg-gray-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  BLOCKED: 'bg-red-500',
  ON_HOLD: 'bg-yellow-500',
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const milestoneStatusColors = {
  PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  ACHIEVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  DELAYED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export function ProjectTimeline({ projectId }: { projectId: string }) {
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt' | 'kanban'>('timeline');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showMilestones, setShowMilestones] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentWeek, setCurrentWeek] = useState(0);

  const project = mockProject; // In real app, fetch by projectId

  const getDaysFromStart = (dateStr: string): number => {
    const startDate = new Date(project.startDate);
    const targetDate = new Date(dateStr);
    const diffTime = targetDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProjectDuration = (): number => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTaskWidth = (task: Task): number => {
    const startDay = getDaysFromStart(task.startDate);
    const endDay = getDaysFromStart(task.endDate);
    const duration = endDay - startDay + 1;
    const totalDays = getProjectDuration();
    return (duration / totalDays) * 100;
  };

  const getTaskPosition = (task: Task): number => {
    const startDay = getDaysFromStart(task.startDate);
    const totalDays = getProjectDuration();
    return (startDay / totalDays) * 100;
  };

  const filteredTasks = project.tasks.filter(task => {
    if (filterStatus === 'ALL') return true;
    return task.status === filterStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aStart = new Date(a.startDate).getTime();
    const bStart = new Date(b.startDate).getTime();
    return aStart - bStart;
  });

  const criticalPath = useMemo(() => {
    // Simple critical path calculation - tasks with dependencies and high priority
    return project.tasks.filter(task => 
      task.dependencies.length > 0 || task.priority === 'CRITICAL'
    ).map(task => task.id);
  }, [project.tasks]);

  const TaskBar = ({ task }: { task: Task }) => {
    const width = getTaskWidth(task);
    const position = getTaskPosition(task);
    const isCritical = criticalPath.includes(task.id);
    const isSelected = selectedTask === task.id;

    return (
      <div className="relative mb-1">
        <div
          className="absolute h-6 rounded cursor-pointer group transition-all duration-200 hover:h-8 hover:-mt-1"
          style={{
            left: `${position}%`,
            width: `${width}%`,
            backgroundColor: isCritical ? '#ef4444' : statusColors[task.status],
          }}
          onClick={() => setSelectedTask(task.id)}
        >
          {/* Progress overlay */}
          <div
            className="h-full bg-green-400 rounded opacity-80"
            style={{ width: `${task.progress}%` }}
          />
          
          {/* Task info tooltip */}
          <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
            <div className="font-medium">{task.title}</div>
            <div>{task.assignedToName}</div>
            <div>{task.progress}% complete</div>
          </div>
        </div>
        
        {/* Task label */}
        <div
          className={cn(
            "absolute top-0 text-xs font-medium text-gray-300 truncate",
            isSelected ? "text-green-400" : ""
          )}
          style={{
            left: `${position}%`,
            width: `${Math.max(width, 20)}%`,
          }}
        >
          {task.title}
        </div>
      </div>
    );
  };

  const renderTimelineView = () => (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Project Timeline</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Scale */}
        <div className="relative mb-6" style={{ transform: `scaleX(${zoomLevel})` }}>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            {Array.from({ length: 13 }, (_, i) => {
              const date = new Date(project.startDate);
              date.setMonth(date.getMonth() + i);
              return (
                <div key={i} className="text-center">
                  {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                </div>
              );
            })}
          </div>
          <div className="h-px bg-gray-600" />
        </div>

        {/* Milestones */}
        {showMilestones && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Milestones</h4>
            <div className="relative" style={{ transform: `scaleX(${zoomLevel})` }}>
              {project.milestones.map(milestone => {
                const position = getDaysFromStart(milestone.targetDate);
                const totalDays = getProjectDuration();
                const leftPosition = (position / totalDays) * 100;

                return (
                  <div
                    key={milestone.id}
                    className="absolute top-0"
                    style={{ left: `${leftPosition}%` }}
                  >
                    <div className="w-3 h-3 bg-yellow-500 rotate-45 mb-1" />
                    <div className="text-xs text-gray-300 whitespace-nowrap -ml-8">
                      {milestone.title}
                    </div>
                    <div className={cn(
                      "text-xs px-1 rounded whitespace-nowrap -ml-6 mt-1",
                      milestoneStatusColors[milestone.status]
                    )}>
                      {milestone.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300">Tasks</h4>
          <div className="relative" style={{ transform: `scaleX(${zoomLevel})`, minHeight: '300px' }}>
            {sortedTasks.map((task, index) => (
              <div key={task.id} style={{ marginTop: `${index * 32}px` }}>
                <TaskBar task={task} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Details */}
      {selectedTask && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          {(() => {
            const task = project.tasks.find(t => t.id === selectedTask);
            if (!task) return null;

            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">{task.title}</h3>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Task Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className={cn(
                          "ml-2 px-2 py-1 rounded text-xs",
                          task.status === 'COMPLETED' ? "bg-green-900 text-green-300" :
                          task.status === 'IN_PROGRESS' ? "bg-blue-900 text-blue-300" :
                          task.status === 'BLOCKED' ? "bg-red-900 text-red-300" :
                          "bg-gray-900 text-gray-300"
                        )}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Priority:</span>
                        <span className={cn("ml-2 px-2 py-1 rounded text-xs", priorityColors[task.priority])}>
                          {task.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Progress:</span>
                        <span className="ml-2 text-gray-100">{task.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Assignment</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Assigned to:</span>
                        <span className="ml-2 text-gray-100">{task.assignedToName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Estimated:</span>
                        <span className="ml-2 text-gray-100">{task.estimatedHours}h</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Actual:</span>
                        <span className="ml-2 text-gray-100">{task.actualHours}h</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Start:</span>
                        <span className="ml-2 text-gray-100">
                          {new Date(task.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">End:</span>
                        <span className="ml-2 text-gray-100">
                          {new Date(task.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="ml-2 text-gray-100">
                          {Math.ceil((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {task.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-300 mb-2">Description</h4>
                    <p className="text-sm text-gray-400">{task.description}</p>
                  </div>
                )}

                {task.dependencies.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-300 mb-2">Dependencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.dependencies.map(depId => {
                        const depTask = project.tasks.find(t => t.id === depId);
                        return depTask ? (
                          <span key={depId} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                            {depTask.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
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
          <p className="text-gray-400">Project Timeline & Task Management</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm"
          >
            <option value="ALL">All Tasks</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{project.progress}%</p>
              <p className="text-sm text-gray-400">Overall Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {project.tasks.filter(t => t.status === 'COMPLETED').length}/{project.tasks.length}
              </p>
              <p className="text-sm text-gray-400">Tasks Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-gray-400">Days Remaining</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                ₱{(project.spent / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-400">Budget Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={cn(
              "px-3 py-2 rounded text-sm font-medium transition-colors",
              viewMode === 'timeline' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"
            )}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={cn(
              "px-3 py-2 rounded text-sm font-medium transition-colors",
              viewMode === 'gantt' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"
            )}
          >
            Gantt Chart
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              "px-3 py-2 rounded text-sm font-medium transition-colors",
              viewMode === 'kanban' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"
            )}
          >
            Kanban
          </button>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showMilestones}
            onChange={(e) => setShowMilestones(e.target.checked)}
            className="rounded border-gray-600 text-green-600 focus:ring-green-500 bg-gray-800"
          />
          <span className="text-sm text-gray-300">Show Milestones</span>
        </label>
      </div>

      {/* Main Content */}
      {viewMode === 'timeline' && renderTimelineView()}
      {viewMode === 'gantt' && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">Gantt Chart View</h3>
          <p className="text-gray-400">Advanced Gantt chart visualization coming soon.</p>
        </div>
      )}
      {viewMode === 'kanban' && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">Kanban Board View</h3>
          <p className="text-gray-400">Task kanban board visualization coming soon.</p>
        </div>
      )}
    </div>
  );
}
