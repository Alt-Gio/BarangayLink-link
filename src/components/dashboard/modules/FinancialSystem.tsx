"use client";

import { useState, useEffect } from 'react';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Users, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Target,
  PieChart,
  BarChart3,
  CreditCard,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FinancialSummary {
  totalProjectBudget: number;
  totalEventBudget: number;
  totalBudget: number;
  projectCount: number;
  eventCount: number;
  avgProjectBudget: number;
  avgEventBudget: number;
  budgetByCategory: BudgetByCategory[];
}

interface BudgetByCategory {
  category: string;
  projects: {
    count: number;
    totalBudget: number;
    avgBudget: number;
  };
  events: {
    count: number;
    totalBudget: number;
    avgBudget: number;
  };
  total: number;
}

interface ProjectBudgetItem {
  id: string;
  title: string;
  budget: number;
  category: string;
  status: string;
  progress: number;
  createdBy: {
    name: string;
  };
}

interface EventBudgetItem {
  id: string;
  title: string;
  budget: number;
  category: string;
  status: string;
  actualAttendees: number;
  maxAttendees: number | null;
  createdBy: {
    name: string;
  };
}



export function FinancialSystem() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budget' | 'reports'>('overview');
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [projects, setProjects] = useState<ProjectBudgetItem[]>([]);
  const [events, setEvents] = useState<EventBudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  const canViewBudget = hasPermission(MODULE_PERMISSIONS.FINANCIAL_SYSTEM.VIEW_BUDGET);
  const canApproveBudget = hasPermission(MODULE_PERMISSIONS.FINANCIAL_SYSTEM.APPROVE_BUDGET);
  const canManageExpenses = hasPermission(MODULE_PERMISSIONS.FINANCIAL_SYSTEM.MANAGE_EXPENSES);

  // Mock data for financial calculations
  const totalBudget = summary?.totalBudget || 0;
  const totalSpent = summary ? (summary.totalProjectBudget * 0.6 + summary.totalEventBudget * 0.4) : 0;
  const totalRemaining = totalBudget - totalSpent;

  // Mock transactions data
  const mockTransactions = [
    {
      id: '1',
      type: 'EXPENSE',
      description: 'Project Materials',
      category: 'Infrastructure',
      amount: 50000,
      date: new Date().toISOString()
    },
    {
      id: '2',
      type: 'INCOME',
      description: 'Government Grant',
      category: 'Funding',
      amount: 100000,
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      type: 'EXPENSE',
      description: 'Event Catering',
      category: 'Events',
      amount: 25000,
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const transactionTypeColors = {
    INCOME: 'text-green-400',
    EXPENSE: 'text-red-400',
    TRANSFER: 'text-blue-400'
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Mock budget categories
  const mockBudgetCategories = [
    {
      id: '1',
      name: 'Infrastructure',
      budget: 500000,
      spent: 300000,
      remaining: 200000,
      projects: 3,
      events: 1
    },
    {
      id: '2',
      name: 'Health & Education',
      budget: 300000,
      spent: 180000,
      remaining: 120000,
      projects: 2,
      events: 2
    },
    {
      id: '3',
      name: 'Community Events',
      budget: 200000,
      spent: 120000,
      remaining: 80000,
      projects: 1,
      events: 3
    }
  ];

  // Fetch financial data from database
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsResponse, eventsResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/events')
      ]);

      if (!projectsResponse.ok || !eventsResponse.ok) {
        throw new Error('Failed to fetch financial data');
      }

      const projectsData = await projectsResponse.json();
      const eventsData = await eventsResponse.json();

      // Handle potential API errors
      if (projectsData.error) {
        throw new Error(projectsData.error);
      }
      if (eventsData.error) {
        throw new Error(eventsData.error);
      }

      const projectItems = projectsData.projects || [];
      const eventItems = eventsData.events || [];

      setProjects(projectItems);
      setEvents(eventItems);

      // Calculate financial summary
      const totalProjectBudget = projectItems.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
      const totalEventBudget = eventItems.reduce((sum: number, e: any) => sum + (e.budget || 0), 0);
      const totalBudget = totalProjectBudget + totalEventBudget;

      // Group by category
      const projectsByCategory = projectItems.reduce((acc: any, project: any) => {
        const category = project.category || 'GENERAL';
        if (!acc[category]) {
          acc[category] = { count: 0, totalBudget: 0 };
        }
        acc[category].count++;
        acc[category].totalBudget += project.budget || 0;
        return acc;
      }, {});

      const eventsByCategory = eventItems.reduce((acc: any, event: any) => {
        const category = event.category || 'GENERAL';
        if (!acc[category]) {
          acc[category] = { count: 0, totalBudget: 0 };
        }
        acc[category].count++;
        acc[category].totalBudget += event.budget || 0;
        return acc;
      }, {});

      // Combine categories
      const allCategories = new Set([...Object.keys(projectsByCategory), ...Object.keys(eventsByCategory)]);
      const budgetByCategory = Array.from(allCategories).map(category => {
        const projects = projectsByCategory[category] || { count: 0, totalBudget: 0 };
        const events = eventsByCategory[category] || { count: 0, totalBudget: 0 };
        
        return {
          category,
          projects: {
            count: projects.count,
            totalBudget: projects.totalBudget,
            avgBudget: projects.count > 0 ? projects.totalBudget / projects.count : 0
          },
          events: {
            count: events.count,
            totalBudget: events.totalBudget,
            avgBudget: events.count > 0 ? events.totalBudget / events.count : 0
          },
          total: projects.totalBudget + events.totalBudget
        };
      });

      const financialSummary: FinancialSummary = {
        totalProjectBudget,
        totalEventBudget,
        totalBudget,
        projectCount: projectItems.length,
        eventCount: eventItems.length,
        avgProjectBudget: projectItems.length > 0 ? totalProjectBudget / projectItems.length : 0,
        avgEventBudget: eventItems.length > 0 ? totalEventBudget / eventItems.length : 0,
        budgetByCategory
      };

      setSummary(financialSummary);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to load financial data');
      
      // Set fallback data so the page can still render
      const fallbackSummary: FinancialSummary = {
        totalProjectBudget: 0,
        totalEventBudget: 0,
        totalBudget: 0,
        projectCount: 0,
        eventCount: 0,
        avgProjectBudget: 0,
        avgEventBudget: 0,
        budgetByCategory: []
      };
      setSummary(fallbackSummary);
      setProjects([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  if (!canViewBudget) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">Access Restricted</h3>
        <p className="text-gray-400">You don't have permission to view financial information.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">Loading Financial Data</h3>
        <p className="text-gray-400">Please wait while we fetch your financial information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">Error Loading Data</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchFinancialData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProjectCard = ({ project }: { project: ProjectBudgetItem }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{project.title}</h3>
            <p className="text-sm text-gray-400">{project.category}</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/20 text-blue-300">
          {project.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Budget</span>
          <span className="text-lg font-bold text-green-400">₱{project.budget.toLocaleString()}</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Progress:</span>
            <span>{project.progress}%</span>
          </div>
          <div className="flex justify-between">
            <span>Manager:</span>
            <span>{project.createdBy.name}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {project.category.replace('_', ' ')}
        </div>
        <div className="flex items-center gap-1">
          <Link 
            href={`/dashboard/projects/${project.id}`}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }: { event: EventBudgetItem }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{event.title}</h3>
            <p className="text-sm text-gray-400">{event.category}</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-900/20 text-purple-300">
          {event.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Budget</span>
          <span className="text-lg font-bold text-green-400">₱{event.budget.toLocaleString()}</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Attendees:</span>
            <span>{event.actualAttendees}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''}</span>
          </div>
          <div className="flex justify-between">
            <span>Organizer:</span>
            <span>{event.createdBy.name}</span>
          </div>
        </div>
      </div>

      {event.maxAttendees && (
        <div className="bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((event.actualAttendees / event.maxAttendees) * 100, 100)}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {event.category.replace('_', ' ')}
        </div>
        <div className="flex items-center gap-1">
          <Link 
            href={`/dashboard/events/${event.id}`}
            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }: { category: BudgetByCategory }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-100 mb-1">{category.category}</h3>
        <p className="text-lg font-bold text-green-400">₱{category.total.toLocaleString()}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Projects</span>
          <div className="text-right">
            <p className="text-blue-400 font-medium">{category.projects.count}</p>
            <p className="text-xs text-gray-500">₱{category.projects.totalBudget.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Events</span>
          <div className="text-right">
            <p className="text-purple-400 font-medium">{category.events.count}</p>
            <p className="text-xs text-gray-500">₱{category.events.totalBudget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Avg Project: ₱{Math.round(category.projects.avgBudget).toLocaleString()}
        </div>
        <div className="text-xs text-gray-400">
          Avg Event: ₱{Math.round(category.events.avgBudget).toLocaleString()}
        </div>
      </div>
    </div>
  );

  const TransactionCard = ({ transaction }: { transaction: any }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            transaction.type === 'INCOME' ? "bg-green-900/20" : "bg-red-900/20"
          )}>
            {transaction.type === 'INCOME' ? 
              <ArrowDownRight className="w-6 h-6 text-green-400" /> :
              <ArrowUpRight className="w-6 h-6 text-red-400" />
            }
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{transaction.description}</h3>
            <p className="text-sm text-gray-400">{transaction.category}</p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          transaction.type === 'INCOME' ? "bg-green-900/20 text-green-300" : "bg-red-900/20 text-red-300"
        )}>
          {transaction.type}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Amount</span>
          <span className={cn(
            "text-lg font-bold",
            transactionTypeColors[transaction.type as keyof typeof transactionTypeColors]
          )}>
            {transaction.type === 'INCOME' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
          </span>
        </div>
        
        <div className="text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {transaction.category}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const BudgetCategoryCard = ({ category }: { category: any }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-100 mb-1">{category.name}</h3>
        <p className="text-lg font-bold text-green-400">₱{category.budget.toLocaleString()}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Spent</span>
          <div className="text-right">
            <p className="text-red-400 font-medium">₱{category.spent.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{Math.round((category.spent / category.budget) * 100)}%</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Remaining</span>
          <div className="text-right">
            <p className="text-blue-400 font-medium">₱{category.remaining.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{Math.round((category.remaining / category.budget) * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Projects: {category.projects} | Events: {category.events}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Financial System</h1>
          <p className="text-gray-400">Manage budgets, expenses, and financial operations</p>
        </div>
        <div className="flex items-center gap-2">
          {canManageExpenses && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              New Transaction
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'budget', label: 'Budget Categories', icon: PieChart },
            { id: 'reports', label: 'Reports', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === tab.id
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">₱{totalBudget.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total Budget</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-900/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">₱{totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">₱{totalRemaining.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Remaining</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</p>
                  <p className="text-sm text-gray-400">Utilization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-100">Recent Transactions</h2>
              <Link href="#" className="text-green-400 hover:text-green-300 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {mockTransactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      transaction.type === 'INCOME' ? "bg-green-900/20" : "bg-red-900/20"
                    )}>
                      {transaction.type === 'INCOME' ? 
                        <ArrowDownRight className="w-4 h-4 text-green-400" /> :
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">{transaction.description}</p>
                      <p className="text-sm text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold",
                      transactionTypeColors[transaction.type]
                    )}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="TRANSFER">Transfer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
              </select>
            </div>
          </div>

          {/* Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockBudgetCategories.map(category => (
              <BudgetCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">Financial Reports</h3>
          <p className="text-gray-400">Detailed financial reports and analytics coming soon.</p>
        </div>
      )}
    </div>
  );
}