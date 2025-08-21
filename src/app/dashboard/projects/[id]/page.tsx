"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Settings,
  Plus,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  name: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  budget: number;
  expenditure: number;
  progressPercentage: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  location: string;
  objectives: string;
  beneficiaries: string;
  methodology: string;
  expectedOutcome: string;
  isPublic: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  manager: {
    id: string;
    name: string;
    role: string;
  };
  team: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  _count: {
    tasks: number;
    team: number;
  };
}

const statusColors = {
  PLANNING: 'bg-blue-900/20 text-blue-300 border-blue-700',
  APPROVED: 'bg-green-900/20 text-green-300 border-green-700',
  IN_PROGRESS: 'bg-yellow-900/20 text-yellow-300 border-yellow-700',
  REVIEW: 'bg-purple-900/20 text-purple-300 border-purple-700',
  COMPLETED: 'bg-emerald-900/20 text-emerald-300 border-emerald-700',
  ON_HOLD: 'bg-orange-900/20 text-orange-300 border-orange-700',
  CANCELLED: 'bg-red-900/20 text-red-300 border-red-700',
};

const priorityColors = {
  LOW: 'bg-gray-900/20 text-gray-300',
  MEDIUM: 'bg-blue-900/20 text-blue-300',
  HIGH: 'bg-orange-900/20 text-orange-300',
  URGENT: 'bg-yellow-900/20 text-yellow-300',
  CRITICAL: 'bg-red-900/20 text-red-300',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canEdit = hasPermission(MODULE_PERMISSIONS.PROJECT_MANAGEMENT.EDIT);
  const canDelete = hasPermission(MODULE_PERMISSIONS.PROJECT_MANAGEMENT.DELETE);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${params.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch project');
      }

      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to delete project');
      }

      router.push('/dashboard/projects?deleted=true');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert(`Failed to delete project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-400">Loading project...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Project Not Found</h1>
            <p className="text-gray-400">The project you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
        
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error || 'Project not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (project.status) {
      case 'COMPLETED': return CheckCircle;
      case 'IN_PROGRESS': return Clock;
      case 'ON_HOLD': case 'CANCELLED': return AlertTriangle;
      default: return FileText;
    }
  };

  const StatusIcon = getStatusIcon();
  const isOverdue = new Date(project.endDate || project.dueDate) < new Date() && project.status !== 'COMPLETED';

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{project.title || project.name}</h1>
            <p className="text-gray-400">Project Details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canEdit && (
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Project
            </Link>
          )}
          {canDelete && (
            <button
              onClick={handleDeleteProject}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Progress */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
                  <StatusIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-100">Project Status</h2>
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                    statusColors[project.status as keyof typeof statusColors] || statusColors.PLANNING
                  )}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {isOverdue && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Overdue</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{project.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100">{project._count?.tasks || 0}</div>
                <div className="text-sm text-gray-400">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100">{project._count?.team || 0}</div>
                <div className="text-sm text-gray-400">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100">₱{project.budget?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-400">Budget</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Project Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Category</div>
                  <div className="text-gray-100">{project.category}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Priority</div>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                    priorityColors[project.priority as keyof typeof priorityColors] || priorityColors.MEDIUM
                  )}>
                    {project.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Timeline</div>
                  <div className="text-gray-100">
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate || project.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Location</div>
                  <div className="text-gray-100">{project.location || 'Not specified'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Budget</div>
                  <div className="text-gray-100">₱{project.budget?.toLocaleString() || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Team</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {project.team && project.team.length > 0 ? (
                project.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-gray-100 text-sm">{member.name}</div>
                      <div className="text-gray-400 text-xs">{member.role}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No team members assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        {project.objectives && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Objectives</h3>
            <div className="text-gray-300 whitespace-pre-line">
              {project.objectives}
            </div>
          </div>
        )}

        {/* Beneficiaries */}
        {project.beneficiaries && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Beneficiaries</h3>
            <div className="text-gray-300 whitespace-pre-line">
              {project.beneficiaries}
            </div>
          </div>
        )}

        {/* Methodology */}
        {project.methodology && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Methodology</h3>
            <div className="text-gray-300 whitespace-pre-line">
              {project.methodology}
            </div>
          </div>
        )}

        {/* Expected Outcome */}
        {project.expectedOutcome && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Expected Outcome</h3>
            <div className="text-gray-300 whitespace-pre-line">
              {project.expectedOutcome}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4">
        <Link
          href={`/dashboard/projects/${project.id}/tasks`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Target className="w-4 h-4" />
          View Tasks
        </Link>
        
        <Link
          href={`/dashboard/projects/${project.id}/events`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          View Events
        </Link>
      </div>
    </div>
  );
}
