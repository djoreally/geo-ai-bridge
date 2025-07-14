
import type { Van, Job, Technician, Client, InventoryItem, Service } from '../types';

// Mock data for development
export const mockVans: Van[] = [
  {
    id: 'van-1',
    name: 'Van Alpha',
    licensePlate: 'FLT-001',
    capacity: { oil: 50, filters: 100 },
    assignedTechnicians: ['tech-1'],
    inventory: [
      { inventoryItemId: 'inv-1', quantity: 25, lastRestocked: new Date('2024-01-10') },
      { inventoryItemId: 'inv-2', quantity: 50, lastRestocked: new Date('2024-01-10') }
    ],
    serviceArea: {
      center: { lat: 40.7128, lng: -74.0060 },
      radius: 25
    },
    currentLocation: {
      lat: 40.7580,
      lng: -73.9855,
      lastUpdated: new Date()
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'van-2',
    name: 'Van Beta',
    licensePlate: 'FLT-002',
    capacity: { oil: 45, filters: 80 },
    assignedTechnicians: ['tech-2'],
    inventory: [
      { inventoryItemId: 'inv-1', quantity: 20, lastRestocked: new Date('2024-01-08') }
    ],
    serviceArea: {
      center: { lat: 40.6782, lng: -73.9442 },
      radius: 20
    },
    currentLocation: {
      lat: 40.6892,
      lng: -73.9442,
      lastUpdated: new Date()
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockTechnicians: Technician[] = [
  {
    id: 'tech-1',
    fullName: 'John Martinez',
    email: 'john.martinez@fleetcommand.com',
    phone: '+1-555-0101',
    status: 'active',
    assignedVan: 'van-1',
    role: 'lead_tech',
    hrDocsUploaded: true,
    trainingCompleted: [
      { id: 'training-1', name: 'Oil Change Certification', completed: true, completedAt: new Date('2024-01-15') }
    ],
    certifications: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'tech-2',
    fullName: 'Sarah Williams',
    email: 'sarah.williams@fleetcommand.com',
    phone: '+1-555-0102',
    status: 'active',
    assignedVan: 'van-2',
    role: 'technician',
    hrDocsUploaded: true,
    trainingCompleted: [
      { id: 'training-1', name: 'Oil Change Certification', completed: true, completedAt: new Date('2024-01-20') }
    ],
    certifications: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date()
  }
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    businessName: 'Metro Logistics Corp',
    primaryContact: {
      name: 'Mike Johnson',
      phone: '+1-555-0201',
      email: 'mike.johnson@metrologistics.com'
    },
    billingInfo: {
      email: 'billing@metrologistics.com',
      phone: '+1-555-0202'
    },
    locations: [
      {
        id: 'loc-1',
        clientId: 'client-1',
        address: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        coordinates: { lat: 40.7505, lng: -73.9934 },
        createdAt: new Date('2024-01-01')
      }
    ],
    vehicles: [
      {
        id: 'vehicle-1',
        clientId: 'client-1',
        locationId: 'loc-1',
        vin: '1HGBH41JXMN109186',
        year: 2022,
        make: 'Ford',
        model: 'Transit',
        engine: '3.5L V6',
        licensePlate: 'NYC-123',
        mileage: 45000,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Oil Change - Metro Logistics Van',
    clientId: 'client-1',
    locationId: 'loc-1',
    vehicleId: 'vehicle-1',
    technicianId: 'tech-1',
    vanId: 'van-1',
    services: [
      {
        id: 'job-service-1',
        serviceId: 'service-1',
        serviceName: 'Oil Change',
        duration: 30,
        price: 85.00,
        inventoryUsed: [
          { inventoryItemId: 'inv-1', quantity: 5, cost: 25.00 },
          { inventoryItemId: 'inv-2', quantity: 1, cost: 15.00 }
        ],
        completed: false
      }
    ],
    status: 'scheduled',
    scheduledStart: new Date('2024-01-15T10:00:00'),
    scheduledEnd: new Date('2024-01-15T10:30:00'),
    costBreakdown: {
      laborCost: 45.00,
      partsCost: 40.00,
      taxes: 6.80,
      fees: 0,
      discounts: 0,
      totalPrice: 91.80
    },
    photos: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date()
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    partId: 'OIL-5W30-SYN',
    name: '5W-30 Synthetic Oil',
    description: 'Premium synthetic motor oil',
    type: 'oil',
    unitCost: 5.00,
    warehouseQuantity: 500,
    restockThreshold: 50,
    specifications: {
      viscosity: '5W-30',
      type: 'synthetic',
      capacity: '1 quart'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'inv-2',
    partId: 'FILTER-STD-001',
    name: 'Standard Oil Filter',
    description: 'Universal oil filter for most vehicles',
    type: 'filter',
    unitCost: 15.00,
    warehouseQuantity: 200,
    restockThreshold: 25,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Oil Change',
    description: 'Complete oil and filter change service',
    category: 'maintenance',
    estimatedDuration: 30,
    basePrice: 85.00,
    taxRate: 0.08,
    requiredInventory: [
      { inventoryItemId: 'inv-1', quantity: 5, required: true },
      { inventoryItemId: 'inv-2', quantity: 1, required: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Mock API service
export class MockDataService {
  static async getVans(): Promise<Van[]> {
    await this.delay(500);
    return mockVans;
  }

  static async getTechnicians(): Promise<Technician[]> {
    await this.delay(300);
    return mockTechnicians;
  }

  static async getClients(): Promise<Client[]> {
    await this.delay(400);
    return mockClients;
  }

  static async getJobs(): Promise<Job[]> {
    await this.delay(600);
    return mockJobs;
  }

  static async getInventory(): Promise<InventoryItem[]> {
    await this.delay(200);
    return mockInventory;
  }

  static async getServices(): Promise<Service[]> {
    await this.delay(200);
    return mockServices;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
