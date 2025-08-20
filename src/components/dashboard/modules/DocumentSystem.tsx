"use client";

import { useState } from 'react';
import { useAuth, MODULE_PERMISSIONS } from '@/context/AuthContext';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  Lock, 
  Globe, 
  Archive, 
  File, 
  Image, 
  Video, 
  Music, 
  FileSpreadsheet, 
  Presentation, 
  FolderOpen,
  Star,
  Clock,
  User,
  Tag,
  Shield,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Plus,
  FolderPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  filepath: string;
  url?: string;
  mimetype: string;
  size: number;
  type: 'FILE' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'SPREADSHEET' | 'PRESENTATION' | 'ARCHIVE' | 'REPORT' | 'FORM' | 'CERTIFICATE' | 'PHOTO';
  category?: string;
  description?: string;
  isPublic: boolean;
  accessLevel: 'PUBLIC' | 'OFFICIALS' | 'MANAGEMENT' | 'ADMIN_ONLY' | 'INTERNAL';
  uploadedBy: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  eventId?: string;
  eventName?: string;
  announcementId?: string;
  announcementTitle?: string;
  metadata?: any;
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  downloadCount: number;
  lastAccessed?: string;
  isStarred: boolean;
  isArchived: boolean;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    filename: 'barangay-ordinance-2024-01.pdf',
    originalName: 'Barangay Ordinance No. 2024-01 - Waste Management.pdf',
    filepath: '/documents/ordinances/barangay-ordinance-2024-01.pdf',
    url: '/documents/ordinances/barangay-ordinance-2024-01.pdf',
    mimetype: 'application/pdf',
    size: 2048576, // 2MB
    type: 'DOCUMENT',
    category: 'Legal Documents',
    description: 'Comprehensive waste management ordinance establishing guidelines for proper waste segregation and disposal in the barangay.',
    isPublic: true,
    accessLevel: 'PUBLIC',
    uploadedBy: 'Barangay Secretary',
    metadata: {
      ordinanceNumber: '2024-01',
      dateEnacted: '2024-08-15',
      effectiveDate: '2024-09-01'
    },
    tags: ['ordinance', 'waste-management', 'environment', 'legal'],
    version: 1,
    createdAt: '2024-08-15',
    updatedAt: '2024-08-15',
    downloadCount: 234,
    lastAccessed: '2024-08-20',
    isStarred: true,
    isArchived: false,
  },
  {
    id: '2',
    filename: 'health-center-construction-plans.dwg',
    originalName: 'Health Center Construction Architectural Plans.dwg',
    filepath: '/documents/projects/health-center/construction-plans.dwg',
    mimetype: 'application/autocad',
    size: 15728640, // 15MB
    type: 'FILE',
    category: 'Project Documents',
    description: 'Detailed architectural plans for the new health center construction project.',
    isPublic: false,
    accessLevel: 'OFFICIALS',
    uploadedBy: 'Project Engineer',
    projectId: '1',
    projectName: 'New Health Center Construction',
    metadata: {
      architect: 'ABC Architectural Firm',
      scale: '1:100',
      revisionNumber: 3
    },
    tags: ['construction', 'health-center', 'architectural', 'plans'],
    version: 3,
    createdAt: '2024-06-10',
    updatedAt: '2024-07-15',
    downloadCount: 45,
    lastAccessed: '2024-08-18',
    isStarred: false,
    isArchived: false,
  },
  {
    id: '3',
    filename: 'budget-report-q2-2024.xlsx',
    originalName: 'Quarterly Budget Report Q2 2024.xlsx',
    filepath: '/documents/financial/budget-report-q2-2024.xlsx',
    mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 512000, // 512KB
    type: 'SPREADSHEET',
    category: 'Financial Reports',
    description: 'Comprehensive budget utilization report for the second quarter of 2024.',
    isPublic: false,
    accessLevel: 'MANAGEMENT',
    uploadedBy: 'Barangay Treasurer',
    metadata: {
      reportPeriod: 'Q2 2024',
      totalBudget: 8200000,
      totalExpenses: 3100000
    },
    tags: ['budget', 'financial', 'quarterly', 'report'],
    version: 1,
    createdAt: '2024-07-01',
    updatedAt: '2024-07-01',
    downloadCount: 28,
    lastAccessed: '2024-08-19',
    isStarred: true,
    isArchived: false,
  },
  {
    id: '4',
    filename: 'community-cleanup-photos.zip',
    originalName: 'Community Cleanup Drive August 2024 Photos.zip',
    filepath: '/documents/events/cleanup-photos.zip',
    mimetype: 'application/zip',
    size: 45678901, // 45MB
    type: 'ARCHIVE',
    category: 'Event Documentation',
    description: 'Photo documentation from the community cleanup drive held on August 20, 2024.',
    isPublic: true,
    accessLevel: 'PUBLIC',
    uploadedBy: 'Environmental Officer',
    eventId: '1',
    eventName: 'Community Clean-Up Drive',
    metadata: {
      photoCount: 127,
      photographer: 'Barangay Staff',
      eventDate: '2024-08-20'
    },
    tags: ['photos', 'cleanup', 'community', 'environment'],
    version: 1,
    createdAt: '2024-08-21',
    updatedAt: '2024-08-21',
    downloadCount: 89,
    isStarred: false,
    isArchived: false,
  },
  {
    id: '5',
    filename: 'digital-literacy-curriculum.pdf',
    originalName: 'Digital Literacy Program Curriculum Guide.pdf',
    filepath: '/documents/education/digital-literacy-curriculum.pdf',
    mimetype: 'application/pdf',
    size: 1536000, // 1.5MB
    type: 'DOCUMENT',
    category: 'Educational Materials',
    description: 'Comprehensive curriculum guide for the senior citizens digital literacy training program.',
    isPublic: false,
    accessLevel: 'OFFICIALS',
    uploadedBy: 'Education Coordinator',
    projectId: '3',
    projectName: 'Digital Literacy Program',
    metadata: {
      modules: 8,
      duration: '16 weeks',
      targetGroup: 'Senior Citizens'
    },
    tags: ['education', 'digital-literacy', 'curriculum', 'seniors'],
    version: 2,
    createdAt: '2024-07-20',
    updatedAt: '2024-08-05',
    downloadCount: 12,
    isStarred: false,
    isArchived: false,
  },
  {
    id: '6',
    filename: 'barangay-certificate-template.docx',
    originalName: 'Barangay Certificate Template.docx',
    filepath: '/documents/templates/certificate-template.docx',
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 256000, // 256KB
    type: 'FORM',
    category: 'Templates',
    description: 'Official template for barangay certificates and clearances.',
    isPublic: false,
    accessLevel: 'OFFICIALS',
    uploadedBy: 'Barangay Secretary',
    metadata: {
      templateType: 'Certificate',
      officialSeal: true,
      lastRevision: '2024-08-01'
    },
    tags: ['template', 'certificate', 'official', 'clearance'],
    version: 4,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-01',
    downloadCount: 156,
    isStarred: true,
    isArchived: false,
  },
];

