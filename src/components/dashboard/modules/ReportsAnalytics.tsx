"use client";

import { useState } from 'react';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Filter,
  RefreshCw,
  Share2,
  PieChart,
  Target,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings,
  Printer,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  description: string;
  period: string;
  category: 'financial' | 'projects' | 'events' | 'community' | 'performance';
}

interface Report {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'projects' | 'events' | 'community' | 'performance';
  type: 'summary' | 'detailed' | 'analytical' | 'comparative';
  generatedAt: string;
  generatedBy: string;
  period: string;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
  size?: number;
  format: 'pdf' | 'excel' | 'csv';
  isScheduled: boolean;
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated?: string;
  nextGeneration?: string;
}

const mockMetrics: ReportMetric[] = [
  {
    id: '1',
    title: 'Total Budget Utilization',
    value: 62.2,
    change: 8.5,
    changeType: 'increase',
    unit: '%',
    description: 'Percentage of annual budget utilized',
    period: 'Current Year',
    category: 'financial',
  },
  {
    id: '2',
    title: 'Active Projects',
    value: 12,
    change: 2,
    changeType: 'increase',
    description: 'Number of currently active projects',
    period: 'Current Month',
    category: 'projects',
  },
  {
    id: '3',
    title: 'Community Events',
    value: 18,
    change: -1,
    changeType: 'decrease',
    description: 'Events held this quarter',
    period: 'Q3 2024',
    category: 'events',
  },
  {
    id: '4',
    title: 'Event Attendance Rate',
    value: 78.4,
    change: 12.3,
    changeType: 'increase',
    unit: '%',
    description: 'Average event attendance rate',
    period: 'Last 3 Months',
    category: 'community',
  },
  {
    id: '5',
    title: 'Project Completion Rate',
    value: 89.2,
    change: 5.7,
    changeType: 'increase',
    unit: '%',
    description: 'Projects completed on time',
    period: 'Current Year',
    category: 'performance',
  },
  {
    id: '6',
    title: 'Budget Savings',
    value: '₱1.2M',
    change: 15.2,
    changeType: 'increase',
    description: 'Amount saved through efficient spending',
    period: 'Current Year',
    category: 'financial',
  },
  {
    id: '7',
    title: 'Community Engagement',
    value: 2456,
    change: 324,
    changeType: 'increase',
    description: 'Active community participants',
    period: 'Current Quarter',
    category: 'community',
  },
  {
    id: '8',
    title: 'Digital Service Usage',
    value: 1834,
    change: 456,
    changeType: 'increase',
    description: 'Digital service requests processed',
    period: 'Current Month',
    category: 'performance',
  },
];

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Quarterly Financial Summary',
    description: 'Comprehensive financial overview including budget utilization, expenses, and savings for Q3 2024',
    category: 'financial',
    type: 'summary',
    generatedAt: '2024-08-20T10:30:00',
    generatedBy: 'Barangay Treasurer',
    period: 'Q3 2024',
    status: 'completed',
    downloadUrl: '/reports/q3-2024-financial-summary.pdf',
    size: 2048576,
    format: 'pdf',
    isScheduled: true,
    scheduleFrequency: 'quarterly',
    lastGenerated: '2024-08-20',
    nextGeneration: '2024-11-20',
  },
  {
    id: '2',
    title: 'Project Performance Dashboard',
    description: 'Detailed analysis of all active and completed projects with timelines, budgets, and outcomes',
    category: 'projects',
    type: 'analytical',
    generatedAt: '2024-08-19T14:15:00',
    generatedBy: 'Project Manager',
    period: 'Current Year',
    status: 'completed',
    downloadUrl: '/reports/project-performance-2024.xlsx',
    size: 1536000,
    format: 'excel',
    isScheduled: true,
    scheduleFrequency: 'monthly',
    lastGenerated: '2024-08-19',
    nextGeneration: '2024-09-19',
  },
  {
    id: '3',
    title: 'Community Events Impact Report',
    description: 'Analysis of community event attendance, engagement, and feedback for continuous improvement',
    category: 'events',
    type: 'detailed',
    generatedAt: '2024-08-18T16:45:00',
    generatedBy: 'Community Coordinator',
    period: 'Last 6 Months',
    status: 'completed',
    downloadUrl: '/reports/events-impact-report.pdf',
    size: 3072000,
    format: 'pdf',
    isScheduled: false,
    lastGenerated: '2024-08-18',
  },
  {
    id: '4',
    title: 'Monthly Performance Metrics',
    description: 'Key performance indicators and metrics tracking for operational efficiency',
    category: 'performance',
    type: 'summary',
    generatedAt: '2024-08-21T09:00:00',
    generatedBy: 'System Administrator',
    period: 'August 2024',
    status: 'processing',
    format: 'pdf',
    isScheduled: true,
    scheduleFrequency: 'monthly',
    nextGeneration: '2024-09-01',
  },
  {
    id: '5',
    title: 'Citizen Satisfaction Survey Results',
    description: 'Comprehensive analysis of citizen satisfaction survey responses and recommendations',
    category: 'community',
    type: 'analytical',
    generatedAt: '2024-08-15T11:20:00',
    generatedBy: 'Public Relations Officer',
    period: 'Q2 2024',
    status: 'completed',
    downloadUrl: '/reports/citizen-satisfaction-q2-2024.pdf',
    size: 4096000,
    format: 'pdf',
    isScheduled: false,
    lastGenerated: '2024-08-15',
  },
];

