import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCourse, deleteCourse, getCourses } from '../api/course';
import { getTutors } from '../api/tutor';
import type { TutorProfile } from '../types';

const tutorName = (tutor: string | TutorProfile) =>
  typeof tutor === 'string' ? tutor : `${tutor.firstName} ${tutor.lastName}`;

const CoursesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [yearGroup, setYearGroup] = useState('');
  const [topic, setTopic] = useState('');
  const [tutorId, setTutorId] = useState('');

  const coursesQuery = useQuery({ queryKey: ['admin', 'courses'], queryFn: getCourses });
  const tutorsQuery = useQuery({ queryKey: ['admin', 'tutors'], queryFn: getTutors });
  const matchingTutors = useMemo(
    () => (tutorsQuery.data?.tutors ?? []).filter((tutor) => !subject.trim() || tutor.subjects?.includes(subject.trim())),
    [subject, tutorsQuery.data?.tutors]
  );

  const closeModal = () => {
    setShowModal(false);
    setSubject('');
    setYearGroup('');
    setTopic('');
    setTutorId('');
  };

  const createMutation = useMutation({
    mutationFn: () => createCourse({ tutorId, subject: subject.trim(), yearGroup: yearGroup.trim(), topic: topic.trim() || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      closeModal();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] }),
  });

  const courses = coursesQuery.data?.courses ?? [];
  return (
    <div>
      <div className="top-row">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Assign tutors by subject and year. Matching actively enrolled students are added automatically.
          </p>
        </div>
        <button className="button" onClick={() => setShowModal(true)}>+ New course</button>
      </div>

      {coursesQuery.isLoading ? <p className="page-subtitle">Loading…</p> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Year group</th><th>Tutor</th><th>Students</th><th></th></tr></thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td><strong>{course.subject}</strong>{course.topic ? <div className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>{course.topic}</div> : null}</td>
                  <td>{course.yearGroup}</td>
                  <td>{tutorName(course.tutor)}</td>
                  <td>{course.students.length}</td>
                  <td><button className="button secondary small" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(course._id)}>Delete</button></td>
                </tr>
              ))}
              {!courses.length ? <tr><td colSpan={5} className="empty-state">No courses have been created.</td></tr> : null}
            </tbody>
          </table>
        </div>
      )}

      {showModal ? (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>New course</h2>
            <label className="label">Subject</label>
            <input className="input" value={subject} onChange={(event) => { setSubject(event.target.value); setTutorId(''); }} placeholder="e.g. Maths" />
            <label className="label">Year group</label>
            <input className="input" value={yearGroup} onChange={(event) => setYearGroup(event.target.value)} placeholder="e.g. Year 10" />
            <label className="label">Topic (optional)</label>
            <input className="input" value={topic} onChange={(event) => setTopic(event.target.value)} />
            <label className="label">Tutor</label>
            <select className="input" value={tutorId} onChange={(event) => setTutorId(event.target.value)}>
              <option value="">Select a tutor</option>
              {matchingTutors.map((tutor) => <option key={tutor._id} value={tutor._id}>{tutor.firstName} {tutor.lastName}</option>)}
            </select>
            {subject && !matchingTutors.length ? <p className="page-subtitle">No tutor is assigned to this subject yet.</p> : null}
            {createMutation.isError ? <p className="page-subtitle" style={{ color: '#c0392b' }}>{(createMutation.error as any)?.response?.data?.message ?? 'Could not create course.'}</p> : null}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="button" disabled={!subject.trim() || !yearGroup.trim() || !tutorId || createMutation.isPending} onClick={() => createMutation.mutate()}>{createMutation.isPending ? 'Creating…' : 'Create course'}</button>
              <button className="button secondary" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CoursesPage;
