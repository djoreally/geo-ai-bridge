
import { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import type { Client, Vehicle, Location, Job, Van, Technician } from '@/types';

export function useRelationalQueries() {
  const { state } = useAppContext();

  // Client relationships
  const getClientWithRelations = useMemo(() => 
    (clientId: string): Client & { 
      locations: Location[], 
      vehicles: Vehicle[], 
      activeJobs: Job[] 
    } | null => {
      const client = state.clients.find(c => c.id === clientId);
      if (!client) return null;

      const locations = client.locations || [];
      const vehicles = client.vehicles || [];
      const activeJobs = state.jobs.filter(job => job.clientId === clientId);

      return {
        ...client,
        locations,
        vehicles,
        activeJobs,
      };
    }, [state.clients, state.jobs]
  );

  // Van relationships
  const getVanWithRelations = useMemo(() =>
    (vanId: string): Van & {
      assignedTechnicians: Technician[],
      activeJobs: Job[],
      completedJobsToday: Job[]
    } | null => {
      const van = state.vans.find(v => v.id === vanId);
      if (!van) return null;

      const assignedTechnicians = state.technicians.filter(tech => 
        van.assignedTechnicians.includes(tech.id)
      );
      const activeJobs = state.jobs.filter(job => 
        job.vanId === vanId && job.status === 'in_progress'
      );
      const today = new Date().toDateString();
      const completedJobsToday = state.jobs.filter(job =>
        job.vanId === vanId && 
        job.status === 'completed' &&
        job.actualEnd &&
        new Date(job.actualEnd).toDateString() === today
      );

      return {
        ...van,
        assignedTechnicians,
        activeJobs,
        completedJobsToday,
      };
    }, [state.vans, state.technicians, state.jobs]
  );

  // Technician relationships
  const getTechnicianWithRelations = useMemo(() =>
    (techId: string): Technician & {
      assignedVan: Van | null,
      activeJobs: Job[],
      completedJobsToday: Job[]
    } | null => {
      const technician = state.technicians.find(t => t.id === techId);
      if (!technician) return null;

      const assignedVan = technician.assignedVan 
        ? state.vans.find(v => v.id === technician.assignedVan) || null
        : null;
      const activeJobs = state.jobs.filter(job => 
        job.technicianId === techId && job.status === 'in_progress'
      );
      const today = new Date().toDateString();
      const completedJobsToday = state.jobs.filter(job =>
        job.technicianId === techId && 
        job.status === 'completed' &&
        job.actualEnd &&
        new Date(job.actualEnd).toDateString() === today
      );

      return {
        ...technician,
        assignedVan,
        activeJobs,
        completedJobsToday,
      };
    }, [state.technicians, state.vans, state.jobs]
  );

  // Job relationships
  const getJobWithRelations = useMemo(() =>
    (jobId: string): Job & {
      client: Client | null,
      vehicle: Vehicle | null,
      location: Location | null,
      technician: Technician | null,
      van: Van | null
    } | null => {
      const job = state.jobs.find(j => j.id === jobId);
      if (!job) return null;

      const client = state.clients.find(c => c.id === job.clientId) || null;
      const vehicle = client?.vehicles.find(v => v.id === job.vehicleId) || null;
      const location = client?.locations.find(l => l.id === job.locationId) || null;
      const technician = state.technicians.find(t => t.id === job.technicianId) || null;
      const van = state.vans.find(v => v.id === job.vanId) || null;

      return {
        ...job,
        client,
        vehicle,
        location,
        technician,
        van,
      };
    }, [state.jobs, state.clients, state.technicians, state.vans]
  );

  // Dashboard metrics
  const getDashboardMetrics = useMemo(() => {
    const activeVans = state.vans.filter(v => v.status === 'active').length;
    const scheduledJobs = state.jobs.filter(j => j.status === 'scheduled').length;
    const inProgressJobs = state.jobs.filter(j => j.status === 'in_progress').length;
    
    const today = new Date().toDateString();
    const vehiclesServicedToday = new Set(
      state.jobs
        .filter(j => j.status === 'completed' && j.actualEnd && 
          new Date(j.actualEnd).toDateString() === today)
        .map(j => j.vehicleId)
    ).size;

    const totalRevenue = state.jobs
      .filter(j => j.status === 'completed')
      .reduce((sum, job) => sum + job.costBreakdown.totalPrice, 0);

    const completedJobs = state.jobs.filter(j => j.status === 'completed');
    const avgServiceTime = completedJobs.length > 0
      ? completedJobs.reduce((sum, job) => {
          if (job.actualStart && job.actualEnd) {
            return sum + (new Date(job.actualEnd).getTime() - new Date(job.actualStart).getTime());
          }
          return sum;
        }, 0) / (completedJobs.length * 1000 * 60) // Convert to minutes
      : 0;

    return {
      activeVans,
      scheduledJobs,
      openTickets: inProgressJobs,
      vehiclesServicedToday,
      totalRevenue,
      avgServiceTime: Math.round(avgServiceTime),
    };
  }, [state.vans, state.jobs]);

  // Available resources
  const getAvailableResources = useMemo(() => {
    const availableVans = state.vans.filter(v => v.status === 'active');
    const availableTechnicians = state.technicians.filter(t => t.status === 'active');
    const unreadNotifications = state.notifications.filter(n => !n.read);

    return {
      availableVans,
      availableTechnicians,
      unreadNotifications,
    };
  }, [state.vans, state.technicians, state.notifications]);

  return {
    getClientWithRelations,
    getVanWithRelations,
    getTechnicianWithRelations,
    getJobWithRelations,
    getDashboardMetrics,
    getAvailableResources,
  };
}
