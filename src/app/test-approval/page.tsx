'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TestApprovalPage() {
  const [loading, setLoading] = useState(false);

  const testProjectApproval = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects/pending');
      if (response.ok) {
        const projects = await response.json();
        toast.success(`Found ${projects.length} pending projects`);
        console.log('Pending projects:', projects);
      } else {
        toast.error('Failed to fetch pending projects');
      }
    } catch (error) {
      toast.error('Error testing project approval');
    } finally {
      setLoading(false);
    }
  };

  const testDocumentApproval = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/documents/pending');
      if (response.ok) {
        const documents = await response.json();
        toast.success(`Found ${documents.length} pending documents`);
        console.log('Pending documents:', documents);
      } else {
        toast.error('Failed to fetch pending documents');
      }
    } catch (error) {
      toast.error('Error testing document approval');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approval System Test</h1>
        <p className="text-muted-foreground">
          Test the project and document approval system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Project Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testProjectApproval} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Project Approval API'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Document Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testDocumentApproval} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Document Approval API'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval System Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Project approval workflow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Document approval workflow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Activity logging for approvals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Document preview functionality</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Role-based access control</span>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button asChild>
          <a href="/dashboard/projects/approval">
            Go to Approval Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
}
