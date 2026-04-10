import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { asyncchangepassword } from '../../store/actions/authActions';

const PasswordInput = ({ label, id, placeholder, registration, error, show, onToggle }) => (
  <div className='space-y-1.5'>
    <label htmlFor={id} className='block text-xs font-semibold text-slate-600 uppercase tracking-wide'>
      {label}
    </label>
    <div className='relative'>
      <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        {...registration}
        className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-200'
        }`}
      />
      <button
        type='button'
        onClick={onToggle}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
      >
        {show
          ? <EyeOff className='w-4 h-4' strokeWidth={2} />
          : <Eye className='w-4 h-4' strokeWidth={2} />
        }
      </button>
    </div>
    {error && (
      <p className='text-xs font-medium text-red-600 mt-1'>{error.message}</p>
    )}
  </div>
);

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const isLoading = status === 'loading';

  const [show, setShow] = useState({ current: false, newp: false, confirm: false });
  const toggleShow = (field) => () => setShow(s => ({ ...s, [field]: !s[field] }));

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    const success = await dispatch(asyncchangepassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }));
    if (success) reset();
  };

  const newPasswordValue = watch('newPassword');

  return (
    <div className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6'>
      <div className='flex items-center gap-3 mb-1'>
        <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center shrink-0'>
          <ShieldCheck className='w-4 h-4 text-emerald-700' strokeWidth={2} />
        </div>
        <div>
          <h3 className='text-base font-bold text-slate-900'>Change password</h3>
          <p className='text-xs text-slate-400'>Choose a strong password you haven't used before.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='mt-5 space-y-4'>
        <PasswordInput
          label='Current password'
          id='currentPassword'
          placeholder='Enter current password'
          show={show.current}
          onToggle={toggleShow('current')}
          error={errors.currentPassword}
          registration={register('currentPassword', {
            required: 'Current password is required',
          })}
        />

        <PasswordInput
          label='New password'
          id='newPassword'
          placeholder='Enter new password'
          show={show.newp}
          onToggle={toggleShow('newp')}
          error={errors.newPassword}
          registration={register('newPassword', {
            required: 'New password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
            validate: (value) =>
              value !== watch('currentPassword') || 'New password must differ from current password',
          })}
        />

        <PasswordInput
          label='Confirm new password'
          id='confirmPassword'
          placeholder='Re-enter new password'
          show={show.confirm}
          onToggle={toggleShow('confirm')}
          error={errors.confirmPassword}
          registration={register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (value) =>
              value === newPasswordValue || 'Passwords do not match',
          })}
        />

        <button
          type='submit'
          disabled={isLoading || isSubmitting}
          className='w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2'
        >
          {(isLoading || isSubmitting)
            ? <><Loader2 className='w-4 h-4 animate-spin' /> Updating...</>
            : 'Update password'
          }
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;