import { Upload, Cpu, Zap } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload your PDF',
    description: 'Drop any document — research papers, textbooks, reports. We handle parsing, chunking, and embedding into a vector store automatically.',
    accent: 'emerald',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'The RAG pipeline runs',
    description: 'LangChain orchestrates end-to-end: ingestion → semantic chunking → vector embedding → similarity search → Gemini prompt construction.',
    accent: 'teal',
  },
  {
    icon: Zap,
    number: '03',
    title: 'Learn, retain, and quiz',
    description: 'Chat with the doc, generate flashcards, get structured summaries, take quizzes — every answer grounded in your actual content.',
    accent: 'emerald',
  },
];

const accentMap = {
  emerald: {
    icon: 'bg-emerald-500 shadow-emerald-200',
    num: 'text-emerald-500',
    line: 'from-emerald-300 via-teal-200 to-transparent',
    border: 'border-emerald-100 hover:border-emerald-300',
    glow: 'hover:shadow-emerald-100',
  },
  teal: {
    icon: 'bg-teal-500 shadow-teal-200',
    num: 'text-teal-500',
    line: 'from-teal-300 via-emerald-200 to-transparent',
    border: 'border-teal-100 hover:border-teal-300',
    glow: 'hover:shadow-teal-100',
  },
};

const StepCard = ({ icon: Icon, number, title, description, accent, index }) => {
  const s = accentMap[accent];
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const tiltClass = index % 2 === 0 ? '-rotate-[0.8deg] hover:rotate-0' : 'rotate-[0.8deg] hover:rotate-0';

  return (
    <div
      ref={ref}
      className={`${tiltClass} transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className={`group relative bg-white border-2 ${s.border} ${s.glow} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl overflow-hidden`}>

        {/* Faded step number watermark */}
        <span className={`absolute -bottom-2 -right-1 text-8xl font-black select-none leading-none ${s.num} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300`}>
          {number}
        </span>

        <div className='relative flex items-start gap-4'>
          {/* Icon bubble */}
          <div className={`shrink-0 w-10 h-10 rounded-xl ${s.icon} shadow-lg flex items-center justify-center`}>
            <Icon className='w-4.5 h-4.5 text-white' strokeWidth={2.5} />
          </div>

          <div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${s.num} mb-1 block`}>Step {number}</span>
            <h3 className='text-base font-black text-slate-900 tracking-tight mb-1.5'>{title}</h3>
            <p className='text-sm text-slate-500 leading-relaxed'>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepsSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className='py-28 px-6 bg-white border-t border-slate-100' id='how-it-works'>
      <div className='max-w-5xl mx-auto'>
        <div className='grid md:grid-cols-2 gap-16 items-center'>

          {/* Left — copy */}
          <div
            ref={ref}
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <span className='inline-block px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-widest mb-5 shadow-sm'>
              Under the hood
            </span>
            <h2 className='text-4xl sm:text-5xl font-black text-slate-900 tracking-[-0.03em] leading-tight mb-5'>
              A real RAG pipeline —{' '}
              <span className='hero-gradient-text'>not a chatbot wrapper</span>
            </h2>
            <p className='text-slate-500 text-base leading-relaxed font-medium mb-4'>
              Most "AI document tools" just paste your text into a prompt. BrainWave AI runs a proper retrieval-augmented generation pipeline — your document is chunked, embedded, and vector-searched before Gemini ever sees a token.
            </p>
            <p className='text-slate-500 text-base leading-relaxed font-medium'>
              The result: answers grounded in evidence, not hallucination.
            </p>

            {/* Tech chips */}
            <div className='flex flex-wrap gap-2 mt-6'>
              {['LangChain', 'Gemini', 'Vector DB', 'MERN', 'Google OAuth'].map(t => (
                <span key={t} className='px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg'>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — step cards */}
          <div className='flex flex-col gap-4'>
            {steps.map((s, i) => <StepCard key={s.number} {...s} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;