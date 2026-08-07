import React,{useState} from 'react';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import { createParentAccount,getParents,linkChild,unlinkChild } from '../api/parent';
import { getStudents } from '../api/student';
import type{ParentProfile}from'../types';

const ParentsPage: React.FC = () => {
  const qc=useQueryClient();const[selected,setSelected]=useState<ParentProfile|null>(null);
  const[creating,setCreating]=useState(false);const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[firstName,setFirstName]=useState('');const[lastName,setLastName]=useState('');
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'parents'], queryFn: getParents });
  const students=useQuery({queryKey:['admin','students'],queryFn:getStudents});
  const link=useMutation({mutationFn:(studentUserId:string)=>linkChild(selected!.user,studentUserId),onSuccess:()=>{qc.invalidateQueries({queryKey:['admin','parents']});setSelected(null)}});
  const unlink=useMutation({mutationFn:(studentId:string)=>unlinkChild(selected!._id,studentId),onSuccess:()=>{qc.invalidateQueries({queryKey:['admin','parents']});setSelected(null)}});
  const create=useMutation({mutationFn:()=>createParentAccount({email,password,firstName,lastName}),onSuccess:()=>{qc.invalidateQueries({queryKey:['admin','parents']});setCreating(false)}});

  return (
    <div>
      <div className="top-row"><div><h1 className="page-title">Parents</h1><p className="page-subtitle">Create accounts and manage family links.</p></div><button className="button" onClick={()=>setCreating(true)}>+ New parent</button></div>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Children</th>
                <th>Referral code</th>
                <th>Credits</th>
                <th>Family links</th>
              </tr>
            </thead>
            <tbody>
              {(data?.parents ?? []).map((parent) => (
                <tr key={parent._id}>
                  <td>
                    {parent.firstName} {parent.lastName}
                  </td>
                  <td>{(parent.children ?? []).length}</td>
                  <td>{parent.referralCode}</td>
                  <td>£{((parent.credits ?? 0) / 100).toFixed(2)}</td>
                  <td><button className="button secondary" onClick={()=>setSelected(parent)}>Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected?<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="modal-card" onClick={e=>e.stopPropagation()}><h2 style={{marginTop:0}}>Children · {selected.firstName}</h2>{(students.data?.students??[]).map(student=>{const linked=(selected.children??[]).some(child=>typeof child==='string'?child===student._id:(child as any)._id===student._id);return <div key={student._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee'}}><span>{student.firstName} {student.lastName} · {student.yearGroup??'No year'}</span><button className={`button ${linked?'secondary':''}`} onClick={()=>linked?unlink.mutate(student._id):link.mutate(student.user)}>{linked?'Unlink':'Link'}</button></div>})}<button className="button secondary" style={{marginTop:16}} onClick={()=>setSelected(null)}>Close</button></div></div>:null}
      {creating?<div className="modal-backdrop" onClick={()=>setCreating(false)}><div className="modal-card" onClick={e=>e.stopPropagation()}><h2 style={{marginTop:0}}>New parent</h2><label className="label">First name</label><input className="input" value={firstName} onChange={e=>setFirstName(e.target.value)}/><label className="label">Last name</label><input className="input" value={lastName} onChange={e=>setLastName(e.target.value)}/><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)}/><label className="label">Temporary password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)}/><div style={{display:'flex',gap:8}}><button className="button" onClick={()=>create.mutate()} disabled={!firstName||!lastName||!email||password.length<8||create.isPending}>Create</button><button className="button secondary" onClick={()=>setCreating(false)}>Cancel</button></div></div></div>:null}
    </div>
  );
};

export default ParentsPage;
