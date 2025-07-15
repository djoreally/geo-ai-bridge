
// Core entity interfaces for FleetCommand System

export interface Client {
  id: string;
  businessName: string;
  primaryContact: {
    name: string;
    phone: string;
    email: string;
  };
  billingInfo: {
    email: string;
    phone: string;
  };
  locations: Location[];
  vehicles: Vehicle[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  clientId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  clientId: string;
  locationId: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  engine: string;
  licensePlate: string;
  mileage: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Van {
  id: string;
  name: string;
  licensePlate: string;
  capacity: {
    oil: number; // gallons
    filters: number;
  };
  assignedTechnicians: string[]; // technician IDs
  inventory: VanInventoryItem[];
  serviceArea: {
    center: { lat: number; lng: number };
    radius: number; // miles
  };
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date;
  };
  status: 'active' | 'maintenance' | 'inactive';
  maintenanceNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technician {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'invited' | 'onboarding' | 'active' | 'inactive' | 'suspended';
  assignedVan?: string;
  role: 'technician' | 'lead_tech' | 'supervisor';
  hrDocsUploaded: boolean;
  trainingCompleted: TrainingModule[];
  certifications: Certification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingModule {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: Date;
  certificateUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  documentUrl: string;
}

export interface Job {
  id: string;
  title: string;
  clientId: string;
  locationId: string;
  vehicleId: string;
  technicianId: string;
  vanId: string;
  services: JobService[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  notes?: string;
  costBreakdown: JobCostBreakdown;
  photos: string[]; // URLs
  createdAt: Date;
  updatedAt: Date;
}

export interface JobService {
  id: string;
  serviceId: string;
  serviceName: string;
  duration: number; // minutes
  price: number;
  inventoryUsed: InventoryUsage[];
  notes?: string;
  completed: boolean;
}

export interface InventoryUsage {
  inventoryItemId: string;
  quantity: number;
  cost: number;
}

export interface JobCostBreakdown {
  laborCost: number;
  partsCost: number;
  taxes: number;
  fees: number;
  discounts: number;
  totalPrice: number;
  invoiceNotes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'repairs' | 'inspection';
  estimatedDuration: number; // minutes
  basePrice: number;
  taxRate: number;
  requiredInventory: ServiceInventoryRequirement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceInventoryRequirement {
  inventoryItemId: string;
  quantity: number;
  required: boolean;
}

export interface InventoryItem {
  id: string;
  partId: string;
  name: string;
  description: string;
  type: 'oil' | 'filter' | 'fluid' | 'tools' | 'misc';
  unitCost: number;
  warehouseQuantity: number;
  restockThreshold: number;
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface VanInventoryItem {
  inventoryItemId: string;
  quantity: number;
  lastRestocked: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  assignedVan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'low_inventory' | 'job_assignment' | 'training_due' | 'maintenance_due' | 'general';
  title: string;
  message: string;
  recipientId: string;
  recipientType: 'technician' | 'admin';
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  actionUrl?: string;
}

// State management interfaces
export interface AppState {
  user: User | null;
  notifications: Notification[];
  activeJobs: Job[];
  vans: Van[];
  technicians: Technician[];
  clients: Client[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dispatcher' | 'technician' | 'manager';
  permissions: string[];
}

// UI State interfaces
export interface DashboardMetrics {
  activeVans: number;
  scheduledJobs: number;
  openTickets: number;
  vehiclesServicedToday: number;
  totalRevenue: number;
  avgServiceTime: number;
}

export interface MapViewState {
  center: { lat: number; lng: number };
  zoom: number;
  showVans: boolean;
  showJobs: boolean;
  selectedVan?: string;
  selectedJob?: string;
}
