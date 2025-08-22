"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  CheckSquare, 
  Save, 
  X, 
  Plus, 
  Calendar,
  Clock,
  Users,
  Target,
  Flag,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export function CreateTaskForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'TODO' as const,
    priority: 'MEDIUM' as const,
    dueDate: '',
    startDate: '',
    estimatedHours: '',
    assignees: [] as string[],
    checklists: [] as ChecklistItem[],
  });

  // Fetch projects and users for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsResponse = await fetch('/api/projects');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
        }

        // Fetch users
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.users || []);
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: `temp-${Date.now()}`,
      text: '',
      completed: false,
      order: formData.checklists.length
    };
    setFormData(prev => ({
      ...prev,
      checklists: [...prev.checklists, newItem]
    }));
  };

  const updateChecklistItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      checklists: prev.checklists.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklists: prev.checklists.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!formData.projectId) {
      setError('Please select a project');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
          checklists: formData.checklists.filter(item => item.text.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create task');
      }

      const createdTask = await response.json();
      toast.success('Task created successfully!');
      router.push('/dashboard/tasks');
    } catch (err) {
      console.error('Error creating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Create New Task</h1>
          <p className="text-gray-400">Add a new task to your project management system</p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Task Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                placeholder="Describe the task in detail..."
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Assignees */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Assignees</h2>
          
          <div className="space-y-3">
            {users.map(user => (
              <label key={user.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.assignees.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('assignees', [...formData.assignees, user.id]);
                    } else {
                      handleInputChange('assignees', formData.assignees.filter(id => id !== user.id));
                    }
                  }}
                  className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <div>
                  <span className="text-gray-100">{user.name}</span>
                  <span className="text-gray-400 text-sm ml-2">({user.role})</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100">Checklist</h2>
            <button
              type="button"
              onClick={addChecklistItem}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.checklists.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateChecklistItem(index, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                  placeholder="Enter checklist item..."
                />
                <button
                  type="button"
                  onClick={() => removeChecklistItem(index)}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {formData.checklists.length === 0 && (
              <p className="text-gray-400 text-sm">No checklist items added yet.</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
