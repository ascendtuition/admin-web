import axiosInstance from './axios';
import type { ReferralItem } from '../types';

interface ListReferralsResult {
  success: boolean;
  referrals: ReferralItem[];
  message?: string;
}

export const getAllReferrals = async () => {
  const { data } = await axiosInstance.get<ListReferralsResult>('/referral/admin');
  return data;
};
