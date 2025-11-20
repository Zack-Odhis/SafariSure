import { TripCategory, TripConfig, Policy } from './types';
import { Car, MapPin, ShieldCheck } from 'lucide-react';

export const TRIP_TYPES: TripConfig[] = [
  {
    id: 'short',
    name: TripCategory.SHORT,
    maxDistance: '≤100 km',
    validity: '6 hours',
    price: 150, // KES
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    id: 'medium',
    name: TripCategory.MEDIUM,
    maxDistance: '≤300 km',
    validity: '12 hours',
    price: 450, // KES
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  {
    id: 'long',
    name: TripCategory.LONG,
    maxDistance: '>300 km',
    validity: '24 hours',
    price: 950, // KES
    color: 'bg-orange-100 text-orange-700 border-orange-300',
  },
];

export const MOCK_POLICIES: Policy[] = [];