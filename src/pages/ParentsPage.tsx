import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getParents } from '../api/parent';

const ParentsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'parents'], queryFn: getParents });

  return (
    <div>
      <h1 className="page-title">Parents</h1>
      <p className="page-subtitle">Every parent account.</p>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParentsPage;
