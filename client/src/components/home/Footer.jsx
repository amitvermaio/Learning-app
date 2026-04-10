import { Brain } from 'lucide-react';

const Footer = () => (
  <footer className='bg-white border-t border-slate-100 py-8 px-6'>
    <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3'>
      <div className='flex items-center gap-2.5'>
        <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center'>
          <Brain className='w-3.5 h-3.5 text-white' strokeWidth={2} />
        </div>
        <span className='text-sm font-black text-slate-800 tracking-tight'>BrainWave AI</span>
      </div>

      <p className='text-xs text-slate-400 font-medium'>
        © {new Date().getFullYear()} BrainWave AI · Powered By GOOGLE GEMINI
      </p>
    </div>
  </footer>
);

export default Footer;