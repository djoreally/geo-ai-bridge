
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Van, Job, Technician, Client } from "@/types";

export const useVans = () => {
  const vans = useQuery(api.vans.list);
  const createVan = useMutation(api.vans.create);
  const updateVanStatus = useMutation(api.vans.updateStatus);

  return {
    vans: vans || [],
    createVan,
    updateVanStatus,
    isLoading: vans === undefined,
  };
};

export const useJobs = () => {
  const jobs = useQuery(api.jobs.list);
  const createJob = useMutation(api.jobs.create);

  return {
    jobs: jobs || [],
    createJob,
    isLoading: jobs === undefined,
  };
};

export const useTechnicians = () => {
  const technicians = useQuery(api.technicians.list);
  const availableTechnicians = useQuery(api.technicians.getAvailable);

  return {
    technicians: technicians || [],
    availableTechnicians: availableTechnicians || [],
    isLoading: technicians === undefined,
  };
};

export const useClients = () => {
  const clients = useQuery(api.clients.list);

  return {
    clients: clients || [],
    isLoading: clients === undefined,
  };
};
