export enum TripCategory {
  SHORT = 'Short Trip',
  MEDIUM = 'Medium Trip',
  LONG = 'Long Trip',
}

export interface TripConfig {
  id: string;
  name: TripCategory;
  maxDistance: string;
  validity: string;
  price: number;
  color: string;
}

export interface Passenger {
  id: string;
  name: string;
  nationalId: string;
  age: string;
  relation: string;
}

export interface Policy {
  id: string;
  plateNumber: string;
  tripCategory: TripCategory;
  startDate: string;
  passengers: Passenger[];
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  totalCost: number;
  qrCodeData?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  date: string;
  location: string;
  description: string;
  status: 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
  aiAnalysis?: string;
}

export type ViewState = 'HOME' | 'BUY_FLOW' | 'POLICIES' | 'CLAIMS' | 'SUPPORT';