import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { 
  Client, 
  Location, 
  Vehicle, 
  Van, 
  Technician, 
  Job, 
  Notification, 
  Equipment, 
  User,
  InventoryItem,
  Service
} from '@/types';

// State interface
interface AppState {
  user: User | null;
  clients: Client[];
  locations: Location[];
  vehicles: Vehicle[];
  vans: Van[];
  technicians: Technician[];
  jobs: Job[];
  notifications: Notification[];
  equipment: Equipment[];
  inventory: InventoryItem[];
  services: Service[];
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; updates: Partial<Client> } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_VANS'; payload: Van[] }
  | { type: 'ADD_VAN'; payload: Van }
  | { type: 'UPDATE_VAN'; payload: { id: string; updates: Partial<Van> } }
  | { type: 'DELETE_VAN'; payload: string }
  | { type: 'SET_TECHNICIANS'; payload: Technician[] }
  | { type: 'ADD_TECHNICIAN'; payload: Technician }
  | { type: 'UPDATE_TECHNICIAN'; payload: { id: string; updates: Partial<Technician> } }
  | { type: 'DELETE_TECHNICIAN'; payload: string }
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<Job> } }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_EQUIPMENT'; payload: Equipment[] }
  | { type: 'ADD_EQUIPMENT'; payload: Equipment }
  | { type: 'UPDATE_EQUIPMENT'; payload: { id: string; updates: Partial<Equipment> } }
  | { type: 'DELETE_EQUIPMENT'; payload: string };

// Initial state
const initialState: AppState = {
  user: null,
  clients: [],
  locations: [],
  vehicles: [],
  vans: [],
  technicians: [],
  jobs: [],
  notifications: [],
  equipment: [],
  inventory: [],
  services: [],
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id
            ? { ...client, ...action.payload.updates }
            : client
        ),
      };
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
      };
    
    case 'SET_VANS':
      return { ...state, vans: action.payload };
    
    case 'ADD_VAN':
      return { ...state, vans: [...state.vans, action.payload] };
    
    case 'UPDATE_VAN':
      return {
        ...state,
        vans: state.vans.map(van =>
          van.id === action.payload.id
            ? { ...van, ...action.payload.updates }
            : van
        ),
      };
    
    case 'DELETE_VAN':
      return {
        ...state,
        vans: state.vans.filter(van => van.id !== action.payload),
      };
    
    case 'SET_TECHNICIANS':
      return { ...state, technicians: action.payload };
    
    case 'ADD_TECHNICIAN':
      return { ...state, technicians: [...state.technicians, action.payload] };
    
    case 'UPDATE_TECHNICIAN':
      return {
        ...state,
        technicians: state.technicians.map(tech =>
          tech.id === action.payload.id
            ? { ...tech, ...action.payload.updates }
            : tech
        ),
      };
    
    case 'DELETE_TECHNICIAN':
      return {
        ...state,
        technicians: state.technicians.filter(tech => tech.id !== action.payload),
      };
    
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id
            ? { ...job, ...action.payload.updates }
            : job
        ),
      };
    
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
    
    case 'SET_EQUIPMENT':
      return { ...state, equipment: action.payload };
    
    case 'ADD_EQUIPMENT':
      return { ...state, equipment: [...state.equipment, action.payload] };
    
    case 'UPDATE_EQUIPMENT':
      return {
        ...state,
        equipment: state.equipment.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };
    
    case 'DELETE_EQUIPMENT':
      return {
        ...state,
        equipment: state.equipment.filter(item => item.id !== action.payload),
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
