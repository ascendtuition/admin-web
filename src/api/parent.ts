import axiosInstance from './axios';
import type { ParentProfile } from '../types';

interface ListParentsResult {
  success: boolean;
  parents: ParentProfile[];
  message?: string;
}

export const getParents = async () => {
  const { data } = await axiosInstance.get<ListParentsResult>('/parent');
  return data;
};
