import axiosInstance from './axios';

export interface Analytics {
  usersByRole: Record<string, number>;
  activeEnrollments: number;
  revenueThisMonthMinor: number;
  recentlyActive: number;
  paymentStatus: Array<{ _id: string; count: number; amountMinor: number }>;
  attendance: Array<{ _id: string; count: number }>;
  lessonStatus: Array<{ _id: string; count: number }>;
  progressBySubject: Array<{ _id: string; averageMastery: number; records: number }>;
  referrals: Array<{ _id: string; count: number; rewardValue: number }>;
}

export const getAnalytics = async () => {
  const { data } = await axiosInstance.get<{ success: boolean; analytics: Analytics }>('/analytics/overview');
  return data;
};
