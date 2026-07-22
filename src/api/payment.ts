import axiosInstance from './axios';
import type { PaymentItem } from '../types';

interface ListPaymentsResult {
  success: boolean;
  payments: PaymentItem[];
  message?: string;
}

export const getAllPayments = async () => {
  const { data } = await axiosInstance.get<ListPaymentsResult>('/payment/admin');
  return data;
};
