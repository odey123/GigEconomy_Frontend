import { api } from '../api';
import type { OwnerProfile, HelperProfile } from '../../types';

export const profileService = {
  createOwnerProfile: (payload: {
    businessName: string;
    businessType: string;
    location: string;
    description?: string;
  }) => api.post<OwnerProfile>('/api/users/me/owner-profile', payload),

  createHelperProfile: (payload: {
    openTo: ('sales' | 'task')[];   // required — "sales" | "task" | both
    skills?: string[];
    preferredRadius?: number;
  }) => api.post<HelperProfile>('/api/users/me/helper-profile', payload),
};
