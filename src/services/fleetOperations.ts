
import type { Job, Van, Technician, Client, Vehicle, Location } from '@/types';

export class FleetOperationService {
  static validateJobAssignment(job: Partial<Job>, vans: Van[], technicians: Technician[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check van availability
    const assignedVan = vans.find(v => v.id === job.vanId);
    if (!assignedVan) {
      errors.push('Selected van not found');
    } else if (assignedVan.status !== 'active') {
      errors.push('Selected van is not active');
    }

    // Check technician availability
    const assignedTech = technicians.find(t => t.id === job.technicianId);
    if (!assignedTech) {
      errors.push('Selected technician not found');
    } else if (assignedTech.status !== 'active') {
      errors.push('Selected technician is not active');
    }

    // Check van-technician compatibility
    if (assignedVan && assignedTech) {
      if (assignedTech.assignedVan && assignedTech.assignedVan !== assignedVan.id) {
        errors.push('Technician is assigned to a different van');
      }
      if (!assignedVan.assignedTechnicians.includes(assignedTech.id)) {
        errors.push('Technician is not assigned to the selected van');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static calculateJobDistance(
    vanLocation: { lat: number; lng: number } | undefined,
    jobLocation: { lat: number; lng: number } | undefined
  ): number {
    if (!vanLocation || !jobLocation) return 0;

    // Haversine formula for distance calculation
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(jobLocation.lat - vanLocation.lat);
    const dLng = this.toRadians(jobLocation.lng - vanLocation.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(vanLocation.lat)) * 
      Math.cos(this.toRadians(jobLocation.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static findOptimalVanAssignment(
    job: Partial<Job>,
    vans: Van[],
    jobLocation?: { lat: number; lng: number }
  ): Van | null {
    const availableVans = vans.filter(v => v.status === 'active');
    
    if (!availableVans.length || !jobLocation) return null;

    // Find closest van within service area
    const suitableVans = availableVans.filter(van => {
      if (!van.currentLocation) return true; // Assume available if location unknown
      
      const distance = this.calculateJobDistance(van.currentLocation, jobLocation);
      return distance <= van.serviceArea.radius;
    });

    if (!suitableVans.length) return availableVans[0]; // Fallback to any available van

    // Return closest van
    return suitableVans.reduce((closest, van) => {
      const vanDistance = this.calculateJobDistance(van.currentLocation, jobLocation);
      const closestDistance = this.calculateJobDistance(closest.currentLocation, jobLocation);
      
      return vanDistance < closestDistance ? van : closest;
    });
  }

  static generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateVanId(): string {
    return `van_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateTechnicianId(): string {
    return `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
