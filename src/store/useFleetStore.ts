
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, Van, Job, Technician, Client, Notification, Equipment } from '../types';

interface FleetState extends AppState {
  equipment: Equipment[];
}

interface FleetStore extends FleetState {
  // Actions
  setVans: (vans: Van[]) => void;
  addVan: (van: Van) => void;
  updateVan: (id: string, updates: Partial<Van>) => void;
  removeVan: (id: string) => void;
  
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  
  setTechnicians: (technicians: Technician[]) => void;
  addTechnician: (technician: Technician) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  removeTechnician: (id: string) => void;
  
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
  
  setEquipment: (equipment: Equipment[]) => void;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  
  // Computed values
  getVanById: (id: string) => Van | undefined;
  getJobById: (id: string) => Job | undefined;
  getTechnicianById: (id: string) => Technician | undefined;
  getClientById: (id: string) => Client | undefined;
  getUnreadNotifications: () => Notification[];
  getActiveVans: () => Van[];
  getAvailableTechnicians: () => Technician[];
  getTotalRevenue: () => number;
  getVansOnJob: () => Van[];
  getTechniciansOnJob: () => Technician[];
}

export const useFleetStore = create<FleetStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      notifications: [],
      activeJobs: [],
      vans: [],
      technicians: [],
      clients: [],
      equipment: [],
      
      // Van actions
      setVans: (vans) => set({ vans }),
      addVan: (van) => set((state) => ({ vans: [...state.vans, van] })),
      updateVan: (id, updates) =>
        set((state) => ({
          vans: state.vans.map((van) => (van.id === id ? { ...van, ...updates } : van)),
        })),
      removeVan: (id) =>
        set((state) => ({ vans: state.vans.filter((van) => van.id !== id) })),
      
      // Job actions
      setJobs: (jobs) => set({ activeJobs: jobs }),
      addJob: (job) => set((state) => ({ activeJobs: [...state.activeJobs, job] })),
      updateJob: (id, updates) =>
        set((state) => ({
          activeJobs: state.activeJobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
        })),
      removeJob: (id) =>
        set((state) => ({ activeJobs: state.activeJobs.filter((job) => job.id !== id) })),
      
      // Technician actions
      setTechnicians: (technicians) => set({ technicians }),
      addTechnician: (technician) =>
        set((state) => ({ technicians: [...state.technicians, technician] })),
      updateTechnician: (id, updates) =>
        set((state) => ({
          technicians: state.technicians.map((tech) =>
            tech.id === id ? { ...tech, ...updates } : tech
          ),
        })),
      removeTechnician: (id) =>
        set((state) => ({ technicians: state.technicians.filter((tech) => tech.id !== id) })),
      
      // Client actions
      setClients: (clients) => set({ clients }),
      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        })),
      removeClient: (id) =>
        set((state) => ({ clients: state.clients.filter((client) => client.id !== id) })),
      
      // Equipment actions
      setEquipment: (equipment) => set({ equipment }),
      addEquipment: (equipment) => set((state) => ({ equipment: [...state.equipment, equipment] })),
      updateEquipment: (id, updates) =>
        set((state) => ({
          equipment: state.equipment.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      removeEquipment: (id) =>
        set((state) => ({ equipment: state.equipment.filter((item) => item.id !== id) })),
      
      // Notification actions
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({ 
          notifications: [...state.notifications, notification] 
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),
      removeNotification: (id) =>
        set((state) => ({ notifications: state.notifications.filter((notif) => notif.id !== id) })),
      
      // Computed values
      getVanById: (id) => get().vans.find((van) => van.id === id),
      getJobById: (id) => get().activeJobs.find((job) => job.id === id),
      getTechnicianById: (id) => get().technicians.find((tech) => tech.id === id),
      getClientById: (id) => get().clients.find((client) => client.id === id),
      getUnreadNotifications: () => get().notifications.filter((notif) => !notif.read),
      getActiveVans: () => get().vans.filter((van) => van.status === 'active'),
      getAvailableTechnicians: () => get().technicians.filter((tech) => tech.status === 'active'),
      getTotalRevenue: () => get().activeJobs
        .filter((job) => job.status === 'completed')
        .reduce((sum, job) => sum + job.costBreakdown.totalPrice, 0),
      getVansOnJob: () => {
        const activeJobVanIds = get().activeJobs
          .filter((job) => job.status === 'in_progress')
          .map((job) => job.vanId);
        return get().vans.filter((van) => activeJobVanIds.includes(van.id));
      },
      getTechniciansOnJob: () => {
        const activeJobTechIds = get().activeJobs
          .filter((job) => job.status === 'in_progress')
          .map((job) => job.technicianId);
        return get().technicians.filter((tech) => activeJobTechIds.includes(tech.id));
      },
    }),
    { name: 'fleet-store' }
  )
);
