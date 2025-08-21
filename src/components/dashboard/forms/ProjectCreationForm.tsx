"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle,
  Image,
  Upload,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedHours: number;
  startDate: string;
  endDate: string;
  dependencies: string[];
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  startDate: string;
  endDate: string;
  manager: string;
  team: string[];
  objectives: string[];
  deliverables: string[];
  methodology: string;
  expectedOutcome: string;
  tasks: ProjectTask[];
  isPublic: boolean;
  featuredOnLanding: boolean;
}

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  category: 'INFRASTRUCTURE',
  budget: 0,
  location: '',
  startDate: '',
  endDate: '',
  manager: '',
  team: [],
  objectives: [],
  deliverables: [],
  methodology: '',
  expectedOutcome: '',
  tasks: [],
  isPublic: true,
  featuredOnLanding: false,
};

const categories = [
  'INFRASTRUCTURE',
  'HEALTH',
  'EDUCATION',
  'ENVIRONMENT',
  'SOCIAL',
  'ECONOMIC',
  'GOVERNANCE',
  'EMERGENCY',
  'TECHNOLOGY',
  'CULTURAL'
];

const priorities = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
];

const teamMembers = [
  'Juan de la Cruz (Captain)',
  'Maria Santos (Secretary)',
  'Roberto Garcia (Treasurer)',
  'Ana Reyes (Councilor)',
  'Carlos Mendoza (Councilor)',
  'Lisa Fernandez (Staff)',
  'Miguel Torres (Staff)',
];

