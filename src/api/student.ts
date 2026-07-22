import axiosInstance from './axios';
import type { StudentProfile } from '../types';

interface ListStudentsResult {
  success: boolean;
  students: StudentProfile[];
  message?: string;
}

export const getStudents = async () => {
  const { data } = await axiosInstance.get<ListStudentsResult>('/student');
  return data;
};
