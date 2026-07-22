import axiosInstance from './axios';
import type { TutorProfile } from '../types';

interface ListTutorsResult {
  success: boolean;
  tutors: TutorProfile[];
  message?: string;
}

interface CreateTutorResult {
  success: boolean;
  message?: string;
  tutor?: TutorProfile;
}

export const getTutors = async () => {
  const { data } = await axiosInstance.get<ListTutorsResult>('/tutor');
  return data;
};

export const createTutorAccount = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  subjects: string[];
  bio?: string;
}) => {
  const { data } = await axiosInstance.post<CreateTutorResult>('/tutor/create-account', payload);
  return data;
};

export const updateTutor = async (tutorId: string, changes: Partial<TutorProfile>) => {
  const { data } = await axiosInstance.put<CreateTutorResult>(`/tutor/${tutorId}`, changes);
  return data;
};
