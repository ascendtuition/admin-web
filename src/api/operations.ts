import axiosInstance from './axios';
export const getSupportTickets=async()=>(await axiosInstance.get('/support/admin')).data;
export const updateSupportTicket=async(id:string,status:'in_progress'|'resolved',adminReply:string)=>(await axiosInstance.patch(`/support/${id}`,{status,adminReply})).data;
export const getPrivacyRequests=async()=>(await axiosInstance.get('/privacy/requests')).data;
export const updatePrivacyRequest=async(id:string,status:'completed'|'rejected',notes:string)=>(await axiosInstance.patch(`/privacy/requests/${id}`,{status,notes})).data;
export const getAuditLogs=async()=>(await axiosInstance.get('/audit',{params:{limit:200}})).data;
