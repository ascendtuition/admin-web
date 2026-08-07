import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTutors, createTutorAccount, updateTutor } from '../api/tutor';
import type { TutorProfile } from '../types';

const SUBJECT_OPTIONS = ['Maths', 'Chemistry', 'Biology', 'Physics', 'English', 'English Literature'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const TutorsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [availabilityTutor,setAvailabilityTutor]=useState<TutorProfile|null>(null);
  const [availability,setAvailability]=useState<Array<{dayOfWeek:number;startTime:string;endTime:string}>>([]);

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'tutors'], queryFn: getTutors });

  const createMutation = useMutation({
    mutationFn: () => createTutorAccount({ email, password, firstName, lastName, subjects }),
    onSuccess: (result) => {
      if (!result.success) {
        setError(result.message || 'Unable to create tutor');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'tutors'] });
      setShowModal(false);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setSubjects([]);
      setError('');
    },
  });
  const availabilityMutation=useMutation({mutationFn:()=>updateTutor(availabilityTutor!._id,{availability}),onSuccess:()=>{queryClient.invalidateQueries({queryKey:['admin','tutors']});setAvailabilityTutor(null)}});
  const editAvailability=(tutor:TutorProfile)=>{setAvailabilityTutor(tutor);setAvailability(tutor.availability??[])};
  const toggleDay=(dayOfWeek:number)=>setAvailability(prev=>prev.some(s=>s.dayOfWeek===dayOfWeek)?prev.filter(s=>s.dayOfWeek!==dayOfWeek):[...prev,{dayOfWeek,startTime:'09:00',endTime:'17:00'}]);
  const changeSlot=(dayOfWeek:number,key:'startTime'|'endTime',value:string)=>setAvailability(prev=>prev.map(s=>s.dayOfWeek===dayOfWeek?{...s,[key]:value}:s));

  const toggleSubject = (subject: string) => {
    setSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]));
  };

  return (
    <div>
      <div className="top-row">
        <div>
          <h1 className="page-title">Tutors</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Everyone teaching on Ascend Tuition.
          </p>
        </div>
        <button className="button" onClick={() => setShowModal(true)}>
          + New tutor
        </button>
      </div>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subjects</th>
                <th>Bio</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {(data?.tutors ?? []).map((tutor) => (
                <tr key={tutor._id}>
                  <td>
                    {tutor.firstName} {tutor.lastName}
                  </td>
                  <td>{(tutor.subjects ?? []).join(', ') || '—'}</td>
                  <td>{tutor.bio || '—'}</td>
                  <td><button className="button secondary" onClick={()=>editAvailability(tutor)}>{tutor.availability?.length?`${tutor.availability.length} days`:'Set hours'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal ? (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>New tutor account</h2>
            <label className="label">First name</label>
            <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label className="label">Last name</label>
            <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="label">Temporary password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="label">Subjects</label>
            <div className="chip-row">
              {SUBJECT_OPTIONS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className={`chip ${subjects.includes(subject) ? 'active' : ''}`}
                  onClick={() => toggleSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
            {error ? <p className="error-text">{error}</p> : null}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="button"
                onClick={() => createMutation.mutate()}
                disabled={!email || !password || !firstName || !lastName || createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating…' : 'Create tutor'}
              </button>
              <button className="button secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {availabilityTutor?<div className="modal-backdrop" onClick={()=>setAvailabilityTutor(null)}><div className="modal-card" onClick={e=>e.stopPropagation()}><h2 style={{marginTop:0}}>Availability · {availabilityTutor.firstName}</h2>{DAYS.map((day,dayOfWeek)=>{const slot=availability.find(s=>s.dayOfWeek===dayOfWeek);return <div key={day} style={{display:'grid',gridTemplateColumns:'120px 1fr 1fr',gap:8,alignItems:'center',marginBottom:8}}><label><input type="checkbox" checked={!!slot} onChange={()=>toggleDay(dayOfWeek)}/> {day}</label><input className="input" type="time" disabled={!slot} value={slot?.startTime??'09:00'} onChange={e=>changeSlot(dayOfWeek,'startTime',e.target.value)}/><input className="input" type="time" disabled={!slot} value={slot?.endTime??'17:00'} onChange={e=>changeSlot(dayOfWeek,'endTime',e.target.value)}/></div>})}<div style={{display:'flex',gap:8,marginTop:16}}><button className="button" onClick={()=>availabilityMutation.mutate()} disabled={availabilityMutation.isPending}>Save availability</button><button className="button secondary" onClick={()=>setAvailabilityTutor(null)}>Cancel</button></div></div></div>:null}
    </div>
  );
};

export default TutorsPage;
