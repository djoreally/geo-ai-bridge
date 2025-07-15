
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  DollarSign, 
  Users, 
  Truck, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useRelationalQueries } from '@/hooks/useRelationalQueries';

export default function Dashboard() {
  const { state } = useAppContext();
  const { getDashboardMetrics } = useRelationalQueries();
  
  const metrics = getDashboardMetrics();

  const recentJobs = state.jobs
    .filter(job => job.status === 'in_progress' || job.status === 'scheduled')
    .slice(0, 5);

  const upcomingJobs = state.jobs
    .filter(job => {
      const jobDate = new Date(job.scheduledStart);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return jobDate.toDateString() === tomorrow.toDateString();
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your fleet operations and key metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vans</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeVans}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeVans > 0 ? 'Operational' : 'No active vans'}
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
              {metrics.openTickets} open tickets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Serviced</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.vehiclesServicedToday}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Upcoming Jobs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent jobs</p>
              ) : (
                recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {job.status === 'in_progress' ? (
                        <Clock className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.scheduledStart).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={job.status === 'in_progress' ? 'destructive' : 'default'}
                    >
                      {job.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tomorrow's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingJobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No jobs scheduled</p>
              ) : (
                upcomingJobs.map((job) => (
                  <div key={job.id} className="flex items-center space-x-4">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.scheduledStart).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Active Vans</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.activeVans}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">Active Technicians</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.activeTechnicians}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm">Completed Jobs</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.technicians.filter(tech => tech.status === 'active').slice(0, 5).map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tech.fullName}</p>
                      <p className="text-sm text-muted-foreground">{tech.role}</p>
                    </div>
                    <Badge variant="default">{tech.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                ))}
                {state.notifications.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No notifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
