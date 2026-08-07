import axiosInstance from './axios';
export const broadcastNotification = async (payload: { title: string; body: string; audienceType: 'all' | 'role' | 'course' | 'individual'; audienceValue?: string }) => (await axiosInstance.post('/notification/broadcast', payload)).data;
