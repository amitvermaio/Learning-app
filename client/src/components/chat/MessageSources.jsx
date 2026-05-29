import { ExternalLink, Link as LinkIcon } from 'lucide-react';

const getSourceHost = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const MessageSources = ({ sources, isExpanded }) => {
  if (!Array.isArray(sources) || sources.length === 0 || !isExpanded) return null;

  return (
    <div
      className='mt-3 w-full overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 transition-all duration-200 max-h-[600px] opacity-100'
    >
        <div className='flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700'>
          <span className='inline-flex h-2 w-2 rounded-full bg-emerald-400'></span>
          Trusted Sources
        </div>
        <div className='mt-2 grid gap-2'>
          {sources.map((source, sourceIndex) => {
            const title = source?.title || source?.url || 'Source';
            const url = source?.url || '#';
            return (
              <a
                key={`source-${sourceIndex}`}
                href={url}
                target='_blank'
                rel='noreferrer'
                className='group flex items-start justify-between gap-3 rounded-xl border border-emerald-100/80 bg-white/80 p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md'
              >
                <div className='flex items-start gap-3'>
                  <span className='mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'>
                    <LinkIcon className='h-4 w-4' />
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-slate-900 leading-snug break-words'>{title}</p>
                    <p className='mt-1 text-xs text-slate-500 break-all'>{getSourceHost(url)}</p>
                  </div>
                </div>
                <ExternalLink className='h-4 w-4 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100' />
              </a>
            );
          })}
        </div>
    </div>
  );
};

export default MessageSources;
