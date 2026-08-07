import axiosInstance from './axios';
export interface QuizQuestion { type:'mcq'|'free_response'; text:string; options?:string[]; correctIndex?:number; markScheme?:string; maxMarks:number }
export interface Quiz { _id:string; subject:string; topic?:string; questions:QuizQuestion[] }
export interface Deck { _id:string; subject:string; topic?:string; cards:Array<{_id?:string;front:string;back:string}> }
export interface Resource { _id:string; title:string; subject?:string; description?:string; body?:string; fileUrl?:string }
export const getQuizzes=async()=>(await axiosInstance.get<{success:boolean;quizzes:Quiz[]}>('/quiz')).data;
export const saveQuiz=async(payload:Omit<Quiz,'_id'>,id?:string)=>(await (id?axiosInstance.put(`/quiz/${id}`,payload):axiosInstance.post('/quiz',payload))).data;
export const deleteQuiz=async(id:string)=>(await axiosInstance.delete(`/quiz/${id}`)).data;
export const getDecks=async()=>(await axiosInstance.get<{success:boolean;decks:Deck[]}>('/flashcard')).data;
export const saveDeck=async(payload:Omit<Deck,'_id'>,id?:string)=>(await (id?axiosInstance.put(`/flashcard/${id}`,payload):axiosInstance.post('/flashcard',payload))).data;
export const deleteDeck=async(id:string)=>(await axiosInstance.delete(`/flashcard/${id}`)).data;
export const getResources=async()=>(await axiosInstance.get<{success:boolean;resources:Resource[]}>('/resource')).data;
export const saveResource=async(payload:Omit<Resource,'_id'>,id?:string,file?:File)=>{const form=new FormData();Object.entries(payload).forEach(([key,value])=>value!==undefined&&form.append(key,String(value)));if(file)form.append('file',file);return(await(id?axiosInstance.put(`/resource/${id}`,form):axiosInstance.post('/resource',form))).data};
export const deleteResource=async(id:string)=>(await axiosInstance.delete(`/resource/${id}`)).data;
