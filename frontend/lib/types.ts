export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  fees: number;
  rating: number;
  reviewCount: number;
  description?: string;
  image?: string;
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  specialization?: string;
}

export interface Placement {
  id: string;
  year: number;
  placementPercent: number;
  avgPackage: number;
  highestPackage?: number;
  topRecruiter?: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Comparison {
  id: string;
  name?: string;
  colleges: {
    college: College;
  }[];
  createdAt: string;
}
