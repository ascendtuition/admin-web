import axiosInstance from './axios';
export interface LessonItem{_id:string;subject:string;topic?:string;scheduledAt:string;durationMinutes?:number;status:string;students:Array<string|{_id:string;firstName:string;lastName:string}>;tutor:string|{_id:string;firstName:string;lastName:string}}
export const getLessons=async()=>(await axiosInstance.get<{success:boolean;lessons:LessonItem[]}>('/lesson')).data;
export const createLesson=async(payload:{course:string;studentId:string;scheduledAt:string;durationMinutes:number;topic?:string;googleMeetLink?:string})=>(await axiosInstance.post('/lesson',payload)).data;
export const cancelLesson=async(id:string)=>(await axiosInstance.post(`/lesson/${id}/cancel`)).data;
