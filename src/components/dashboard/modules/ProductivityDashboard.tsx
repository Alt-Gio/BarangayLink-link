"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Zap, 
  Award, 
  Calendar, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Users, 
  Flag, 
  Flame, 
  Trophy, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Loader2,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'PERSONAL' | 'TEAM' | 'PROJECT' | 'BARANGAY';
  category: 'EFFICIENCY' | 'QUALITY' | 'DELIVERY' | 'COLLABORATION' | 'INNOVATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  completedDate?: string;
  rewards: string[];
  milestones: GoalMilestone[];
  metrics: GoalMetric[];
  createdBy: {
    name: string;
  };
  assignees: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  isCompleted: boolean;
  completedDate?: string;
  reward?: string;
  order: number;
}

interface GoalMetric {
  date: string;
  value: number;
  note?: string;
}

interface ProductivityStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  completionRate: number;
  averageProgress: number;
  streak: number;
  totalPoints: number;
  level: number;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Project Delivery Excellence',
    description: 'Achieve 95% on-time project delivery rate for all barangay projects',
    type: 'BARANGAY',
    category: 'DELIVERY',
    priority: 'HIGH',
    status: 'ACTIVE',
    targetValue: 95,
    currentValue: 87,
    unit: '%',
    startDate: '2024-01-01',
    targetDate: '2024-12-31',
    assignedTo: ['all-managers'],
    assignedToNames: ['All Project Managers'],
    rewards: ['Performance Bonus', 'Team Recognition'],
    milestones: [
      { id: 'm1', title: '80% Milestone', targetValue: 80, isCompleted: true, completedDate: '2024-06-15', reward: 'Team Lunch' },
      { id: 'm2', title: '90% Milestone', targetValue: 90, isCompleted: false },
      { id: 'm3', title: '95% Target', targetValue: 95, isCompleted: false, reward: 'Performance Bonus' },
    ],
    metrics: [
      { date: '2024-01-31', value: 75 },
      { date: '2024-02-28', value: 78 },
      { date: '2024-03-31', value: 82 },
      { date: '2024-04-30', value: 85 },
      { date: '2024-05-31', value: 87 },
    ],
    createdBy: 'Juan de la Cruz',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Digital Document Processing',
    description: 'Process 100% of official documents digitally to improve efficiency',
    type: 'TEAM',
    category: 'EFFICIENCY',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    targetValue: 100,
    currentValue: 65,
    unit: '%',
    startDate: '2024-03-01',
    targetDate: '2024-09-30',
    assignedTo: ['secretary', 'staff'],
    assignedToNames: ['Maria Santos', 'Administrative Staff'],
    rewards: ['Process Improvement Award'],
    milestones: [
      { id: 'm4', title: '50% Digital', targetValue: 50, isCompleted: true, completedDate: '2024-05-15' },
      { id: 'm5', title: '75% Digital', targetValue: 75, isCompleted: false },
      { id: 'm6', title: '100% Digital', targetValue: 100, isCompleted: false, reward: 'Efficiency Award' },
    ],
    metrics: [
      { date: '2024-03-31', value: 35 },
      { date: '2024-04-30', value: 45 },
      { date: '2024-05-31', value: 55 },
      { date: '2024-06-30', value: 65 },
    ],
    createdBy: 'Maria Santos',
    createdAt: '2024-03-01',
  },
  {
    id: '3',
    title: 'Community Engagement Score',
    description: 'Increase community participation in barangay events and programs',
    type: 'BARANGAY',
    category: 'COLLABORATION',
    priority: 'HIGH',
    status: 'ACTIVE',
    targetValue: 80,
    currentValue: 72,
    unit: '%',
    startDate: '2024-02-01',
    targetDate: '2024-11-30',
    assignedTo: ['councilors', 'community-officers'],
    assignedToNames: ['All Councilors', 'Community Officers'],
    rewards: ['Community Recognition'],
    milestones: [
      { id: 'm7', title: '60% Engagement', targetValue: 60, isCompleted: true, completedDate: '2024-04-20' },
      { id: 'm8', title: '70% Engagement', targetValue: 70, isCompleted: true, completedDate: '2024-07-10' },
      { id: 'm9', title: '80% Target', targetValue: 80, isCompleted: false, reward: 'Excellence Award' },
    ],
    metrics: [
      { date: '2024-02-28', value: 55 },
      { date: '2024-03-31', value: 62 },
      { date: '2024-04-30', value: 68 },
      { date: '2024-05-31', value: 72 },
    ],
    createdBy: 'Ana Reyes',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    title: 'Budget Efficiency Optimization',
    description: 'Achieve 98% budget utilization efficiency across all projects',
    type: 'PROJECT',
    category: 'EFFICIENCY',
    priority: 'CRITICAL',
    status: 'ACTIVE',
    targetValue: 98,
    currentValue: 94,
    unit: '%',
    startDate: '2024-04-01',
    targetDate: '2024-12-31',
    assignedTo: ['treasurer', 'project-managers'],
    assignedToNames: ['Roberto Garcia', 'Project Managers'],
    rewards: ['Financial Excellence Award'],
    milestones: [
      { id: 'm10', title: '90% Efficiency', targetValue: 90, isCompleted: true, completedDate: '2024-06-01' },
      { id: 'm11', title: '95% Efficiency', targetValue: 95, isCompleted: false },
      { id: 'm12', title: '98% Target', targetValue: 98, isCompleted: false, reward: 'Excellence Bonus' },
    ],
    metrics: [
      { date: '2024-04-30', value: 88 },
      { date: '2024-05-31', value: 91 },
      { date: '2024-06-30', value: 94 },
    ],
    createdBy: 'Roberto Garcia',
    createdAt: '2024-04-01',
  },
  {
    id: '5',
    title: 'Personal Task Completion',
    description: 'Complete all assigned tasks within deadline consistently',
    type: 'PERSONAL',
    category: 'DELIVERY',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    targetValue: 100,
    currentValue: 100,
    unit: '%',
    startDate: '2024-01-01',
    targetDate: '2024-08-31',
    completedDate: '2024-08-25',
    assignedTo: ['miguel'],
    assignedToNames: ['Miguel Torres'],
    rewards: ['Performance Recognition'],
    milestones: [
      { id: 'm13', title: '80% On-time', targetValue: 80, isCompleted: true, completedDate: '2024-03-15' },
      { id: 'm14', title: '90% On-time', targetValue: 90, isCompleted: true, completedDate: '2024-05-20' },
      { id: 'm15', title: '100% Target', targetValue: 100, isCompleted: true, completedDate: '2024-08-25', reward: 'Employee of the Month' },
    ],
    metrics: [
      { date: '2024-02-28', value: 75 },
      { date: '2024-03-31', value: 82 },
      { date: '2024-04-30', value: 88 },
      { date: '2024-05-31', value: 92 },
      { date: '2024-06-30', value: 96 },
      { date: '2024-07-31', value: 98 },
      { date: '2024-08-31', value: 100 },
    ],
    createdBy: 'Miguel Torres',
    createdAt: '2024-01-01',
  },
];

