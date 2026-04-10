import { MessageSquare, FileText, BookOpen, Trophy } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const features = [
  {
    icon: MessageSquare,
    tag: 'Chat',
    title: 'Talk to your PDF',
    description: 'Ask any question. The RAG pipeline retrieves the exact passages that matter, feeding Gemini grounded context so every answer is traceable to your document.',
    tilt: '-rotate-[1.4deg]',
    hoverTilt: 'hover:rotate-0',
    accent: 'emerald',
    delay: 0,
  },
  {
    icon: FileText,
    tag: 'Summarise',
    title: 'Instant summaries',
    description: 'Distil any document into structured summaries and core concepts. Get the intellectual core of a 200-page paper in moments — not hours.',
    tilt: 'rotate-[1.2deg]',
    hoverTilt: 'hover:rotate-0',
    accent: 'teal',
    delay: 80,
  },
  {
    icon: BookOpen,
    tag: 'Flashcards',
    title: 'Auto-generate cards',
    description: 'Turn any document into a revision-ready flashcard deck. Track progress, star tricky cards, and study with a clean interface built for retention.',
    tilt: '-rotate-[1deg]',
    hoverTilt: 'hover:rotate-0',
    accent: 'emerald',
    delay: 160,
  },
  {
    icon: Trophy,
    tag: 'Quiz',
    title: 'Test yourself',
    description: 'AI-generated quizzes tied directly to your document. Get scored, see explanations, and reinforce learning — all without leaving the platform.',
    tilt: 'rotate-[1.4deg]',
    hoverTilt: 'hover:rotate-0',
    accent: 'teal',
    delay: 240,
  },
];

const accentStyles = {
  emerald: {
    icon: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    iconHover: 'group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white',
    tag: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    border: 'hover:border-emerald-300',
    glow: 'group-hover:shadow-emerald-100',
    num: 'text-emerald-50 group-hover:text-emerald-100/60',
  },
  teal: {
    icon: 'bg-teal-50 border-teal-100 text-teal-600',
    iconHover: 'group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-white',
    tag: 'text-teal-600 bg-teal-50 border-teal-100',
    border: 'hover:border-teal-300',
    glow: 'group-hover:shadow-teal-100',
    num: 'text-teal-50 group-hover:text-teal-100/60',
  },
};

const FeatureCard = ({ icon: Icon, tag, title, description, tilt, hoverTilt, accent, delay }) => {
  const s = accentStyles[accent];
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${tilt} ${hoverTilt} transition-all duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`group relative bg-white border-2 border-slate-100 ${s.border} rounded-2xl p-6 cursor-default transition-all duration-300 shadow-sm ${s.glow} hover:shadow-xl overflow-hidden`}>

        {/* Corner number */}
        <span className={`absolute -top-3 -right-1 text-8xl font-black select-none leading-none transition-colors duration-300 ${s.num}`}>
          {String(features.indexOf(features.find(f => f.title === title)) + 1).padStart(2, '0')}
        </span>

        {/* Tag */}
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border ${s.tag} mb-4`}>
          {tag}
        </span>

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-all duration-300 ${s.icon} ${s.iconHover}`}>
          <Icon className='w-4.5 h-4.5 transition-colors duration-300' strokeWidth={2} />
        </div>

        <h3 className='text-base font-black text-slate-900 mb-2 tracking-tight'>{title}</h3>
        <p className='text-sm text-slate-500 leading-relaxed'>{description}</p>
      </div>
    </div>
  );
};

const FeaturesSection = () => (
  <section className='py-28 px-6 bg-slate-50' id='features'>
    <div className='max-w-5xl mx-auto'>

      {/* Label */}
      <div className='flex flex-col items-center text-center mb-16'>
        <span className='inline-block px-3.5 py-1.5 bg-white border border-slate-200 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-widest mb-5 shadow-sm'>
          4 core modules
        </span>
        <h2 className='text-4xl sm:text-5xl font-black text-slate-900 tracking-[-0.03em] leading-tight max-w-lg'>
          Every tool you need{' '}
          <span className='hero-gradient-text'>in one place</span>
        </h2>
        <p className='text-slate-500 mt-4 max-w-md text-base font-medium leading-relaxed'>
          Four precision-built AI features, each backed by the same vector retrieval pipeline so every result is grounded in your actual content.
        </p>
      </div>

      {/* Cards grid — 2 cols, narrower */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto'>
        {features.map(f => <FeatureCard key={f.title} {...f} />)}
      </div>
    </div>
  </section>
);

export default FeaturesSection;