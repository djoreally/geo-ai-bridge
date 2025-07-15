
import { useAppContext } from '@/contexts/AppContext';
import { Van, Technician, Job, Client, Location, Vehicle } from '@/types';

export function useRelationalQueries() {
  const { state } = useAppContext();

  // Get van with assigned technicians and active jobs
  const getVanDetails = (vanId: string) => {
    const van = state.vans.find(v => v.id === vanId);
    if (!van) return null;

    const assignedTechnicians = state.technicians.filter(tech => 
      van.assignedTechnicians?.includes(tech.id) || false
    );
    const activeJobs = state.jobs.filter(job => 
      job.vanId === vanId && job.status === 'in_progress'
    );

    return {
      ...van,
      technicians: assignedTechnicians,
      activeJobs
    };
  };

  // Get technician with assigned van and schedule
  const getTechnicianDetails = (technicianId: string) => {
    const technician = state.technicians.find(t => t.id === technicianId);
    if (!technician) return null;

    const assignedVan = state.vans.find(van => 
      van.assignedTechnicians?.includes(technicianId)
    );
    const assignedJobs = state.jobs.filter(job => 
      job.technicianId === technicianId
    );

    return {
      ...technician,
      van: assignedVan,
      jobs: assignedJobs
    };
  };

  // Get job with all related entities
  const getJobDetails = (jobId: string) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return null;

    const technician = state.technicians.find(t => t.id === job.technicianId);
    const van = state.vans.find(v => v.id === job.vanId);
    const client = state.clients.find(c => c.id === job.clientId);
    const location = state.locations.find(l => l.id === job.locationId);
    const vehicle = state.vehicles.find(v => v.id === job.vehicleId);

    return {
      ...job,
      technician,
      van,
      client,
      location,
      vehicle
    };
  };

  // Get client with all locations and vehicles
  const getClientDetails = (clientId: string) => {
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return null;

    const locations = state.locations.filter(l => l.clientId === clientId);
    const vehicles = state.vehicles.filter(v => v.clientId === clientId);
    const jobs = state.jobs.filter(j => j.clientId === clientId);

    return {
      ...client,
      locations,
      vehicles,
      jobs
    };
  };

  // Simple getters for basic relations - these are what the components expect
  const getClientWithRelations = (clientId: string) => {
    return state.clients.find(c => c.id === clientId);
  };

  const getTechnicianWithRelations = (technicianId: string) => {
    return state.technicians.find(t => t.id === technicianId);
  };

  const getVanWithRelations = (vanId: string) => {
    return state.vans.find(v => v.id === vanId);
  };

  // Get available resources for dispatch
  const getAvailableResources = {
    availableVans: state.vans.filter(van => van.status === 'active'),
    availableTechnicians: state.technicians.filter(tech => tech.status === 'active'),
    unreadNotifications: state.notifications.filter(n => !n.read)
  };

  // Get dashboard metrics
  const getDashboardMetrics = () => {
    const today = new Date().toDateString();
    
    return {
      totalJobs: state.jobs.length,
      todaysJobs: state.jobs.filter(job => 
        new Date(job.scheduledStart).toDateString() === today
      ).length,
      activeVans: state.vans.filter(van => van.status === 'active').length,
      activeTechnicians: state.technicians.filter(tech => 
        tech.status === 'active'
      ).length,
      completedJobs: state.jobs.filter(job => job.status === 'completed').length,
      pendingJobs: state.jobs.filter(job => job.status === 'scheduled').length,
      scheduledJobs: state.jobs.filter(job => job.status === 'scheduled').length,
      openTickets: state.notifications.filter(n => !n.read).length,
      vehiclesServicedToday: state.jobs.filter(job => 
        job.status === 'completed' && 
        job.actualEnd && 
        new Date(job.actualEnd).toDateString() === today
      ).length,
      totalRevenue: state.jobs
        .filter(job => job.status === 'completed')
        .reduce((sum, job) => sum + job.costBreakdown.totalPrice, 0)
    };
  };

  // Get jobs by status
  const getJobsByStatus = (status: string) => {
    return state.jobs.filter(job => job.status === status);
  };

  // Get technician workload
  const getTechnicianWorkload = (technicianId: string) => {
    const jobs = state.jobs.filter(job => 
      job.technicianId === technicianId && 
      ['scheduled', 'in_progress'].includes(job.status)
    );
    
    return {
      totalJobs: jobs.length,
      scheduledJobs: jobs.filter(job => job.status === 'scheduled').length,
      inProgressJobs: jobs.filter(job => job.status === 'in_progress').length
    };
  };

  return {
    getVanDetails,
    getTechnicianDetails,
    getJobDetails,
    getClientDetails,
    getClientWithRelations,
    getTechnicianWithRelations,
    getVanWithRelations,
    getAvailableResources,
    getDashboardMetrics,
    getJobsByStatus,
    getTechnicianWorkload
  };
}
