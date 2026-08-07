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

export const linkChild = async (parentUserId:string,studentUserId:string)=>(await axiosInstance.post('/family/link',{parentUserId,studentUserId})).data;
export const unlinkChild = async (parentId:string,studentId:string)=>(await axiosInstance.delete(`/family/${parentId}/children/${studentId}`)).data;
export const createParentAccount=async(payload:{email:string;password:string;firstName:string;lastName:string})=>(await axiosInstance.post('/auth/signup',{...payload,role:'parent'})).data;
export const updateParent=async(id:string,payload:Partial<ParentProfile>)=>(await axiosInstance.put(`/parent/${id}`,payload)).data;
