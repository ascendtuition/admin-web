import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAllReferrals } from '../api/referral';
import StatusPill from '../components/StatusPill';

const displayRef = (ref: string | { _id: string; firstName?: string; lastName?: string }) =>
  typeof ref === 'string' ? ref : `${ref.firstName ?? ''} ${ref.lastName ?? ''}`.trim() || ref._id;

const ReferralsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'referrals'], queryFn: getAllReferrals });

  const referrals = [...(data?.referrals ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="page-title">Referrals</h1>
      <p className="page-subtitle">Every referral across all families.</p>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Referrer</th>
                <th>Code</th>
                <th>Referee</th>
                <th>Status</th>
                <th>Reward</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral._id}>
                  <td>{displayRef(referral.referrer)}</td>
                  <td>{referral.code}</td>
                  <td>{referral.refereeEmail ?? '—'}</td>
                  <td>
                    <StatusPill label={referral.status} />
                  </td>
                  <td>
                    {referral.rewardValue ? `£${(referral.rewardValue / 100).toFixed(2)} ${referral.rewardType}` : '—'}
                  </td>
                  <td>{format(new Date(referral.createdAt), 'd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
