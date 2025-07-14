
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Van, Job, Technician, Client, Equipment, Notification } from '@/types';

interface FleetState {
  // Data
  vans: Van[];
  jobs: Job[];
  technicians: Technician[];
  clients: Client[];
  equipment: Equipment[];
  notifications: Notification[];
  
  // UI State
  sidebarCollapsed: boolean;
  activeFilters: Record<string, any>;
  
  // Actions
  setVans: (vans: Van[]) => void;
  setJobs: (jobs: Job[]) => void;
  setTechnicians: (technicians: Technician[]) => void;
  setClients: (clients: Client[]) => void;
  setEquipment: (equipment: Equipment[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  toggleSidebar: () => void;
  setFilters: (filters: Record<string, any>) => void;
  
  // Computed values
  getActiveVans: () => Van[];
  getScheduledJobs: () => Job[];
  getAvailableTechnicians: () => Technician[];
  getUnreadNotifications: () => Notification[];
  getDashboardMetrics: () => {
    activeVans: number;
    scheduledJobs: number;
    activeTechnicians: number;
    totalRevenue: number;
  };
}

export const useFleetStore = create<FleetState>()(
  devtools(
    (set, get) => ({
      // Initial state
      vans: [],
      jobs: [],
      technicians: [],
      clients: [],
      equipment: [],
      notifications: [],
      sidebarCollapsed: false,
      activeFilters: {},

      // Actions
      setVans: (vans) => set({ vans }),
      setJobs: (jobs) => set({ jobs }),
      setTechnicians: (technicians) => set({ technicians }),
      setClients: (clients) => set({ clients }),
      setEquipment: (equipment) => set({ equipment }),
      setNotifications: (notifications) => set({ notifications }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: `notification-${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      })),
      
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      })),
      
      setFilters: (filters) => set({ activeFilters: filters }),

      // Computed values
      getActiveVans: () => get().vans.filter((van) => van.status === 'on_job'),
      
      getScheduledJobs: () => get().jobs.filter((job) => 
        job.status === 'scheduled' || job.status === 'in_progress'
      ),
      
      getAvailableTechnicians: () => get().technicians.filter((tech) => 
        tech.status === 'available'
      ),
      
      getUnreadNotifications: () => get().notifications.filter((n) => !n.isRead),
      
      getDashboardMetrics: () => {
        const state = get();
        return {
          activeVans: state.vans.filter((v) => v.status === 'on_job').length,
          scheduledJobs: state.jobs.filter((j) => j.status === 'scheduled').length,
          activeTechnicians: state.technicians.filter((t) => t.status === 'on_job').length,
          totalRevenue: state.jobs.reduce((sum, job) => sum + job.revenue, 0),
        };
      },
    }),
    {
      name: 'fleet-store',
    }
  )
);
