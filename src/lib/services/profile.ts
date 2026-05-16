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
    workTypes: string[];
    skills?: { name: string; level: string }[];
    networks?: string[];
    availability?: { days: string[]; from: string; to: string };
  }) => api.post<HelperProfile>('/api/users/me/helper-profile', payload),
};
