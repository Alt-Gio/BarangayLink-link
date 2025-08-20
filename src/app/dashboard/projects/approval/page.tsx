'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Users, 
  Calendar,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  budget?: number;
  startDate?: string;
  dueDate?: string;
  createdBy: {
    name: string;
    email: string;
  };
  manager: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  filename: string;
  originalName: string;
  type: string;
  size: number;
  description?: string;
  uploadedBy: {
    name: string;
  };
  createdAt: string;
  project?: {
    name: string;
  };
}

export default function ProjectApprovalPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const [projectsRes, documentsRes] = await Promise.all([
        fetch('/api/projects/pending'),
        fetch('/api/documents/pending')
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (documentsRes.ok) {
        const documentsData = await documentsRes.json();
        setDocuments(documentsData);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast.error('Failed to load pending items');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectApproval = async (projectId: string, approved: boolean) => {
    try {
      setProcessing(projectId);
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        toast.success(`Project ${approved ? 'approved' : 'rejected'} successfully`);
        fetchPendingItems(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project status');
    } finally {
      setProcessing(null);
    }
  };

  const handleDocumentApproval = async (documentId: string, approved: boolean) => {
    try {
      setProcessing(documentId);
      const response = await fetch(`/api/documents/${documentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        toast.success(`Document ${approved ? 'approved' : 'rejected'} successfully`);
        fetchPendingItems(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update document status');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document status');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PLANNING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PENDING_APPROVAL: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_APPROVAL;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800',
      CRITICAL: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM}>
        {priority}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Approval</h1>
          <p className="text-muted-foreground">
            Review and approve pending projects and documents
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            {projects.length} Projects Pending
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {documents.length} Documents Pending
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Pending Projects</h3>
                  <p className="text-muted-foreground">
                    All projects have been reviewed and processed.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(project.status)}
                          {getPriorityBadge(project.priority)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Created by: {project.createdBy.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                      {project.budget && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Budget: ₱{project.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleProjectApproval(project.id, true)}
                        disabled={processing === project.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {processing === project.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleProjectApproval(project.id, false)}
                        disabled={processing === project.id}
                        variant="destructive"
                        className="flex-1"
                      >
                        {processing === project.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Pending Documents</h3>
                  <p className="text-muted-foreground">
                    All documents have been reviewed and processed.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{document.originalName}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{document.type}</Badge>
                          <Badge variant="secondary">{formatFileSize(document.size)}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {document.description && (
                      <p className="text-sm text-muted-foreground">
                        {document.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Uploaded by: {document.uploadedBy.name}</span>
                      </div>
                      {document.project && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span>Project: {document.project.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          Uploaded: {new Date(document.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(`/api/documents/${document.id}/download`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={() => handleDocumentApproval(document.id, true)}
                        disabled={processing === document.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {processing === document.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDocumentApproval(document.id, false)}
                        disabled={processing === document.id}
                        variant="destructive"
                        className="flex-1"
                      >
                        {processing === document.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
