import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { approveReferral, getAllReferrals, getReferralConfig, updateReferralConfig } from '../api/referral';
import type { ReferralConfig } from '../api/referral';
import StatusPill from '../components/StatusPill';

const displayRef = (ref: string | { _id: string; firstName?: string; lastName?: string }) =>
  typeof ref === 'string' ? ref : `${ref.firstName ?? ''} ${ref.lastName ?? ''}`.trim() || ref._id;

const ReferralsPage: React.FC = () => {
  const qc=useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'referrals'], queryFn: getAllReferrals });
  const configQuery=useQuery({queryKey:['admin','referral-config'],queryFn:getReferralConfig});
  const [config,setConfig]=useState<ReferralConfig>({rewardType:'credit',rewardValue:2000,requiresApproval:false,refereeRewardValue:0,isActive:true});
  useEffect(()=>{if(configQuery.data?.config)setConfig(configQuery.data.config)},[configQuery.data]);
  const save=useMutation({mutationFn:()=>updateReferralConfig(config),onSuccess:()=>qc.invalidateQueries({queryKey:['admin','referral-config']})});
  const approve=useMutation({mutationFn:approveReferral,onSuccess:()=>qc.invalidateQueries({queryKey:['admin','referrals']})});

  const referrals = [...(data?.referrals ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h1 className="page-title">Referrals</h1>
      <p className="page-subtitle">Every referral across all families.</p>
      <div className="card" style={{marginBottom:24}}><h2 style={{marginTop:0,fontSize:16}}>Programme settings</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}><div><label className="label">Reward type</label><select className="input" value={config.rewardType} onChange={e=>setConfig({...config,rewardType:e.target.value as ReferralConfig['rewardType']})}><option value="credit">Account credit</option><option value="free_lesson">Free lesson</option><option value="discount_percent">Percentage discount</option></select></div><div><label className="label">Reward value</label><input className="input" type="number" value={config.rewardValue} onChange={e=>setConfig({...config,rewardValue:Number(e.target.value)})}/></div><div><label className="label">New-family incentive</label><input className="input" type="number" value={config.refereeRewardValue} onChange={e=>setConfig({...config,refereeRewardValue:Number(e.target.value)})}/></div></div><label style={{display:'block',margin:'12px 0'}}><input type="checkbox" checked={config.requiresApproval} onChange={e=>setConfig({...config,requiresApproval:e.target.checked})}/> Require admin approval</label><label style={{display:'block',marginBottom:12}}><input type="checkbox" checked={config.isActive} onChange={e=>setConfig({...config,isActive:e.target.checked})}/> Programme active</label><button className="button" onClick={()=>save.mutate()} disabled={save.isPending}>{save.isPending?'Saving…':'Save settings'}</button></div>

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
                <th>Action</th>
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
                  <td>{referral.status==='enrolled'?<button className="button" onClick={()=>approve.mutate(referral._id)} disabled={approve.isPending}>Approve</button>:'—'}</td>
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
