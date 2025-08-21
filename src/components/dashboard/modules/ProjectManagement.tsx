"use client";

import { useState, useEffect } from 'react';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  CheckCircle, 
  CheckSquare,
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Calendar,
  TrendingUp,
  FileText,
  Settings,
  Target,
  Download,
  RefreshCw,
  Loader2,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  category: 'INFRASTRUCTURE' | 'HEALTH' | 'EDUCATION' | 'ENVIRONMENT' | 'SOCIAL' | 'TECHNOLOGY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  budget: number;
  progress: number;
  progressPercentage?: number;
  startDate: string;
  endDate: string;
  location: string;
  isPublic: boolean;
  createdBy: {
    name: string;
  };
  _count?: {
    tasks: number;
    assignees: number;
  };
}

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  averageProgress: number;
  totalBudget: number;
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

const categoryColors = {
  INFRASTRUCTURE: 'bg-gray-900/20 text-gray-300',
  HEALTH: 'bg-red-900/20 text-red-300',
  EDUCATION: 'bg-blue-900/20 text-blue-300',
  ENVIRONMENT: 'bg-green-900/20 text-green-300',
  SOCIAL: 'bg-purple-900/20 text-purple-300',
  TECHNOLOGY: 'bg-cyan-900/20 text-cyan-300',
};

const priorityColors = {
  LOW: 'bg-gray-900/20 text-gray-300',
  MEDIUM: 'bg-blue-900/20 text-blue-300',
  HIGH: 'bg-orange-900/20 text-orange-300',
  URGENT: 'bg-yellow-900/20 text-yellow-300',
  CRITICAL: 'bg-red-900/20 text-red-300',
};

export function ProjectManagement() {
  const { hasPermission } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  // Add state for user access info
  const [userAccess, setUserAccess] = useState<{
    role: string;
    accessLevel: string;
  } | null>(null);

  const canCreate = hasPermission(MODULE_PERMISSIONS.PROJECT_MANAGEMENT.CREATE);
  const canEdit = hasPermission(MODULE_PERMISSIONS.PROJECT_MANAGEMENT.EDIT);
  const canDelete = hasPermission(MODULE_PERMISSIONS.PROJECT_MANAGEMENT.DELETE);

  // Fetch projects from database
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch projects');
      }

      const data = await response.json();
      
      const projectsArray = data.projects || [];
      setProjects(projectsArray);
      
      // Set user access info
      setUserAccess({
        role: data.userRole || 'PUBLIC',
        accessLevel: data.accessLevel || 'public'
      });
      
      // Calculate stats
      const projectStats: ProjectStats = {
        total: projectsArray.length,
        active: projectsArray.filter((p: any) => p.status === 'IN_PROGRESS').length,
        completed: projectsArray.filter((p: any) => p.status === 'COMPLETED').length,
        averageProgress: projectsArray.length > 0 
          ? Math.round(projectsArray.reduce((sum: number, p: any) => sum + (p.progressPercentage || p.progress || 0), 0) / projectsArray.length)
          : 0,
        totalBudget: projectsArray.reduce((sum: number, p: any) => sum + (p.budget || 0), 0)
      };
      
      setStats(projectStats);
      
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]);
      setStats({ total: 0, active: 0, completed: 0, averageProgress: 0, totalBudget: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to delete project');
      }

      // Refresh projects list
      fetchProjects();
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error('Error deleting project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      toast.error(errorMessage);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const ProjectCard = ({ project }: { project: Project }) => {
    const getStatusIcon = () => {
      switch (project.status) {
        case 'COMPLETED': return CheckCircle;
        case 'IN_PROGRESS': return Clock;
        case 'ON_HOLD': case 'CANCELLED': return AlertTriangle;
        default: return FolderOpen;
      }
    };

    const StatusIcon = getStatusIcon();
    const isOverdue = new Date(project.endDate) < new Date() && project.status !== 'COMPLETED';

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center">
              <StatusIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 text-lg leading-tight">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.createdBy.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {project.isPublic && (
              <div className="w-2 h-2 bg-green-400 rounded-full" title="Public Project" />
            )}
            <button className="p-1 hover:bg-gray-700 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            statusColors[project.status]
          )}>
            {project.status.replace('_', ' ')}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            priorityColors[project.priority]
          )}>
            {project.priority}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            categoryColors[project.category]
          )}>
            {project.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-100">{project.progressPercentage || project.progress}%</span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progressPercentage || project.progress}%` }}
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span>₱{(project.budget / 1000000).toFixed(1)}M budget</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
            {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{project._count?.assignees || 0} team members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>{project._count?.tasks || 0} tasks</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <Link 
              href={`/dashboard/projects/${project.id}`}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link 
              href={`/dashboard/projects/${project.id}/timeline`}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded"
              title="View Timeline"
            >
              <Calendar className="w-4 h-4" />
            </Link>
            <Link 
              href={`/dashboard/projects/${project.id}/kanban`}
              className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded"
              title="Kanban Board"
            >
              <CheckSquare className="w-4 h-4" />
            </Link>
            {canEdit && (
              <Link 
                href={`/dashboard/projects/${project.id}/edit`}
                className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-1">
            {canDelete && (
              <button 
                onClick={() => handleDeleteProject(project.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getAccessDescription = (level: string): string => {
    switch (level) {
      case 'full': return 'Full system access - can view and manage all projects';
      case 'executive': return 'Executive access - can view all projects and approve/reject';
      case 'departmental': return 'Department access - can view assigned and public projects';
      case 'committee': return 'Committee access - can view committee and assigned projects';
      case 'assigned': return 'Limited access - can view assigned tasks and public projects';
      case 'public': return 'Public access - can view public projects only';
      default: return 'Basic access level';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Project Management</h1>
          <p className="text-gray-400">Manage and track all barangay projects</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Link 
              href="/dashboard/projects/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          )}
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Role-Based Access Indicator */}
      {userAccess && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-medium text-blue-300">
                Access Level: {userAccess.role.replace('_', ' ')}
              </h3>
              <p className="text-sm text-blue-200">
                {getAccessDescription(userAccess.accessLevel)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Failed to Load Projects</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
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
              <FolderOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.total || 0}</p>
              )}
              <p className="text-sm text-gray-400">Total Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.active || 0}</p>
              )}
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">{stats?.averageProgress || 0}%</p>
              )}
              <p className="text-sm text-gray-400">Avg Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              {loading ? (
                <div className="h-8 bg-gray-700 rounded animate-pulse mb-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-100">
                  ₱{((stats?.totalBudget || 0) / 1000000).toFixed(1)}M
                </p>
              )}
              <p className="text-sm text-gray-400">Total Budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
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
            <option value="PLANNING">Planning</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Categories</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="HEALTH">Health</option>
            <option value="EDUCATION">Education</option>
            <option value="ENVIRONMENT">Environment</option>
            <option value="SOCIAL">Social</option>
            <option value="TECHNOLOGY">Technology</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
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
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {!loading && filteredProjects.length === 0 && !error && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No projects found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first project.'
            }
          </p>
          {canCreate && (
            <Link 
              href="/dashboard/projects/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}