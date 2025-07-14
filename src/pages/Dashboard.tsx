
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { useFleetStore } from '@/store/useFleetStore';
import { MockDataService } from '@/services/mockDataService';
import type { DashboardMetrics } from '@/types';

export default function Dashboard() {
  const { 
    vans, 
    activeJobs, 
    technicians, 
    setVans, 
    setJobs, 
    setTechnicians, 
    setClients 
  } = useFleetStore();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const [vansData, jobsData, techsData, clientsData] = await Promise.all([
        MockDataService.getVans(),
        MockDataService.getJobs(),
        MockDataService.getTechnicians(),
        MockDataService.getClients()
      ]);
      
      setVans(vansData);
      setJobs(jobsData);
      setTechnicians(techsData);
      setClients(clientsData);
    };

    loadData();
  }, [setVans, setJobs, setTechnicians, setClients]);

  const metrics: DashboardMetrics = {
    activeVans: vans.filter(v => v.status === 'active').length,
    scheduledJobs: activeJobs.filter(j => j.status === 'scheduled').length,
    openTickets: activeJobs.filter(j => j.status === 'in_progress').length,
    vehiclesServicedToday: activeJobs.filter(j => 
      j.status === 'completed' && 
      new Date(j.actualEnd!).toDateString() === new Date().toDateString()
    ).length,
    totalRevenue: activeJobs
      .filter(j => j.status === 'completed')
      .reduce((sum, job) => sum + job.costBreakdown.totalPrice, 0),
    avgServiceTime: 28 // Mock value
  };

  const activeTechnicians = technicians.filter(t => t.status === 'active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your fleet operations and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vans</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeVans}</div>
            <p className="text-xs text-muted-foreground">
              {vans.length} total vans in fleet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.scheduledJobs}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.openTickets} currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Serviced Today</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.vehiclesServicedToday}</div>
            <p className="text-xs text-muted-foreground">
              ${metrics.totalRevenue.toFixed(2)} total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTechnicians.length}</div>
            <p className="text-xs text-muted-foreground">
              {technicians.length} total technicians
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgServiceTime}m</div>
            <p className="text-xs text-muted-foreground">
              2m faster than last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technician Availability */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Technician Availability</CardTitle>
            <CardDescription>Current status of all technicians</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTechnicians.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tech.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        Van: {tech.assignedVan || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={tech.status === 'active' ? 'default' : 'secondary'}>
                    {tech.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest completed and scheduled jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.scheduledStart).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'in_progress' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