const typeIcons = {
  FILE: File,
  IMAGE: Image,
  VIDEO: Video,
  AUDIO: Music,
  DOCUMENT: FileText,
  SPREADSHEET: FileSpreadsheet,
  PRESENTATION: Presentation,
  ARCHIVE: Archive,
  REPORT: FileText,
  FORM: FileText,
  CERTIFICATE: FileText,
  PHOTO: Image,
};

const accessLevelColors = {
  PUBLIC: 'bg-green-900/20 text-green-300 border-green-700',
  OFFICIALS: 'bg-blue-900/20 text-blue-300 border-blue-700',
  MANAGEMENT: 'bg-purple-900/20 text-purple-300 border-purple-700',
  ADMIN_ONLY: 'bg-red-900/20 text-red-300 border-red-700',
  INTERNAL: 'bg-gray-700 text-gray-300 border-gray-600',
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DocumentSystem() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [accessFilter, setAccessFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showArchived, setShowArchived] = useState(false);

  const canUpload = hasPermission(MODULE_PERMISSIONS.DOCUMENT_SYSTEM.CREATE);
  const canEdit = hasPermission(MODULE_PERMISSIONS.DOCUMENT_SYSTEM.EDIT);
  const canDelete = hasPermission(MODULE_PERMISSIONS.DOCUMENT_SYSTEM.DELETE);
  const canAccessOfficial = hasPermission(MODULE_PERMISSIONS.DOCUMENT_SYSTEM.OFFICIAL_DOCUMENTS);

  const filteredDocuments = mockDocuments.filter(doc => {
    // Access level filtering
    if (doc.accessLevel === 'ADMIN_ONLY' && !hasPermission(6)) return false;
    if (doc.accessLevel === 'MANAGEMENT' && !hasPermission(4)) return false;
    if (doc.accessLevel === 'OFFICIALS' && !hasPermission(3)) return false;
    
    // Archive filtering
    if (doc.isArchived && !showArchived) return false;
    
    // Search filtering
    const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filtering
    const matchesType = typeFilter === 'ALL' || doc.type === typeFilter;
    
    // Access level filtering
    const matchesAccess = accessFilter === 'ALL' || doc.accessLevel === accessFilter;
    
    // Category filtering
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesAccess && matchesCategory;
  });

  const categories = Array.from(new Set(mockDocuments.map(doc => doc.category).filter(Boolean)));

  const DocumentCard = ({ document }: { document: Document }) => {
    const TypeIcon = typeIcons[document.type] || File;
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <TypeIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-100 text-sm leading-tight truncate">
                {document.originalName}
              </h3>
              <p className="text-xs text-gray-400">{document.uploadedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {document.isStarred && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
            {document.isPublic ? (
              <Globe className="w-4 h-4 text-green-400" title="Public" />
            ) : (
              <Lock className="w-4 h-4 text-gray-400" title="Private" />
            )}
            <button className="p-1 hover:bg-gray-700 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Access Level and Type */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border",
            accessLevelColors[document.accessLevel]
          )}>
            {document.accessLevel.replace('_', ' ')}
          </span>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
            {document.type}
          </span>
        </div>

        {/* Description */}
        {document.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{document.description}</p>
        )}

        {/* Category and Project */}
        {document.category && (
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">{document.category}</span>
          </div>
        )}
        
        {document.projectName && (
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Project: {document.projectName}</span>
          </div>
        )}

        {/* File Info */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Size: {formatFileSize(document.size)}</span>
            <span>v{document.version}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{new Date(document.createdAt).toLocaleDateString()}</span>
            <span>{document.downloadCount} downloads</span>
          </div>
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {document.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                #{tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <button 
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
              title="View Document"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            {canEdit && (
              <button 
                className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button 
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
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
          <h1 className="text-2xl font-bold text-gray-100">Document System</h1>
          <p className="text-gray-400">Manage and organize all barangay documents</p>
        </div>
        <div className="flex items-center gap-2">
          {canUpload && (
            <>
              <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">
                <FolderPlus className="w-4 h-4" />
                New Folder
              </button>
              <Link 
                href="/dashboard/documents/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{mockDocuments.length}</p>
              <p className="text-sm text-gray-400">Total Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {mockDocuments.filter(d => d.isPublic).length}
              </p>
              <p className="text-sm text-gray-400">Public</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {mockDocuments.reduce((sum, d) => sum + d.downloadCount, 0)}
              </p>
              <p className="text-sm text-gray-400">Total Downloads</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {formatFileSize(mockDocuments.reduce((sum, d) => sum + d.size, 0))}
              </p>
              <p className="text-sm text-gray-400">Total Storage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
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
            <option value="DOCUMENT">Documents</option>
            <option value="IMAGE">Images</option>
            <option value="SPREADSHEET">Spreadsheets</option>
            <option value="PRESENTATION">Presentations</option>
            <option value="ARCHIVE">Archives</option>
          </select>

          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Access Levels</option>
            <option value="PUBLIC">Public</option>
            <option value="OFFICIALS">Officials</option>
            <option value="MANAGEMENT">Management</option>
            <option value="ADMIN_ONLY">Admin Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
          >
            <option value="ALL">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 px-3 py-2">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded border-gray-600 text-green-600 focus:ring-green-500 bg-gray-700"
            />
            <span className="text-sm text-gray-300">Show Archived</span>
          </label>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map(document => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-100 mb-2">No documents found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || typeFilter !== 'ALL' || accessFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Get started by uploading your first document.'
            }
          </p>
          {canUpload && (
            <Link 
              href="/dashboard/documents/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </Link>
          )}
        </div>
      )}
    </div>
  );
}