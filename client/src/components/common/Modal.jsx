import React, { useState } from 'react'
import { X, Copy, Check } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, contentToCopy }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (contentToCopy) {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 py-8'>
        <div
          className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity'
          onClick={onClose}
        />

        <div className='relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300'>

          {/* Close Button */}
          <button
            onClick={onClose}
            className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200'
          >
            <X className='w-5 h-5' strokeWidth={2} />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`absolute top-6 right-16 flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all duration-200
              ${copied
                ? 'bg-green-100 text-green-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
          >
            {copied ? (
              <>
                <Check className='w-4 h-4' />
                Copied
              </>
            ) : (
              <>
                <Copy className='w-4 h-4' />
                Copy
              </>
            )}
          </button>

          <div className='mb-6 pr-20'>
            <h3 className='text-xl font-medium text-slate-900 tracking-tight'>
              {title}
            </h3>
          </div>

          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal