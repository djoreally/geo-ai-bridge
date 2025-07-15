
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Truck, Users, MapPin, Calendar, TrendingUp, Clock } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRelationalQueries } from "@/hooks/useRelationalQueries";

export default function Dashboard() {
  const { state } = useAppContext();
  const { getDashboardMetrics } = useRelationalQueries();
  
  const metrics = getDashboardMetrics;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to FleetCommand - Your mobile fleet management hub
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
              {state.vans.length - metrics.activeVans} in maintenance
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
              {metrics.openTickets} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Services</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.vehiclesServicedToday}</div>
            <p className="text-xs text-muted-foreground">
              Vehicles serviced today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total completed jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Current status of all vans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.vans.slice(0, 5).map((van) => (
              <div key={van.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{van.name}</p>
                  <p className="text-sm text-muted-foreground">{van.licensePlate}</p>
                </div>
                <Badge variant={van.status === 'active' ? 'default' : 'secondary'}>
                  {van.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technician Activity</CardTitle>
            <CardDescription>Current technician assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.technicians.filter(t => t.status === 'active').slice(0, 5).map((tech) => (
              <div key={tech.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tech.fullName}</p>
                  <p className="text-sm text-muted-foreground">{tech.role}</p>
                </div>
                <Badge variant="default">
                  {tech.assignedVan ? 'Assigned' : 'Available'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Activity</CardTitle>
          <CardDescription>Latest job updates and completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.jobs
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((job) => {
                const client = state.clients.find(c => c.id === job.clientId);
                const technician = state.technicians.find(t => t.id === job.technicianId);
                
                return (
                  <div key={job.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {client?.businessName} • {technician?.fullName}
                      </p>
                    </div>
                    <Badge variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'in_progress' ? 'destructive' :
                      'secondary'
                    }>
                      {job.status}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
