import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api/analytics';

const formatAmount = (amountMinor: number) => `£${(amountMinor / 100).toFixed(2)}`;
const count = (rows: Array<{ _id: string; count: number }> | undefined, status: string) => rows?.find((row) => row._id === status)?.count ?? 0;

const OverviewPage: React.FC = () => {
  const query = useQuery({ queryKey: ['admin', 'analytics'], queryFn: getAnalytics });
  const data = query.data?.analytics;
  if (query.isLoading) return <div className="card">Loading analytics…</div>;
  if (!data) return <div className="card">Analytics could not be loaded.</div>;
  const attendanceTotal = data.attendance.reduce((sum, row) => sum + row.count, 0);
  const attendanceRate = attendanceTotal ? Math.round((count(data.attendance, 'present') / attendanceTotal) * 100) : 0;
  const referralTotal = data.referrals.reduce((sum, row) => sum + row.count, 0);
  const referralConversion = referralTotal ? Math.round((count(data.referrals, 'rewarded') / referralTotal) * 100) : 0;

  return <div>
    <h1 className="page-title">Overview</h1><p className="page-subtitle">Live operational, learning and commercial performance.</p>
    <div className="stat-grid">
      <div className="stat-tile"><div className="stat-value">{Object.values(data.usersByRole).reduce((a, b) => a + b, 0)}</div><div className="stat-label">Total accounts</div></div>
      <div className="stat-tile"><div className="stat-value">{data.activeEnrollments}</div><div className="stat-label">Active enrollments</div></div>
      <div className="stat-tile"><div className="stat-value">{formatAmount(data.revenueThisMonthMinor)}</div><div className="stat-label">Revenue this month</div></div>
      <div className="stat-tile"><div className="stat-value">{data.recentlyActive}</div><div className="stat-label">Active in 30 days</div></div>
    </div>
    <div className="stat-grid">
      <div className="stat-tile"><div className="stat-value">{attendanceRate}%</div><div className="stat-label">Attendance rate</div></div>
      <div className="stat-tile"><div className="stat-value">{count(data.lessonStatus, 'completed')}</div><div className="stat-label">Lessons completed</div></div>
      <div className="stat-tile"><div className="stat-value">{count(data.paymentStatus, 'failed')}</div><div className="stat-label">Failed payments</div></div>
      <div className="stat-tile"><div className="stat-value">{referralConversion}%</div><div className="stat-label">Referral conversion</div></div>
    </div>
    <div className="card"><h2 style={{ marginTop: 0, fontSize: 16 }}>Progress by subject</h2>
      <div className="table-wrap"><table><thead><tr><th>Subject</th><th>Average mastery</th><th>Assessments</th></tr></thead><tbody>
        {data.progressBySubject.map((row) => <tr key={row._id}><td>{row._id}</td><td>{Math.round(row.averageMastery)}%</td><td>{row.records}</td></tr>)}
        {!data.progressBySubject.length ? <tr><td colSpan={3}>No progress data yet.</td></tr> : null}
      </tbody></table></div>
    </div>
  </div>;
};
export default OverviewPage;
