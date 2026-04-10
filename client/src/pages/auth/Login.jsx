import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { asyncloginuser } from '../../store/actions/authActions';

const InputField = ({ label, id, type = 'text', placeholder, registration, error, children }) => (
  <div className='space-y-1.5'>
    <label htmlFor={id} className='block text-xs font-bold text-slate-600 uppercase tracking-widest'>
      {label}
    </label>
    <div className='relative'>
      {children}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border-2 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all duration-200 font-home ${
          error
            ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
        }`}
      />
    </div>
    {error && <p className='text-xs font-semibold text-red-500 mt-1'>{error.message}</p>}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const isLoading = status === 'loading';
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    const success = await dispatch(asyncloginuser(data));
    if (success) navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-slate-50 font-home flex'>

      {/* ── Left panel — decorative ── */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col items-center justify-center p-16'>
        {/* Dot grid */}
        <div className='absolute inset-0 dot-grid opacity-20' />
        {/* Orbs */}
        <div className='absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl orb-float pointer-events-none' />
        <div className='absolute bottom-1/3 right-1/4 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl orb-float-delayed pointer-events-none' />

        <div className='relative z-10 max-w-sm text-center'>
          {/* Logo */}
          <div className='inline-flex items-center gap-3 mb-12'>
            <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-900/50'>
              <Brain className='w-5 h-5 text-white' strokeWidth={2} />
            </div>
            <span className='text-base font-black text-white tracking-tight'>BrainWave AI</span>
          </div>

          {/* Feature list */}
          <div className='space-y-4 text-left'>
            {[
              { title: 'Chat with your PDFs', desc: 'Ask anything, get grounded answers' },
              { title: 'Auto flashcard decks', desc: 'Generated straight from your documents' },
              { title: 'Smart summaries', desc: 'Core concepts extracted instantly' },
              { title: 'Scored quizzes', desc: 'Test and reinforce your knowledge' },
            ].map(f => (
              <div key={f.title} className='flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10'>
                <span className='mt-0.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0' />
                <div>
                  <p className='text-sm font-bold text-white'>{f.title}</p>
                  <p className='text-xs text-slate-400 font-medium mt-0.5'>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>

        {/* Mobile logo */}
        <div className='flex lg:hidden items-center gap-2.5 mb-10'>
          <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200'>
            <Brain className='w-4 h-4 text-white' strokeWidth={2} />
          </div>
          <span className='text-sm font-black text-slate-800 tracking-tight'>BrainWave AI</span>
        </div>

        <div className='w-full max-w-sm fade-up'>
          {/* Heading */}
          <div className='mb-8'>
            <h1 className='text-3xl font-black text-slate-900 tracking-[-0.03em] mb-1.5'>Welcome back</h1>
            <p className='text-sm text-slate-500 font-medium'>Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email */}
            <InputField
              label='Email'
              id='email'
              type='email'
              placeholder='you@example.com'
              error={errors.email}
              registration={register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            >
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
            </InputField>

            {/* Password */}
            <InputField
              label='Password'
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              error={errors.password}
              registration={register('password', {
                required: 'Password is required',
              })}
            >
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
              <button
                type='button'
                onClick={() => setShowPassword(p => !p)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
              >
                {showPassword
                  ? <EyeOff className='w-4 h-4' strokeWidth={2} />
                  : <Eye className='w-4 h-4' strokeWidth={2} />
                }
              </button>
            </InputField>

            {/* Forgot */}
            <div className='flex justify-end -mt-1'>
              <Link
                to='/forgot-password'
                className='text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-200 shimmer-btn mt-2'
            >
              {isLoading
                ? <><Loader2 className='w-4 h-4 animate-spin' /> Signing in...</>
                : <><ArrowRight className='w-4 h-4' strokeWidth={2.5} /> Sign in</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-slate-200' />
            <span className='text-xs font-semibold text-slate-400 uppercase tracking-widest'>or</span>
            <div className='flex-1 h-px bg-slate-200' />
          </div>

          {/* Google OAuth */}
          <button
            type='button'
            onClick={() => navigate('/auth/google')}
            className='w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98]'
          >
            <svg className='w-4 h-4 shrink-0' viewBox='0 0 24 24'>
              <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
              <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
              <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05' />
              <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className='text-center text-sm text-slate-500 font-medium mt-8'>
            Don't have an account?{' '}
            <Link to='/register' className='font-bold text-emerald-600 hover:text-emerald-700 transition-colors'>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;