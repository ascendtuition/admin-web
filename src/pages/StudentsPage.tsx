import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../api/student';

const StudentsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'students'], queryFn: getStudents });

  return (
    <div>
      <h1 className="page-title">Students</h1>
      <p className="page-subtitle">Every student account.</p>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Year group</th>
                <th>Subjects</th>
                <th>Streak</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {(data?.students ?? []).map((student) => (
                <tr key={student._id}>
                  <td>
                    {student.firstName} {student.lastName}
                  </td>
                  <td>{student.yearGroup ?? '—'}</td>
                  <td>{(student.subjects ?? []).join(', ') || '—'}</td>
                  <td>{student.streakCount ?? 0}</td>
                  <td>{student.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
