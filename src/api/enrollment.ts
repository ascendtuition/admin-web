import axiosInstance from './axios';
import type { EnrollmentItem } from '../types';

interface ListEnrollmentsResult {
  success: boolean;
  enrollments: EnrollmentItem[];
  message?: string;
}

export const getAllEnrollments = async () => {
  const { data } = await axiosInstance.get<ListEnrollmentsResult>('/enrollment/admin');
  return data;
};