const mockStats: ProductivityStats = {
  totalGoals: 12,
  activeGoals: 8,
  completedGoals: 4,
  completionRate: 85,
  averageProgress: 76,
  streak: 15,
  totalPoints: 2450,
  level: 7,
};

const goalTypeColors = {
  PERSONAL: 'bg-blue-900/20 text-blue-300 border-blue-700',
  TEAM: 'bg-green-900/20 text-green-300 border-green-700',
  PROJECT: 'bg-purple-900/20 text-purple-300 border-purple-700',
  BARANGAY: 'bg-orange-900/20 text-orange-300 border-orange-700',
};

const categoryColors = {
  EFFICIENCY: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  QUALITY: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  DELIVERY: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  COLLABORATION: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  INNOVATION: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

const priorityIcons = {
  LOW: Minus,
  MEDIUM: ArrowUp,
  HIGH: ArrowUp,
  URGENT: ArrowUp,
  CRITICAL: ArrowUp,
};

const priorityColors = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-orange-400',
  URGENT: 'text-yellow-400',
  CRITICAL: 'text-red-400',
};

export function ProductivityDashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch productivity data from database
  const fetchProductivityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [goalsResponse, statsResponse] = await Promise.all([
        fetch(`/api/goals?type=${filterType}&status=${filterStatus}`),
        fetch('/api/productivity/stats')
      ]);

      if (!goalsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch productivity data');
      }

      const goalsData = await goalsResponse.json();
      const statsData = await statsResponse.json();

      setGoals(goalsData.goals || []);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching productivity data:', err);
      setError('Failed to load productivity data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductivityData();
  }, [filterType, filterStatus]);

  const filteredGoals = goals;

  const getLevelProgress = (points: number) => {
    const pointsPerLevel = 500;
    const currentLevelPoints = points % pointsPerLevel;
    return (currentLevelPoints / pointsPerLevel) * 100;
  };

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const progress = (goal.currentValue / goal.targetValue) * 100;
    const PriorityIcon = priorityIcons[goal.priority];
    const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== 'COMPLETED';
    
    return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => setSelectedGoal(goal.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <PriorityIcon className={cn("w-4 h-4", priorityColors[goal.priority])} />
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              goalTypeColors[goal.type]
            )}>
              {goal.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {goal.status === 'COMPLETED' && <Trophy className="w-4 h-4 text-yellow-400" />}
            {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400" />}
            <button className="p-1 hover:bg-gray-700 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="font-semibold text-gray-100 mb-2">{goal.title}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{goal.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-100">
              {goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                progress >= 100 ? "bg-green-500" :
                progress >= 75 ? "bg-blue-500" :
                progress >= 50 ? "bg-yellow-500" : "bg-orange-500"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {Math.round(progress)}% complete
          </div>
        </div>

        {/* Category and Timeline */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            categoryColors[goal.category]
          )}>
            {goal.category}
          </span>
          <div className="text-xs text-gray-400">
            Due: {new Date(goal.targetDate).toLocaleDateString()}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <Flag className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Milestones</span>
          </div>
          <div className="flex gap-1">
            {goal.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={cn(
                  "w-3 h-3 rounded-full border-2",
                  milestone.isCompleted 
                    ? "bg-green-500 border-green-500" 
                    : "border-gray-600"
                )}
                title={milestone.title}
              />
            ))}
          </div>
        </div>

        {/* Assignees */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1">
            {goal.assignees.slice(0, 3).map((assignee, index) => (
              <div
                key={assignee.id}
                className="w-6 h-6 bg-green-600 border-2 border-gray-800 rounded-full flex items-center justify-center text-xs text-white font-medium"
                title={assignee.name}
              >
                {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            ))}
            {goal.assignees.length > 3 && (
              <div className="w-6 h-6 bg-gray-600 border-2 border-gray-800 rounded-full flex items-center justify-center text-xs text-white">
                +{goal.assignees.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {goal.rewards.length > 0 && (
              <Award className="w-4 h-4 text-yellow-400" title="Has rewards" />
            )}
            <Star className="w-4 h-4 text-gray-400" />
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
          <h1 className="text-2xl font-bold text-gray-100">Productivity Dashboard</h1>
          <p className="text-gray-400">Track goals, measure performance, and boost productivity</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Goal
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Failed to Load Goals</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchProductivityData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.activeGoals || 0}</p>
              )}
              <p className="text-sm text-gray-400">Active Goals</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.completionRate || 0}%</p>
              )}
              <p className="text-sm text-gray-400">Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.streak || 0}</p>
              )}
              <p className="text-sm text-gray-400">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">Level {stats?.level || 1}</p>
              )}
              <p className="text-sm text-gray-400">{stats?.totalPoints || 0} Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100">Your Level Progress</h2>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Level {stats?.level || 1}</span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{((stats?.totalPoints || 0) % 500)} / 500 points</span>
            <span>Next: Level {(stats?.level || 1) + 1}</span>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getLevelProgress(stats?.totalPoints || 0)}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Types</option>
            <option value="PERSONAL">Personal</option>
            <option value="TEAM">Team</option>
            <option value="PROJECT">Project</option>
            <option value="BARANGAY">Barangay</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <div className="flex items-center gap-1 bg-gray-700 border border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition-colors",
                viewMode === 'grid' ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-200"
              )}
            >
              Grid
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

          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Goals Grid */}
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
          {filteredGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {!loading && filteredGoals.length === 0 && !error && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No goals found</h3>
          <p className="text-gray-400 mb-4">
            {filterType !== 'ALL' || filterStatus !== 'ALL'
              ? 'Try adjusting your filters.'
              : 'Set your first productivity goal to get started.'
            }
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Goal
          </button>
        </div>
      )}
    </div>
  );
}
