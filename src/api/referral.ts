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

export interface ReferralConfig { rewardType: 'credit' | 'free_lesson' | 'discount_percent'; rewardValue: number; requiresApproval: boolean; refereeRewardValue: number; isActive: boolean }
export const getReferralConfig = async () => (await axiosInstance.get<{success:boolean;config:ReferralConfig}>('/referral/config')).data;
export const updateReferralConfig = async (config: ReferralConfig) => (await axiosInstance.put('/referral/config', config)).data;
export const approveReferral = async (id: string) => (await axiosInstance.post(`/referral/${id}/approve`)).data;
