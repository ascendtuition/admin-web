import React from 'react';

type Tone = 'success' | 'warning' | 'error' | 'neutral' | 'info';

const STATUS_TONE: Record<string, Tone> = {
  completed: 'success',
  succeeded: 'success',
  active: 'success',
  graded: 'success',
  submitted: 'info',
  scheduled: 'info',
  assigned: 'warning',
  pending: 'warning',
  cancelled: 'error',
  failed: 'error',
  no_show: 'error',
  expired: 'neutral',
  refunded: 'neutral',
  invited: 'neutral',
  signedup: 'info',
  enrolled: 'warning',
  rewarded: 'success',
};

const StatusPill: React.FC<{ label: string; tone?: Tone }> = ({ label, tone }) => {
  const resolvedTone = tone ?? STATUS_TONE[label] ?? 'neutral';
  return <span className={`pill ${resolvedTone}`}>{label.replace('_', ' ')}</span>;
};

export default StatusPill;
