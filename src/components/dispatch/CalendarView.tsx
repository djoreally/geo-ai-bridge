
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Truck } from 'lucide-react';
import { useFleetStore } from '@/store/useFleetStore';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import type { Job } from '@/types';

interface CalendarViewProps {
  onEditJob: (jobId: string) => void;
}

export function CalendarView({ onEditJob }: CalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { activeJobs, getClientById, getTechnicianById, getVanById } = useFleetStore();

  const weekStart = startOfWeek(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getJobsForDay = (date: Date) => {
    return activeJobs.filter(job => 
      isSameDay(new Date(job.scheduledStart), date)
    );
  };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            Week of {format(weekStart, 'MMM d, yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayJobs = getJobsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card key={index} className={isToday ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {format(day, 'EEE')}
                  <span className="block text-lg font-bold">
                    {format(day, 'd')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayJobs.map((job) => {
                  const client = getClientById(job.clientId);
                  const technician = getTechnicianById(job.technicianId);
                  const van = getVanById(job.vanId);
                  
                  return (
                    <div
                      key={job.id}
                      className="p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onEditJob(job.id)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`} />
                        <span className="text-xs font-medium truncate">
                          {job.title}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(job.scheduledStart), 'HH:mm')}
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
                      
                      <div className="mt-1">
                        <Badge variant={getStatusVariant(job.status)} className="text-xs">
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {dayJobs.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No jobs scheduled
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
