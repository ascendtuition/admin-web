import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getUsers, updateUser, updateUserAccess } from '../api/user';
import StatusPill from '../components/StatusPill';
import type { UserRole } from '../types';
import type { AdminUser } from '../types';
import { useAuth } from '../contexts/AuthContext';

const PERMISSIONS=['manage_users','manage_content','manage_scheduling','manage_billing','manage_referrals','manage_notifications','view_analytics','manage_operations'];

const ROLE_FILTERS: { label: string; value: UserRole | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Students', value: 'student' },
  { label: 'Parents', value: 'parent' },
  { label: 'Tutors', value: 'tutor' },
  { label: 'Admins', value: 'admin' },
  { label: 'Owners', value: 'owner' },
];

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const {user:currentUser}=useAuth();
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const[accessUser,setAccessUser]=useState<AdminUser>();const[permissions,setPermissions]=useState<string[]>([]);const[accessRole,setAccessRole]=useState<'admin'|'owner'>('admin');

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: getUsers });

  const toggleActiveMutation = useMutation({
    mutationFn: (params: { userId: string; isActive: boolean }) =>
      updateUser(params.userId, { isActive: params.isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
  const accessMutation=useMutation({mutationFn:()=>updateUserAccess(accessUser!._id,accessRole,permissions),onSuccess:()=>{queryClient.invalidateQueries({queryKey:['admin','users']});setAccessUser(undefined)}});

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
                    {currentUser?.role==='owner'&&['admin','owner'].includes(user.role)?<button className="button secondary small" onClick={()=>{setAccessUser(user);setAccessRole(user.role as 'admin'|'owner');setPermissions(user.permissions??[])}}>Access</button>:null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {accessUser?<div className="modal-backdrop" onClick={()=>setAccessUser(undefined)}><div className="modal-card" onClick={e=>e.stopPropagation()}><h2 style={{marginTop:0}}>Access · {accessUser.email}</h2><label className="label">Role</label><select className="input" value={accessRole} onChange={e=>setAccessRole(e.target.value as 'admin'|'owner')}><option value="admin">Admin</option><option value="owner">Owner</option></select><label className="label">Permissions</label>{PERMISSIONS.map(permission=><label key={permission} style={{display:'block',margin:'8px 0'}}><input type="checkbox" disabled={accessRole==='owner'} checked={accessRole==='owner'||permissions.includes(permission)} onChange={e=>setPermissions(prev=>e.target.checked?[...prev,permission]:prev.filter(x=>x!==permission))}/> {permission.replaceAll('_',' ')}</label>)}<div style={{display:'flex',gap:8,marginTop:16}}><button className="button" onClick={()=>accessMutation.mutate()}>Save access</button><button className="button secondary" onClick={()=>setAccessUser(undefined)}>Cancel</button></div></div></div>:null}
    </div>
  );
};

export default UsersPage;
