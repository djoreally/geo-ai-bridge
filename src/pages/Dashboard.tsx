
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Calendar, Users, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { useVans, useJobs, useTechnicians } from '@/hooks/useConvex';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Dashboard() {
  const { vans, isLoading: vansLoading } = useVans();
  const { jobs, isLoading: jobsLoading } = useJobs();
  const { technicians, isLoading: techsLoading } = useTechnicians();

  const isLoading = vansLoading || jobsLoading || techsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate metrics from real data
  const activeVans = vans.filter(van => van.status === 'on_job').length;
  const availableVans = vans.filter(van => van.status === 'available').length;
  const scheduledJobs = jobs.filter(job => job.status === 'scheduled').length;
  const inProgressJobs = jobs.filter(job => job.status === 'in_progress').length;
  const activeTechnicians = technicians.filter(tech => tech.status === 'on_job').length;
  const totalRevenue = jobs.reduce((sum, job) => sum + job.revenue, 0);

  const kpiCards = [
    {
      title: 'Active Vans',
      value: activeVans,
      description: `${availableVans} available`,
      icon: Truck,
      trend: '+2 from yesterday',
      color: 'text-blue-600'
    },
    {
      title: 'Scheduled Jobs',
      value: scheduledJobs,
      description: `${inProgressJobs} in progress`,
      icon: Calendar,
      trend: '+5 this week',
      color: 'text-green-600'
    },
    {
      title: 'Active Technicians',
      value: activeTechnicians,
      description: `${technicians.length} total staff`,
      icon: Users,
      trend: '100% utilization',
      color: 'text-purple-600'
    },
    {
      title: 'Daily Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'Target: $15,000',
      icon: DollarSign,
      trend: '+12% vs target',
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Operations Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of your mobile oil service operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Jobs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest service appointments and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      job.status === 'completed' ? 'bg-green-500' :
                      job.status === 'in_progress' ? 'bg-blue-500' :
                      job.status === 'scheduled' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{job.jobNumber}</p>
                      <p className="text-sm text-muted-foreground">{job.location.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'in_progress' ? 'secondary' :
                      'outline'
                    }>
                      {job.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      ${job.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Current van availability and location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vans.slice(0, 4).map((van) => (
                <div key={van._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{van.plateNumber}</span>
                  </div>
                  <Badge variant={
                    van.status === 'available' ? 'default' :
                    van.status === 'on_job' ? 'secondary' :
                    van.status === 'maintenance' ? 'destructive' :
                    'outline'
                  }>
                    {van.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and maintenance reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Van FL-001 Service Due</p>
                  <p className="text-sm text-muted-foreground">Scheduled for tomorrow</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">All Technicians Certified</p>
                  <p className="text-sm text-muted-foreground">Safety compliance ✓</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Low Oil Inventory</p>
                  <p className="text-sm text-muted-foreground">Reorder needed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
