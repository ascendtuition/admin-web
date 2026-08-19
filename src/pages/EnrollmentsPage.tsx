import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAllEnrollments } from '../api/enrollment';
import StatusPill from '../components/StatusPill';

const displayRef = (ref: string | { _id: string; firstName?: string; lastName?: string }) =>
  typeof ref === 'string' ? ref : `${ref.firstName ?? ''} ${ref.lastName ?? ''}`.trim() || ref._id;

const EnrollmentsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'enrollments'], queryFn: getAllEnrollments });

  return (
    <div>
      <h1 className="page-title">Enrollments</h1>
      <p className="page-subtitle">Every package enrollment across all families.</p>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Student</th>
                <th>Package</th>
                <th>Status</th>
                <th>Lessons left</th>
                <th>Ends</th>
              </tr>
            </thead>
            <tbody>
              {(data?.enrollments ?? []).map((enrollment) => (
                <tr key={enrollment._id}>
                  <td>{displayRef(enrollment.parent)}</td>
                  <td>{displayRef(enrollment.student)}</td>
                  <td>{typeof enrollment.package === 'string' ? enrollment.package : enrollment.package.name}</td>
                  <td>
                    <StatusPill label={enrollment.status} />
                  </td>
                  <td>
                    {enrollment.lessonsRemaining + Math.floor((enrollment.referralLessonCreditsRemaining ?? 0) + 0.000001)}
                    {(enrollment.referralCreditAwardedMinor ?? 0) > 0
                      ? ` (${(enrollment.referralLessonCreditsRemaining ?? 0).toFixed(2)} referral credits remaining · £${((enrollment.referralCreditAwardedMinor ?? 0) / 100).toFixed(2)} awarded)`
                      : ''}
                  </td>
                  <td>{format(new Date(enrollment.endDate), 'd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsPage;
