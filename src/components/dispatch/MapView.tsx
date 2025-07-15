
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, User, Clock } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useRelationalQueries } from '@/hooks/useRelationalQueries';
import type { Job } from '@/types';

interface MapViewProps {
  onEditJob: (jobId: string) => void;
}

export function MapView({ onEditJob }: MapViewProps) {
  const { state } = useAppContext();
  const { getClientWithRelations, getTechnicianWithRelations, getVanWithRelations } = useRelationalQueries();

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: Job['status']) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'in_progress': return 'destructive';
      case 'completed': return 'default';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const todaysJobs = state.jobs.filter(job => 
    job.status === 'scheduled' || job.status === 'in_progress'
  );

  const activeVans = state.vans.filter(van => van.status === 'active');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Placeholder */}
      <div className="lg:col-span-2">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Fleet Map View
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm">Van locations and job pins will appear here</p>
                <p className="text-xs mt-2">Integration with mapping service needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar with Jobs and Vans */}
      <div className="space-y-4">
        {/* Active Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysJobs.slice(0, 5).map((job) => {
              const client = getClientWithRelations(job.clientId);
              const technician = getTechnicianWithRelations(job.technicianId);
              const van = getVanWithRelations(job.vanId);
              
              return (
                <div
                  key={job.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onEditJob(job.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
                    <span className="font-medium text-sm">{job.title}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(job.scheduledStart).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    
                    {client && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{client.businessName}</span>
                      </div>
                    )}
                    
                    {technician && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{technician.fullName}</span>
                      </div>
                    )}
                    
                    {van && (
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        <span className="truncate">{van.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <Badge variant={getStatusVariant(job.status)} className="text-xs">
                      {job.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Active Vans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Vans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeVans.map((van) => (
              <div key={van.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{van.name}</span>
                  <Badge variant="default" className="text-xs">
                    {van.status}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>{van.licensePlate}</div>
                  <div>Capacity: {van.capacity.oil}gal oil, {van.capacity.filters} filters</div>
                  {van.assignedTechnicians.length > 0 && (
                    <div>Technicians: {van.assignedTechnicians.length}</div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
