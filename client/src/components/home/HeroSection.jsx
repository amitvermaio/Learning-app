import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <section className='relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden hero-bg pt-16'>
      {/* Dot grid */}
      <div className='absolute inset-0 dot-grid opacity-40' />

      {/* Emerald orbs */}
      <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none orb-float' />
      <div className='absolute bottom-1/3 right-1/4 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl pointer-events-none orb-float-delayed' />

      <div className='relative z-10 max-w-3xl mx-auto text-center'>

        {/* Eyebrow */}
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 backdrop-blur-sm mb-8 fade-up'>
          <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot' />
          <span className='text-xs font-semibold text-emerald-700 tracking-widest uppercase'>AI Document Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className='hero-heading text-5xl sm:text-6xl md:text-[4.5rem] font-black text-slate-900 leading-[1.04] tracking-[-0.03em] mb-6 fade-up' style={{ animationDelay: '80ms' }}>
          Learn from any
          <br />
          document —{' '}
          <span className='hero-gradient-text'>intelligently</span>
        </h1>

        {/* Sub */}
        <p className='text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-medium mb-10 fade-up' style={{ animationDelay: '160ms' }}>
          Upload a PDF. Chat with it, generate flashcards, take quizzes, get structured summaries — all grounded by a full RAG pipeline with Gemini at its core.
        </p>

        {/* CTA */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 fade-up' style={{ animationDelay: '240ms' }}>
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className='group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-200 shimmer-btn'
          >
            <Sparkles className='w-4 h-4' strokeWidth={2.5} />
            {isAuthenticated ? 'Go to dashboard' : 'Start for free'}
            <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150' strokeWidth={2.5} />
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className='w-full sm:w-auto px-7 py-3.5 border-2 border-slate-200 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50/60 text-slate-700 text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 backdrop-blur-sm'
            >
              Sign in
            </button>
          )}
        </div>

        {/* Proof bar */}
        <div className='flex items-center justify-center gap-6 sm:gap-10 fade-up' style={{ animationDelay: '320ms' }}>
          {[
            { value: '4', label: 'AI modules' },
            { value: 'RAG', label: 'Powered' },
            { value: 'Gemini', label: 'LLM core' },
          ].map((s, i) => (
            <div key={i} className='flex flex-col items-center'>
              <span className='text-xl font-black text-slate-800 tracking-tight'>{s.value}</span>
              <span className='text-[11px] font-semibold text-slate-400 uppercase tracking-widest'>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none' />
    </section>
  );
};

export default HeroSection;