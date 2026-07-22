export type UserRole = 'student' | 'parent' | 'tutor' | 'admin';

export interface AdminUser {
  _id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface StudentProfile {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  yearGroup?: string;
  subjects?: string[];
  streakCount?: number;
  points?: number;
}

export interface ParentProfile {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  children?: string[];
  referralCode: string;
  credits?: number;
}

export interface TutorProfile {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  subjects?: string[];
  bio?: string;
}

export interface PackageItem {
  _id: string;
  name: string;
  description?: string;
  priceMinor: number;
  currency: string;
  lessonsIncluded: number;
  validityDays: number;
  isActive?: boolean;
}

interface Ref {
  _id: string;
  firstName?: string;
  lastName?: string;
}

export interface EnrollmentItem {
  _id: string;
  parent: string | Ref;
  student: string | Ref;
  package: string | PackageItem;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  lessonsRemaining: number;
}

export interface PaymentItem {
  _id: string;
  parent: string | Ref;
  enrollment?: string;
  amountMinor: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  createdAt: string;
}

export interface ReferralItem {
  _id: string;
  referrer: string | Ref;
  code: string;
  refereeEmail?: string;
  status: 'invited' | 'signedup' | 'enrolled' | 'rewarded';
  rewardType?: string;
  rewardValue?: number;
  createdAt: string;
}
