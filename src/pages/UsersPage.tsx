import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getUsers, updateUser } from '../api/user';
import StatusPill from '../components/StatusPill';
import type { UserRole } from '../types';

const ROLE_FILTERS: { label: string; value: UserRole | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Students', value: 'student' },
  { label: 'Parents', value: 'parent' },
  { label: 'Tutors', value: 'tutor' },
  { label: 'Admins', value: 'admin' },
];

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: getUsers });

  const toggleActiveMutation = useMutation({
    mutationFn: (params: { userId: string; isActive: boolean }) =>
      updateUser(params.userId, { isActive: params.isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  const users = (data?.users ?? []).filter((u) => !roleFilter || u.role === roleFilter);

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">Every account across the platform.</p>

      <div className="tab-row">
        {ROLE_FILTERS.map((filter) => (
          <button
            key={filter.label}
            className={`button small ${roleFilter === filter.value ? '' : 'secondary'}`}
            onClick={() => setRoleFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="page-subtitle">Loading…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                  <td>
                    <StatusPill
                      label={user.isActive ? 'active' : 'inactive'}
                      tone={user.isActive ? 'success' : 'error'}
                    />
                  </td>
                  <td>{format(new Date(user.createdAt), 'd MMM yyyy')}</td>
                  <td>{user.lastLoginAt ? format(new Date(user.lastLoginAt), 'd MMM yyyy, HH:mm') : '—'}</td>
                  <td>
                    <button
                      className="button secondary small"
                      onClick={() =>
                        toggleActiveMutation.mutate({ userId: user._id, isActive: !user.isActive })
                      }
                      disabled={toggleActiveMutation.isPending}
                    >
                      {user.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
