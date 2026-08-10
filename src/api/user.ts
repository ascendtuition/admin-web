import axiosInstance from './axios';
import type { AdminUser } from '../types';

interface ListUsersResult {
  success: boolean;
  users: AdminUser[];
  message?: string;
}

interface GetUserResult {
  success: boolean;
  user: AdminUser;
  message?: string;
}

export const getUsers = async () => {
  const { data } = await axiosInstance.get<ListUsersResult>('/user');
  return data;
};

export const updateUser = async (userId: string, changes: { isActive?: boolean }) => {
  const { data } = await axiosInstance.patch<GetUserResult>(`/user/${userId}/status`, changes);
  return data;
};
export const updateUserAccess=async(userId:string,role:'admin'|'owner',permissions:string[])=>(await axiosInstance.patch(`/user/${userId}/access`,{role,permissions})).data;

export const deactivateUser = async (userId: string) => {
  const { data } = await axiosInstance.delete<GetUserResult>(`/user/${userId}/deactivate`);
  return data;
};
