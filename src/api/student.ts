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

export const createStudentAccount=async(payload:{email:string;password:string;firstName:string;lastName:string;yearGroup?:string;subjects?:string[]})=>{const{data}=await axiosInstance.post('/auth/signup',{...payload,role:'student'});if(data.success&&(payload.yearGroup||payload.subjects?.length))await axiosInstance.put(`/student/${data.profile._id}`,{yearGroup:payload.yearGroup,subjects:payload.subjects});return data};
export const updateStudent=async(id:string,payload:Partial<StudentProfile>)=>(await axiosInstance.put(`/student/${id}`,payload)).data;
