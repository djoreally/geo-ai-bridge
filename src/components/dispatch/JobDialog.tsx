import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '@/contexts/AppContext';
import { useRelationalQueries } from '@/hooks/useRelationalQueries';
import { FleetOperationService } from '@/services/fleetOperations';
import { toast } from '@/hooks/use-toast';
import type { Job } from '@/types';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientId: z.string().min(1, 'Client is required'),
  locationId: z.string().min(1, 'Location is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),  
  technicianId: z.string().min(1, 'Technician is required'),
  vanId: z.string().min(1, 'Van is required'),
  scheduledStart: z.string().min(1, 'Start time is required'),
  scheduledEnd: z.string().min(1, 'End time is required'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  laborCost: z.number().min(0, 'Labor cost must be positive'),
  partsCost: z.number().min(0, 'Parts cost must be positive'),
  taxes: z.number().min(0, 'Taxes must be positive'),
  fees: z.number().min(0, 'Fees must be positive'),
  discounts: z.number().min(0, 'Discounts must be positive'),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string | null;
}

export function JobDialog({ open, onOpenChange, jobId }: JobDialogProps) {
  const { state, dispatch } = useAppContext();
  const { getAvailableResources } = useRelationalQueries();

  const existingJob = jobId ? state.jobs.find(j => j.id === jobId) : null;
  const isEditing = !!existingJob;
  const { availableVans, availableTechnicians } = getAvailableResources();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      clientId: '',
      locationId: '',
      vehicleId: '',
      technicianId: '',
      vanId: '',
      scheduledStart: '',
      scheduledEnd: '',
      status: 'scheduled',
      notes: '',
      laborCost: 0,
      partsCost: 0,
      taxes: 0,
      fees: 0,
      discounts: 0,
    },
  });

  const selectedClient = form.watch('clientId');
  const selectedClientData = state.clients.find(c => c.id === selectedClient);

  useEffect(() => {
    if (existingJob) {
      form.reset({
        title: existingJob.title,
        clientId: existingJob.clientId,
        locationId: existingJob.locationId,
        vehicleId: existingJob.vehicleId,
        technicianId: existingJob.technicianId,
        vanId: existingJob.vanId,
        scheduledStart: new Date(existingJob.scheduledStart).toISOString().slice(0, 16),
        scheduledEnd: new Date(existingJob.scheduledEnd).toISOString().slice(0, 16),
        status: existingJob.status,
        notes: existingJob.notes || '',
        laborCost: existingJob.costBreakdown.laborCost,
        partsCost: existingJob.costBreakdown.partsCost,
        taxes: existingJob.costBreakdown.taxes,
        fees: existingJob.costBreakdown.fees,
        discounts: existingJob.costBreakdown.discounts,
      });
    } else {
      form.reset({
        title: '',
        clientId: '',
        locationId: '',
        vehicleId: '',
        technicianId: '',
        vanId: '',
        scheduledStart: '',
        scheduledEnd: '',
        status: 'scheduled',
        notes: '',
        laborCost: 0,
        partsCost: 0,
        taxes: 0,
        fees: 0,
        discounts: 0,
      });
    }
  }, [existingJob, form]);

  const onSubmit = (data: JobFormData) => {
    const totalPrice = data.laborCost + data.partsCost + data.taxes + data.fees - data.discounts;

    // Validate job assignment
    const validation = FleetOperationService.validateJobAssignment(
      { vanId: data.vanId, technicianId: data.technicianId },
      state.vans,
      state.technicians
    );

    if (!validation.isValid) {
      toast({
        title: 'Assignment Error',
        description: validation.errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    const jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> = {
      title: data.title,
      clientId: data.clientId,
      locationId: data.locationId,
      vehicleId: data.vehicleId,
      technicianId: data.technicianId,
      vanId: data.vanId,
      services: [],
      status: data.status,
      scheduledStart: new Date(data.scheduledStart),
      scheduledEnd: new Date(data.scheduledEnd),
      notes: data.notes,
      costBreakdown: {
        laborCost: data.laborCost,
        partsCost: data.partsCost,
        taxes: data.taxes,
        fees: data.fees,
        discounts: data.discounts,
        totalPrice,
      },
      photos: [],
    };

    if (isEditing && existingJob) {
      dispatch({
        type: 'UPDATE_JOB',
        payload: {
          id: existingJob.id,
          updates: {
            ...jobData,
            updatedAt: new Date(),
          },
        },
      });
      toast({
        title: 'Job updated',
        description: 'The job has been successfully updated.',
      });
    } else {
      const newJob: Job = {
        ...jobData,
        id: FleetOperationService.generateJobId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'ADD_JOB', payload: newJob });
      toast({
        title: 'Job created',
        description: 'The job has been successfully created.',
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Job' : 'Create New Job'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {state.clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.businessName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedClientData?.locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.address}, {location.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedClientData?.vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTechnicians.map((technician) => (
                          <SelectItem key={technician.id} value={technician.id}>
                            {technician.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Van</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select van" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableVans.map((van) => (
                          <SelectItem key={van.id} value={van.id}>
                            {van.name} - {van.licensePlate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Start</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled End</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="laborCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labor Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partsCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parts Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discounts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounts</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end">
                  <div className="text-sm">
                    <div className="font-medium">Total: </div>
                    <div className="text-lg font-bold">
                      ${(form.watch('laborCost') + form.watch('partsCost') + form.watch('taxes') + form.watch('fees') - form.watch('discounts')).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
