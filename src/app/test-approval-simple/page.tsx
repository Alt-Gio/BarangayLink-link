'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function TestApprovalSimplePage() {
  const [activeTab, setActiveTab] = useState('projects');

  const testToast = () => {
    toast.success('Test toast notification working!');
  };

  const testErrorToast = () => {
    toast.error('Test error notification working!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approval System Test</h1>
        <p className="text-muted-foreground">
          Testing the UI components for the approval system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Toast Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testToast} className="w-full">
              Test Success Toast
            </Button>
            <Button onClick={testErrorToast} variant="destructive" className="w-full">
              Test Error Toast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Tabs Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Projects (0)
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Documents (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button asChild>
          <a href="/dashboard/projects/approval">
            Go to Full Approval Dashboard
          </a>
        </Button>
        <div className="text-sm text-muted-foreground">
          If all components above are working, the approval system should be functional!
        </div>
      </div>
    </div>
  );
}
