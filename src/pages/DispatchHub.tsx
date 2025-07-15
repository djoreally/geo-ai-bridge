
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { CalendarView } from '@/components/dispatch/CalendarView';
import { MapView } from '@/components/dispatch/MapView';
import { JobDialog } from '@/components/dispatch/JobDialog';
import { useAppContext } from '@/contexts/AppContext';

export default function DispatchHub() {
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const { state } = useAppContext();

  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsJobDialogOpen(true);
  };

  const handleEditJob = (jobId: string) => {
    setSelectedJob(jobId);
    setIsJobDialogOpen(true);
  };

  const scheduledJobs = state.jobs.filter(j => j.status === 'scheduled').length;
  const inProgressJobs = state.jobs.filter(j => j.status === 'in_progress').length;
  const completedToday = state.jobs.filter(j => 
    j.status === 'completed' && 
    j.actualEnd && 
    new Date(j.actualEnd).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch Hub</h1>
          <p className="text-muted-foreground">
            Assign vans and technicians to jobs based on location, availability, and capacity
          </p>
        </div>
        <Button onClick={handleCreateJob} className="gap-2">
          <Plus className="h-4 w-4" />
          New Job
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledJobs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressJobs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <MapPin className="h-4 w-4" />
            Map View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarView onEditJob={handleEditJob} />
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4">
          <MapView onEditJob={handleEditJob} />
        </TabsContent>
      </Tabs>

      <JobDialog
        open={isJobDialogOpen}
        onOpenChange={setIsJobDialogOpen}
        jobId={selectedJob}
      />
    </div>
  );
}
