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

  const totalAccounts = Object.values(data.usersByRole).reduce((a, b) => a + b, 0);
  const metrics = [
    { value: totalAccounts, label: 'Total accounts', note: 'Across every user role', tone: 'purple' },
    { value: data.activeEnrollments, label: 'Active enrollments', note: 'Currently learning', tone: 'gold' },
    { value: formatAmount(data.revenueThisMonthMinor), label: 'Monthly revenue', note: 'Processed this month', tone: 'green' },
    { value: `${attendanceRate}%`, label: 'Attendance rate', note: `${count(data.lessonStatus, 'completed')} lessons completed`, tone: 'blue' },
  ];

  return <div>
    <div className="dashboard-heading"><div><div className="eyebrow">Live workspace</div><h1 className="page-title">Good to see you</h1><p className="page-subtitle">A clear view of learning, operations and commercial performance.</p></div><div className="live-indicator"><span /> Live data</div></div>
    <div className="metric-grid">
      {metrics.map((metric) => <div className={`metric-card ${metric.tone}`} key={metric.label}><div className="metric-top"><span>{metric.label}</span><span className="metric-symbol">↗</span></div><strong>{metric.value}</strong><small>{metric.note}</small></div>)}
    </div>
    <div className="dashboard-grid">
      <section className="panel panel-wide"><div className="panel-heading"><div><span className="eyebrow">Learning outcomes</span><h2>Progress by subject</h2></div><span className="panel-meta">Mastery overview</span></div>
        {data.progressBySubject.length ? <div className="subject-progress-list">{data.progressBySubject.map((row) => { const mastery = Math.round(row.averageMastery); return <div className="subject-progress" key={row._id}><div className="subject-progress-copy"><strong>{row._id}</strong><span>{row.records} assessment{row.records === 1 ? '' : 's'}</span></div><div className="progress-track"><span style={{ width: `${Math.min(100, Math.max(0, mastery))}%` }} /></div><b>{mastery}%</b></div>; })}</div> : <div className="empty-state">No subject progress has been recorded yet.</div>}
      </section>
      <aside className="panel"><div className="panel-heading"><div><span className="eyebrow">Health check</span><h2>Operations snapshot</h2></div></div>
        <div className="snapshot-list">
          <div><span>Recently active</span><strong>{data.recentlyActive}</strong><small>in the last 30 days</small></div>
          <div><span>Failed payments</span><strong className={count(data.paymentStatus, 'failed') ? 'danger-text' : ''}>{count(data.paymentStatus, 'failed')}</strong><small>need attention</small></div>
          <div><span>Referral conversion</span><strong>{referralConversion}%</strong><small>rewarded referrals</small></div>
        </div>
      </aside>
    </div>
  </div>;
};
export default OverviewPage;
