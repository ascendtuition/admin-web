import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAllPayments } from '../api/payment';
import StatusPill from '../components/StatusPill';

const displayRef = (ref: string | { _id: string; firstName?: string; lastName?: string }) =>
  typeof ref === 'string' ? ref : `${ref.firstName ?? ''} ${ref.lastName ?? ''}`.trim() || ref._id;

const formatAmount = (amountMinor: number, currency: string) =>
  `${currency === 'GBP' ? '£' : currency + ' '}${(amountMinor / 100).toFixed(2)}`;

const PaymentsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'payments'], queryFn: getAllPayments });

  const payments = [...(data?.payments ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="page-title">Payments</h1>
      <p className="page-subtitle">Every payment recorded across all families.</p>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{displayRef(payment.parent)}</td>
                  <td>{formatAmount(payment.amountMinor, payment.currency)}</td>
                  <td>
                    <StatusPill label={payment.status} />
                  </td>
                  <td>{format(new Date(payment.createdAt), 'd MMM yyyy, HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