const categoryColors = {
  financial: 'bg-green-100 text-green-800',
  projects: 'bg-blue-100 text-blue-800',
  events: 'bg-purple-100 text-purple-800',
  community: 'bg-orange-100 text-orange-800',
  performance: 'bg-red-100 text-red-800',
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function ReportsAnalytics() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'analytics' | 'scheduled'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const canViewDetailed = hasPermission(MODULE_PERMISSIONS.REPORTS_ANALYTICS.VIEW_DETAILED);
  const canCreateReports = hasPermission(MODULE_PERMISSIONS.REPORTS_ANALYTICS.CREATE_REPORTS);
  const hasSystemAnalytics = hasPermission(MODULE_PERMISSIONS.REPORTS_ANALYTICS.SYSTEM_ANALYTICS);

  const filteredMetrics = mockMetrics.filter(metric => 
    selectedCategory === 'ALL' || metric.category === selectedCategory
  );

  const MetricCard = ({ metric }: { metric: ReportMetric }) => {
    const ChangeIcon = metric.changeType === 'increase' ? ArrowUp : 
                      metric.changeType === 'decrease' ? ArrowDown : Minus;
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{metric.title}</h3>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            categoryColors[metric.category]
          )}>
            {metric.category}
          </span>
        </div>
        
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {metric.value}{metric.unit}
          </span>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-sm font-medium",
            metric.changeType === 'increase' ? "bg-green-100 text-green-800" :
            metric.changeType === 'decrease' ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          )}>
            <ChangeIcon className="w-3 h-3" />
            <span>{Math.abs(metric.change)}{metric.unit}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-1">{metric.description}</p>
        <p className="text-xs text-gray-500">{metric.period}</p>
      </div>
    );
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{report.description}</p>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              categoryColors[report.category]
            )}>
              {report.category}
            </span>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              statusColors[report.status]
            )}>
              {report.status}
            </span>
            {report.isScheduled && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Scheduled
              </span>
            )}
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Generated by:</span>
          <span className="font-medium">{report.generatedBy}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Period:</span>
          <span className="font-medium">{report.period}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Generated:</span>
          <span className="font-medium">
            {new Date(report.generatedAt).toLocaleDateString()}
          </span>
        </div>
        {report.size && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Size:</span>
            <span className="font-medium">{formatFileSize(report.size)}</span>
          </div>
        )}
        {report.nextGeneration && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Next Generation:</span>
            <span className="font-medium">
              {new Date(report.nextGeneration).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {report.status === 'completed' && report.downloadUrl && (
          <>
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
        {report.status === 'processing' && (
          <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        )}
        {report.status === 'failed' && (
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );

  if (!canViewDetailed) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">You don't have permission to view detailed reports and analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="current_month">Current Month</option>
            <option value="current_quarter">Current Quarter</option>
            <option value="current_year">Current Year</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
          </select>
          {canCreateReports && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp, requiresSystem: true },
            { id: 'scheduled', label: 'Scheduled Reports', icon: Clock },
          ].map((tab) => (
            (!tab.requiresSystem || hasSystemAnalytics) && (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Category Filter for Metrics */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="ALL">All Categories</option>
              <option value="financial">Financial</option>
              <option value="projects">Projects</option>
              <option value="events">Events</option>
              <option value="community">Community</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMetrics.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Generate Custom Report</h3>
                  <p className="text-sm text-gray-600">Create a tailored report</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                <Download className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Export Data</h3>
                  <p className="text-sm text-gray-600">Download data in various formats</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
                <Clock className="w-8 h-8 text-purple-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Schedule Report</h3>
                  <p className="text-sm text-gray-600">Set up automated reports</p>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all">
                <Mail className="w-8 h-8 text-orange-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Email Reports</h3>
                  <p className="text-sm text-gray-600">Send reports via email</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && hasSystemAnalytics && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
          <p className="text-gray-600">Interactive charts and detailed analytics dashboard coming soon.</p>
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockReports.filter(report => report.isScheduled).map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
          
          {mockReports.filter(report => report.isScheduled).length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
              <p className="text-gray-600">Set up automated report generation to get regular insights.</p>
              {canCreateReports && (
                <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Clock className="w-4 h-4" />
                  Schedule Report
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
