import { User, Shield } from 'lucide-react';

const providerColors = {
  local: 'bg-slate-100 text-slate-600 border-slate-200',
  google: 'bg-blue-50 text-blue-700 border-blue-200',
  github: 'bg-slate-800 text-white border-slate-700',
};

const ProfileHeader = ({ user }) => {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const provider = user?.provider || 'local';

  return (
    <div className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6'>
      <div className='flex flex-col sm:flex-row items-center sm:items-start gap-5'>
        {/* Avatar */}
        <div className='relative shrink-0'>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='w-20 h-20 rounded-2xl object-cover border-2 border-slate-200'
            />
          ) : (
            <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center border-2 border-emerald-200'>
              <span className='text-2xl font-bold text-emerald-700'>{initials}</span>
            </div>
          )}
          <div className='absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-white'>
            <Shield className='w-3.5 h-3.5 text-white' strokeWidth={2.5} />
          </div>
        </div>

        {/* Name + meta */}
        <div className='flex-1 text-center sm:text-left'>
          <h2 className='text-xl font-bold text-slate-900'>{user?.name || 'Unknown User'}</h2>
          <p className='text-sm text-slate-500 mt-0.5'>{user?.email}</p>
          <div className='mt-3 flex items-center justify-center sm:justify-start gap-2'>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border ${providerColors[provider]}`}>
              <User className='w-3 h-3' strokeWidth={2.5} />
              {provider === 'local' ? 'Email & Password' : `${provider.charAt(0).toUpperCase() + provider.slice(1)} account`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;