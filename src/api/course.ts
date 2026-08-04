import axiosInstance from './axios';
import type { CourseItem } from '../types';

export const getCourses = async () => {
  const { data } = await axiosInstance.get<{ success: boolean; courses: CourseItem[] }>('/course');
  return data;
};

export const createCourse = async (payload: {
  tutorId: string;
  subject: string;
  yearGroup: string;
  topic?: string;
}) => {
  const { data } = await axiosInstance.post<{ success: boolean; course: CourseItem; message?: string }>('/course', payload);
  return data;
};

export const deleteCourse = async (courseId: string) => {
  const { data } = await axiosInstance.delete<{ success: boolean; message?: string }>(`/course/${courseId}`);
  return data;
};
