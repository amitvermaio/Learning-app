import { Mail, User, Lock } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className='flex items-center gap-4 py-3.5 border-b border-slate-100 last:border-0'>
    <div className='w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0'>
      <Icon className='w-4 h-4 text-emerald-600' strokeWidth={2} />
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5'>{label}</p>
      <p className='text-sm font-semibold text-slate-800 truncate'>{value || '—'}</p>
    </div>
  </div>
);

const ProfileInfo = ({ user }) => {
  return (
    <div className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6'>
      <h3 className='text-base font-bold text-slate-900 mb-2'>Account information</h3>
      <p className='text-xs text-slate-400 mb-4'>Your profile details as stored on our servers.</p>
      <div>
        <InfoRow icon={User} label='Full name' value={user?.name} />
        <InfoRow icon={Mail} label='Email address' value={user?.email} />
        <InfoRow
          icon={Lock}
          label='Sign-in method'
          value={user?.provider === 'local' ? 'Email & password' : `${user?.provider} OAuth`}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;