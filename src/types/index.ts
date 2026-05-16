export type WorkType = 'sales' | 'task';
export type UserRole = 'owner' | 'helper';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  bvnVerified: boolean;
  createdAt: string;
}

export interface OwnerProfile {
  userId: string;
  businessName: string;
  businessType: string;
  location: string;
  description?: string;
  logoUrl?: string;
  rating: number;
  totalGigsPosted: number;
  completedGigs: number;
  memberSince: string;
}

export interface HelperProfile {
  userId: string;
  firstName: string;
  lastInitial: string;
  workTypes: WorkType[];
  skills: { name: string; level: SkillLevel }[];
  location: string;
  approximateLocation: string;
  languages: string[];
  networks: string[];
  availability: {
    days: string[];
    from: string;
    to: string;
  };
  rating: number;
  completedGigs: number;
  totalEarnings: number;
  memberSince: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  pendingBalance: number;
  currency: 'NGN';
}

export interface Gig {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: WorkType;
  status: 'draft' | 'active' | 'paused' | 'closed';
  location: string;
  approximateLocation: string;
  skillLevel: SkillLevel | 'none';
  evidenceRequired?: string;
  additionalInfo?: string;
  applicantCount: number;
  activeWorkers: number;
  createdAt: string;

  // sales-specific
  productName?: string;
  productPrice?: number;
  commissionPercent?: number;
  stockAvailable?: number;
  starterStockValue?: number;

  // task-specific
  fixedPrice?: number;
  deadline?: string;
}

export interface HelperSnippet {
  firstName: string;
  lastInitial: string;
  verified: boolean;
  approximateLocation: string;
  skills: { name: string; level: SkillLevel }[];
  rating: number;
  completedGigs: number;
  evidencePhotos?: string[];
}

export interface MeetupDetails {
  address: string;
  landmark?: string;
  scheduledAt: string;
  notes?: string;
}

export interface Booking {
  id: string;
  gigId: string;
  ownerId: string;
  helperId: string;
  bookingType: WorkType;
  status: BookingStatus;
  coverNote: string;
  matchScore: number;
  matchReasoning: string;
  appliedAt: string;
  startedAt?: string;
  completedAt?: string;
  helper?: HelperSnippet;

  // sales-specific
  stockPickup?: MeetupDetails;
  paymentUrl?: string;
  qrCode?: string;
  earnings?: number;

  // task-specific
  escrowFunded?: boolean;
  escrowAmount?: number;
  submission?: {
    description: string;
    photos: string[];
    submittedAt: string;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  contractId?: string;
  type: 'credit' | 'debit' | 'escrow_hold' | 'escrow_release';
  amount: number;
  currency: 'NGN';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Reputation {
  id: string;
  reviewerId: string;
  revieweeId: string;
  contractId: string;
  rating: number;
  tags: string[];
  comment: string;
  createdAt: string;
}
