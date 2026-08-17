import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCourse, deleteCourse, getCourses, updateCourse } from '../api/course';
import { getTutors } from '../api/tutor';
import type { CourseItem, TutorProfile } from '../types';

const tutorName = (tutor: string | TutorProfile) =>
  typeof tutor === 'string' ? tutor : `${tutor.firstName} ${tutor.lastName}`;

const YEAR_GROUPS = Array.from({ length: 7 }, (_, index) => `Year ${index + 7}`);

const CoursesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CourseItem | null>(null);
  const [subject, setSubject] = useState('');
  const [yearGroups, setYearGroups] = useState<string[]>([]);
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
    setEditing(null);
    setSubject('');
    setYearGroups([]);
    setTopic('');
    setTutorId('');
  };

  const createMutation = useMutation({
    mutationFn: () => createCourse({ tutorId, subject: subject.trim(), yearGroups, topic: topic.trim() || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      closeModal();
    },
  });
  const updateMutation = useMutation({
    mutationFn: () => updateCourse(editing!._id, { tutorId, subject: subject.trim(), yearGroups, topic: topic.trim() || undefined }),
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
  const openCreate = () => {
    setEditing(null);
    setSubject('');
    setYearGroups([]);
    setTopic('');
    setTutorId('');
    setShowModal(true);
  };
  const openEdit = (course: CourseItem) => {
    setEditing(course);
    setSubject(course.subject);
    setYearGroups(course.yearGroups ?? []);
    setTopic(course.topic ?? '');
    setTutorId(typeof course.tutor === 'string' ? course.tutor : course.tutor._id);
    setShowModal(true);
  };
  const saveMutation = editing ? updateMutation : createMutation;
  return (
    <div>
      <div className="top-row">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Assign tutors by subject and year. Matching actively enrolled students are added automatically.
          </p>
        </div>
        <button className="button" onClick={openCreate}>+ New course</button>
      </div>

      {coursesQuery.isLoading ? <p className="page-subtitle">Loading…</p> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Year group</th><th>Tutor</th><th>Students</th><th></th></tr></thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td><strong>{course.subject}</strong>{course.topic ? <div className="page-subtitle" style={{ margin: 0, fontSize: 12 }}>{course.topic}</div> : null}</td>
                  <td>{course.yearGroups.join(', ')}</td>
                  <td>{tutorName(course.tutor)}</td>
                  <td>{course.students.length}</td>
                  <td><div style={{ display: 'flex', gap: 8 }}><button className="button secondary small" onClick={() => openEdit(course)}>Edit</button><button className="button secondary small" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(course._id)}>Delete</button></div></td>
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
            <h2 style={{ marginTop: 0 }}>{editing ? 'Edit course' : 'New course'}</h2>
            <label className="label">Subject</label>
            <input className="input" value={subject} onChange={(event) => { setSubject(event.target.value); setTutorId(''); }} placeholder="e.g. Maths" />
            <fieldset className="year-group-fieldset">
              <legend className="label">Year groups</legend>
              <div className="year-group-options">
                {YEAR_GROUPS.map((year) => (
                  <label key={year} className={`year-group-option${yearGroups.includes(year) ? ' selected' : ''}`}>
                    <input type="checkbox" checked={yearGroups.includes(year)} onChange={() => setYearGroups((current) => current.includes(year) ? current.filter((item) => item !== year) : [...current, year])} />
                    <span>{year}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="field-help">Select every year that can enroll in this course. Uploaded content remains tagged to a specific year.</p>
            <label className="label">Topic (optional)</label>
            <input className="input" value={topic} onChange={(event) => setTopic(event.target.value)} />
            <label className="label">Tutor</label>
            <select className="input" value={tutorId} onChange={(event) => setTutorId(event.target.value)}>
              <option value="">Select a tutor</option>
              {matchingTutors.map((tutor) => <option key={tutor._id} value={tutor._id}>{tutor.firstName} {tutor.lastName}</option>)}
            </select>
            {subject && !matchingTutors.length ? <p className="page-subtitle">No tutor is assigned to this subject yet.</p> : null}
            {saveMutation.isError ? <p className="page-subtitle" style={{ color: '#c0392b' }}>{(saveMutation.error as any)?.response?.data?.message ?? `Could not ${editing ? 'update' : 'create'} course.`}</p> : null}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="button" disabled={!subject.trim() || yearGroups.length === 0 || !tutorId || saveMutation.isPending} onClick={() => saveMutation.mutate()}>{saveMutation.isPending ? 'Saving…' : editing ? 'Save changes' : 'Create course'}</button>
              <button className="button secondary" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CoursesPage;
