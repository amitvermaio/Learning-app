import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Brain, LayoutDashboard } from 'lucide-react';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm shadow-slate-100/80'
        : 'bg-transparent'
    }`}>
      <div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>

        {/* Brand */}
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2.5 group'
        >
          <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200 group-hover:shadow-emerald-300 transition-shadow duration-200'>
            <Brain className='w-4 h-4 text-white' strokeWidth={2} />
          </div>
          <span className='text-sm font-black text-slate-800 tracking-tight'>BrainWave AI</span>
        </button>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-emerald-200'
            >
              <LayoutDashboard className='w-3.5 h-3.5' strokeWidth={2.5} />
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className='px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors duration-150'
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className='px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-95'
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;