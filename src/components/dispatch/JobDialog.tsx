
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/contexts/AppContext';
import type { Job } from '@/types';

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job;
  selectedDate?: Date;
}

export function JobDialog({ open, onOpenChange, job, selectedDate }: JobDialogProps) {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    title: job?.title || '',
    type: job?.type || 'maintenance',
    description: job?.description || '',
    clientId: job?.clientId || '',
    locationId: job?.locationId || '',
    vehicleId: job?.vehicleId || '',
    technicianId: job?.technicianId || '',
    vanId: job?.vanId || '',
    scheduledStart: job?.scheduledStart || selectedDate || new Date(),
    scheduledEnd: job?.scheduledEnd || new Date(),
    notes: job?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      clientId: formData.clientId,
      locationId: formData.locationId,
      vehicleId: formData.vehicleId,
      technicianId: formData.technicianId,
      vanId: formData.vanId,
      services: [],
      status: 'scheduled',
      scheduledStart: formData.scheduledStart,
      scheduledEnd: formData.scheduledEnd,
      notes: formData.notes,
      costBreakdown: {
        laborCost: 0,
        partsCost: 0,
        taxes: 0,
        fees: 0,
        discounts: 0,
        totalPrice: 0
      },
      photos: []
    };

    if (job) {
      dispatch({
        type: 'UPDATE_JOB',
        payload: {
          id: job.id,
          updates: jobData
        }
      });
    } else {
      const newJob: Job = {
        ...jobData,
        id: `job-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dispatch({ type: 'ADD_JOB', payload: newJob });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Create New Job'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Job Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {state.clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="technician">Technician</Label>
              <Select value={formData.technicianId} onValueChange={(value) => setFormData({ ...formData, technicianId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {state.technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {job ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
