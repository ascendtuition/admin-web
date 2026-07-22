import axiosInstance from './axios';
import type { PackageItem } from '../types';

interface ListPackagesResult {
  success: boolean;
  packages: PackageItem[];
  message?: string;
}

interface PackageResult {
  success: boolean;
  message?: string;
  package?: PackageItem;
}

export const getAllPackages = async () => {
  const { data } = await axiosInstance.get<ListPackagesResult>('/package/admin');
  return data;
};

export const createPackage = async (payload: {
  name: string;
  description?: string;
  priceMinor: number;
  currency: string;
  lessonsIncluded: number;
  validityDays: number;
}) => {
  const { data } = await axiosInstance.post<PackageResult>('/package', payload);
  return data;
};

export const updatePackage = async (packageId: string, changes: Partial<PackageItem>) => {
  const { data } = await axiosInstance.put<PackageResult>(`/package/${packageId}`, changes);
  return data;
};