export function ProjectCreationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Team & Timeline', icon: Users },
    { id: 3, title: 'Tasks & Dependencies', icon: Target },
    { id: 4, title: 'Review & Submit', icon: CheckCircle },
  ];

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const updateDeliverable = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((del, i) => i === index ? value : del)
    }));
  };

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const addTask = () => {
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      assignedTo: '',
      priority: 'MEDIUM',
      estimatedHours: 8,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dependencies: [],
    };
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const updateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  const removeTask = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const addTeamMember = (member: string) => {
    if (!formData.team.includes(member)) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, member]
      }));
    }
  };

  const removeTeamMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m !== member)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Project title is required';
        if (!formData.description.trim()) newErrors.description = 'Project description is required';
        if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget amount is required';
        if (!formData.location.trim()) newErrors.location = 'Project location is required';
        break;
      case 2:
        if (!formData.manager) newErrors.manager = 'Project manager is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      case 3:
        if (formData.tasks.length === 0) newErrors.tasks = 'At least one task is required';
        formData.tasks.forEach((task, index) => {
          if (!task.title.trim()) newErrors[`task-${index}-title`] = 'Task title is required';
          if (!task.assignedTo) newErrors[`task-${index}-assignedTo`] = 'Task assignee is required';
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority || 'MEDIUM',
          budget: formData.budget,
          startDate: formData.startDate,
          endDate: formData.endDate,
          objectives: formData.objectives.join('\n'),
          beneficiaries: formData.beneficiaries.join('\n'),
          location: formData.location,
          methodology: formData.methodology,
          expectedOutcome: formData.expectedOutcome,
          isPublic: formData.isPublic
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create project');
      }

      const project = await response.json();
      
      // Create tasks for the project if any
      if (formData.tasks.length > 0) {
        for (const task of formData.tasks) {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: task.title,
              description: task.description,
              projectId: project.id,
              priority: task.priority || 'MEDIUM',
              dueDate: task.endDate,
              estimatedHours: task.estimatedHours
            })
          });
        }
      }
      
      router.push(`/dashboard/projects?created=true`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
            placeholder="Enter project title"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
            placeholder="Describe the project goals, scope, and expected outcomes"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Budget (₱) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              placeholder="0.00"
            />
          </div>
          {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
            placeholder="Project implementation location"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Objectives
          </label>
          <div className="space-y-2">
            {formData.objectives.map((obj, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                  placeholder={`Objective ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addObjective}
              className="flex items-center gap-2 px-4 py-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Objective
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Key Deliverables
          </label>
          <div className="space-y-2">
            {formData.deliverables.map((del, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={del}
                  onChange={(e) => updateDeliverable(index, e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                  placeholder={`Deliverable ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDeliverable}
              className="flex items-center gap-2 px-4 py-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Deliverable
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Manager *
          </label>
          <select
            value={formData.manager}
            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="">Select project manager</option>
            {teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          {errors.manager && <p className="text-red-400 text-sm mt-1">{errors.manager}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Team Members
          </label>
          <div className="space-y-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addTeamMember(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
            >
              <option value="">Add team member</option>
              {teamMembers.filter(member => !formData.team.includes(member)).map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {formData.team.map(member => (
                <span
                  key={member}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/20 text-green-300 rounded-full text-sm"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => removeTeamMember(member)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          />
          {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date *
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          />
          {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-600 text-green-600 focus:ring-green-500 bg-gray-800"
              />
              <span className="text-sm text-gray-300">Make project public</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featuredOnLanding}
                onChange={(e) => setFormData(prev => ({ ...prev, featuredOnLanding: e.target.checked }))}
                className="rounded border-gray-600 text-green-600 focus:ring-green-500 bg-gray-800"
              />
              <span className="text-sm text-gray-300">Feature on landing page</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Project Tasks</h3>
        <button
          type="button"
          onClick={addTask}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {errors.tasks && <p className="text-red-400 text-sm">{errors.tasks}</p>}

      <div className="space-y-4">
        {formData.tasks.map((task, taskIndex) => (
          <div key={task.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-100">Task {taskIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeTask(task.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, { title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                  placeholder="Enter task title"
                />
                {errors[`task-${taskIndex}-title`] && (
                  <p className="text-red-400 text-sm mt-1">{errors[`task-${taskIndex}-title`]}</p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={task.description}
                  onChange={(e) => updateTask(task.id, { description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                  placeholder="Task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assigned To *
                </label>
                <select
                  value={task.assignedTo}
                  onChange={(e) => updateTask(task.id, { assignedTo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                >
                  <option value="">Select assignee</option>
                  {[formData.manager, ...formData.team].filter(Boolean).map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
                {errors[`task-${taskIndex}-assignedTo`] && (
                  <p className="text-red-400 text-sm mt-1">{errors[`task-${taskIndex}-assignedTo`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) => updateTask(task.id, { priority: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={task.estimatedHours}
                  onChange={(e) => updateTask(task.id, { estimatedHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={task.startDate}
                  onChange={(e) => updateTask(task.id, { startDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={task.endDate}
                  onChange={(e) => updateTask(task.id, { endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Project Summary</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-200 mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Title:</span> <span className="text-gray-100">{formData.title}</span></div>
              <div><span className="text-gray-400">Category:</span> <span className="text-gray-100">{formData.category}</span></div>
              <div><span className="text-gray-400">Budget:</span> <span className="text-gray-100">₱{formData.budget.toLocaleString()}</span></div>
              <div><span className="text-gray-400">Location:</span> <span className="text-gray-100">{formData.location}</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-200 mb-2">Timeline & Team</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Manager:</span> <span className="text-gray-100">{formData.manager}</span></div>
              <div><span className="text-gray-400">Start Date:</span> <span className="text-gray-100">{formData.startDate}</span></div>
              <div><span className="text-gray-400">End Date:</span> <span className="text-gray-100">{formData.endDate}</span></div>
              <div><span className="text-gray-400">Team Size:</span> <span className="text-gray-100">{formData.team.length} members</span></div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-medium text-gray-200 mb-2">Tasks ({formData.tasks.length})</h4>
            <div className="space-y-1">
              {formData.tasks.map((task, index) => (
                <div key={task.id} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">{index + 1}.</span>
                  <span className="text-gray-100">{task.title}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-300">{task.assignedTo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-400" />
          <span className="text-blue-200 font-medium">Ready to Create Project</span>
        </div>
        <p className="text-blue-300 text-sm mt-1">
          All required information has been provided. Click "Create Project" to proceed.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Create New Project</h1>
          <p className="text-gray-400">Set up a new project with tasks and team assignments</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                  isActive ? "bg-green-600 text-white" :
                  isCompleted ? "bg-green-900/20 text-green-300" : "bg-gray-800 text-gray-400"
                )}>
                  <StepIcon className="w-5 h-5" />
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-px w-12 mx-2",
                    isCompleted ? "bg-green-600" : "bg-gray-700"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
