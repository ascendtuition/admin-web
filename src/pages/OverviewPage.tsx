import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/user';
import { getAllEnrollments } from '../api/enrollment';
import { getAllPayments } from '../api/payment';
import { getAllReferrals } from '../api/referral';

const formatAmount = (amountMinor: number, currency: string) =>
  `${currency === 'GBP' ? '£' : currency + ' '}${(amountMinor / 100).toFixed(2)}`;

const OverviewPage: React.FC = () => {
  const usersQuery = useQuery({ queryKey: ['admin', 'users'], queryFn: getUsers });
  const enrollmentsQuery = useQuery({ queryKey: ['admin', 'enrollments'], queryFn: getAllEnrollments });
  const paymentsQuery = useQuery({ queryKey: ['admin', 'payments'], queryFn: getAllPayments });
  const referralsQuery = useQuery({ queryKey: ['admin', 'referrals'], queryFn: getAllReferrals });

  const users = usersQuery.data?.users ?? [];
  const enrollments = enrollmentsQuery.data?.enrollments ?? [];
  const payments = paymentsQuery.data?.payments ?? [];
  const referrals = referralsQuery.data?.referrals ?? [];

  const activeEnrollments = enrollments.filter((e) => e.status === 'active');
  const succeededPayments = payments.filter((p) => p.status === 'succeeded');
  const revenueThisMonth = succeededPayments
    .filter((p) => {
      const d = new Date(p.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.amountMinor, 0);
  const rewardedReferrals = referrals.filter((r) => r.status === 'rewarded');

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="page-title">Overview</h1>
      <p className="page-subtitle">A snapshot of Ascend Tuition right now.</p>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total accounts</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{activeEnrollments.length}</div>
          <div className="stat-label">Active enrollments</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{formatAmount(revenueThisMonth, 'GBP')}</div>
          <div className="stat-label">Revenue this month</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-value">{roleCounts.student ?? 0}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{roleCounts.parent ?? 0}</div>
          <div className="stat-label">Parents</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{roleCounts.tutor ?? 0}</div>
          <div className="stat-label">Tutors</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Referrals</h2>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          {referrals.length} total referrals · {rewardedReferrals.length} rewarded ·{' '}
          {formatAmount(
            rewardedReferrals.reduce((sum, r) => sum + (r.rewardValue ?? 0), 0),
            'GBP'
          )}{' '}
          credited to parents
        </p>
      </div>
    </div>
  );
};

export default OverviewPage;
