
import type { Van, Technician, Client, Job, InventoryItem, Service, Location, Vehicle } from '../types';

export const mockVans: Van[] = [
  {
    id: 'van-1',
    name: 'Van Alpha',
    make: 'Ford',
    model: 'Transit',
    year: 2022,
    licensePlate: 'VAN-001',
    fuelLevel: 75,
    capacity: {
      oil: 50,
      filters: 20
    },
    assignedTechnicians: ['tech-1'],
    inventory: [
      { inventoryItemId: 'inv-1', quantity: 10, lastRestocked: new Date() },
      { inventoryItemId: 'inv-2', quantity: 5, lastRestocked: new Date() }
    ],
    serviceArea: {
      center: { lat: 40.7128, lng: -74.0060 },
      radius: 25
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'van-2',
    name: 'Van Beta',
    make: 'Chevrolet',
    model: 'Express',
    year: 2023,
    licensePlate: 'VAN-002',
    fuelLevel: 60,
    capacity: {
      oil: 45,
      filters: 18
    },
    assignedTechnicians: ['tech-2'],
    inventory: [
      { inventoryItemId: 'inv-1', quantity: 8, lastRestocked: new Date() }
    ],
    serviceArea: {
      center: { lat: 40.7589, lng: -73.9851 },
      radius: 30
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockTechnicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'John Smith',
    fullName: 'John Smith',
    email: 'john.smith@fleet.com',
    phone: '+1-555-0101',
    status: 'active',
    assignedVan: 'van-1',
    role: 'lead_tech',
    hrDocsUploaded: true,
    trainingCompleted: [
      { id: 'training-1', name: 'Oil Change Certification', completed: true, completedAt: new Date() }
    ],
    certifications: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-2',
    name: 'Mike Johnson',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@fleet.com',
    phone: '+1-555-0102',
    status: 'active',
    assignedVan: 'van-2',
    role: 'technician',
    hrDocsUploaded: true,
    trainingCompleted: [
      { id: 'training-1', name: 'Oil Change Certification', completed: true, completedAt: new Date() }
    ],
    certifications: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'ABC Corporation',
    businessName: 'ABC Corporation',
    email: 'contact@abc-corp.com',
    phone: '+1-555-1000',
    status: 'active',
    primaryContact: {
      name: 'Sarah Wilson',
      phone: '+1-555-1001',
      email: 'sarah@abc-corp.com'
    },
    billingInfo: {
      email: 'billing@abc-corp.com',
      phone: '+1-555-1002'
    },
    locations: [
      {
        id: 'loc-1',
        clientId: 'client-1',
        name: 'Main Warehouse',
        address: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        createdAt: new Date()
      }
    ],
    vehicles: [
      {
        id: 'vehicle-1',
        clientId: 'client-1',
        locationId: 'loc-1',
        vin: '1HGBH41JXMN109186',
        year: 2021,
        make: 'Honda',
        model: 'Accord',
        engine: '2.0L Turbo',
        licensePlate: 'ABC-001',
        mileage: 25000,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Oil Change Service',
    type: 'maintenance',
    clientId: 'client-1',
    locationId: 'loc-1',
    vehicleId: 'vehicle-1',
    technicianId: 'tech-1',
    vanId: 'van-1',
    services: [
      {
        id: 'service-1',
        serviceId: 'svc-1',
        serviceName: 'Oil Change',
        duration: 30,
        price: 50,
        inventoryUsed: [
          { inventoryItemId: 'inv-1', quantity: 1, cost: 25 }
        ],
        completed: false
      }
    ],
    status: 'scheduled',
    scheduledStart: new Date(),
    scheduledEnd: new Date(),
    costBreakdown: {
      laborCost: 50,
      partsCost: 25,
      taxes: 7.5,
      fees: 0,
      discounts: 0,
      totalPrice: 82.5
    },
    photos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    partId: 'part-1',
    name: 'Premium Motor Oil',
    sku: 'OIL-001',
    description: '5W-30 Full Synthetic Motor Oil',
    type: 'oil',
    category: 'Fluids',
    location: 'Warehouse A',
    unitCost: 25,
    unitPrice: 35,
    warehouseQuantity: 100,
    quantity: 100,
    minQuantity: 20,
    restockThreshold: 30,
    specifications: {
      viscosity: '5W-30',
      type: 'Full Synthetic',
      capacity: '5 Quarts'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2',
    partId: 'part-2',
    name: 'Oil Filter',
    sku: 'FILTER-001',
    description: 'Premium Oil Filter',
    type: 'filter',
    category: 'Filters',
    location: 'Warehouse A',
    unitCost: 8,
    unitPrice: 12,
    warehouseQuantity: 50,
    quantity: 50,
    minQuantity: 10,
    restockThreshold: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockServices: Service[] = [
  {
    id: 'svc-1',
    name: 'Oil Change',
    description: 'Complete oil change service',
    category: 'maintenance',
    estimatedDuration: 30,
    basePrice: 50,
    price: 50,
    isActive: true,
    taxRate: 0.10,
    requiredInventory: [
      { inventoryItemId: 'inv-1', quantity: 1, required: true },
      { inventoryItemId: 'inv-2', quantity: 1, required: true }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
