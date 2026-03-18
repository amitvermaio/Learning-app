import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  FileText,
  Flame,
  Layers3,
  RefreshCw,
  TrendingUp,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import { asyncgetdashboard } from '../../store/actions/progressActions';

const statConfig = [
  {
    key: 'totalDocuments',
    label: 'Documents',
    icon: BookOpen,
    tone: 'text-sky-200 border-sky-300/30 bg-sky-500/10',
  },
  {
    key: 'totalFlashcardSets',
    label: 'Flashcard Sets',
    icon: Layers3,
    tone: 'text-indigo-200 border-indigo-300/30 bg-indigo-500/10',
  },
  {
    key: 'totalQuizzes',
    label: 'Quizzes',
    icon: ClipboardCheck,
    tone: 'text-teal-200 border-teal-300/30 bg-teal-500/10',
  },
  {
    key: 'completedQuizzes',
    label: 'Completed',
    icon: CheckCircle2,
    tone: 'text-emerald-200 border-emerald-300/30 bg-emerald-500/10',
  },
  {
    key: 'totalFlashcards',
    label: 'Flashcards',
    icon: Database,
    tone: 'text-cyan-200 border-cyan-300/30 bg-cyan-500/10',
  },
  {
    key: 'starredFlashcards',
    label: 'Starred',
    icon: Star,
    tone: 'text-violet-200 border-violet-300/30 bg-violet-500/10',
  },
];

const formatDate = (value) => {
  if (!value) return 'Not available';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return 'Not available';

  return parsedDate.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const clampPercent = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
};

const toTitleCase = (value) => {
  if (!value) return 'Pending';
  return value
    .toString()
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, status, error } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(asyncgetdashboard());
  }, [dispatch]);

  const overview = dashboard?.overview || {};
  const recentDocuments = dashboard?.recentActivity?.recentDocuments || [];
  const recentQuizzes = dashboard?.recentActivity?.recentQuizzes || [];

  const totalQuizzes = overview.totalQuizzes || 0;
  const completedQuizzes = overview.completedQuizzes || 0;
  const totalFlashcards = overview.totalFlashcards || 0;
  const reviewedFlashcards = overview.reviewedFlashcards || 0;
  const starredFlashcards = overview.starredFlashcards || 0;

  const quizCompletionRate = clampPercent(totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0);
  const flashcardReviewRate = clampPercent(totalFlashcards > 0 ? (reviewedFlashcards / totalFlashcards) * 100 : 0);
  const starredRate = clampPercent(totalFlashcards > 0 ? (starredFlashcards / totalFlashcards) * 100 : 0);

  const insightCards = [
    {
      label: 'Average Score',
      value: `${overview.averageScore || 0}%`,
      icon: Trophy,
      tone: 'text-sky-200 border-sky-300/30 bg-sky-500/10',
    },
    {
      label: 'Study Streak',
      value: `${overview.studyStreak || 0} days`,
      icon: Flame,
      tone: 'text-indigo-200 border-indigo-300/30 bg-indigo-500/10',
    },
    {
      label: 'Quiz Completion',
      value: `${quizCompletionRate}%`,
      icon: Target,
      tone: 'text-emerald-200 border-emerald-300/30 bg-emerald-500/10',
    },
    {
      label: 'Review Coverage',
      value: `${flashcardReviewRate}%`,
      icon: TrendingUp,
      tone: 'text-teal-200 border-teal-300/30 bg-teal-500/10',
    },
  ];

  const meterCards = [
    {
      label: 'Quiz Completion Rate',
      value: quizCompletionRate,
      hint: `${completedQuizzes}/${totalQuizzes} quizzes completed`,
    },
    {
      label: 'Flashcard Review Coverage',
      value: flashcardReviewRate,
      hint: `${reviewedFlashcards}/${totalFlashcards} cards reviewed`,
    },
    {
      label: 'Starred Card Density',
      value: starredRate,
      hint: `${starredFlashcards}/${totalFlashcards} cards starred`,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060914] px-4 py-6 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 right-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(125,145,180,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,145,180,0.08)_1px,transparent_1px)] bg-size-[26px_26px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4 shadow-[0_24px_90px_-22px_rgba(15,23,42,0.95)] backdrop-blur-xl sm:p-6 lg:p-8">
        <header className="mb-7 flex flex-col gap-4 border-b border-slate-700/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-md border border-indigo-300/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-100">
              <Activity className="h-3.5 w-3.5" />
              Performance Console
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
              Learning Operations Dashboard
            </h1>
            <p className="max-w-3xl text-sm text-slate-300/85 sm:text-base">
              Unified telemetry for documents, flashcards, and quiz execution with actionable study metrics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(asyncgetdashboard())}
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600/85 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-indigo-300/45 hover:bg-slate-700/70 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
            {status === 'loading' ? 'Refreshing...' : 'Refresh'}
          </button>
        </header>

        {status === 'loading' && !dashboard ? (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 text-sm text-slate-300">
            Loading dashboard data...
          </div>
        ) : null}

        {status === 'failed' ? (
          <div className="mb-5 rounded-2xl border border-red-400/35 bg-red-500/10 p-4 text-sm text-red-200">
            {error || 'Unable to load dashboard right now.'}
          </div>
        ) : null}

        {dashboard ? (
          <>
            <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {statConfig.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.key}
                    className="rounded-xl border border-slate-700/80 bg-slate-800/55 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                        <p className="mt-1 font-mono text-2xl font-semibold text-slate-100">
                          {overview[item.key] || 0}
                        </p>
                      </div>
                      <div className={`rounded-lg border p-2 ${item.tone}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-4">
              {insightCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className={`rounded-xl border p-4 ${item.tone}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <p className="text-xs uppercase tracking-wide">{item.label}</p>
                    </div>
                    <p className="font-mono text-2xl font-semibold text-slate-100">{item.value}</p>
                  </article>
                );
              })}
            </section>

            <section className="mb-6 rounded-2xl border border-slate-700/80 bg-slate-800/45 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Operational Ratios</h2>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-4">
                {meterCards.map((meter) => (
                  <div key={meter.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-300">{meter.label}</p>
                      <p className="font-mono text-sm font-semibold text-slate-100">{meter.value}%</p>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-700/80">
                      <div
                        className="h-2.5 rounded-full bg-linear-to-r from-indigo-500 via-cyan-500 to-emerald-500"
                        style={{ width: `${meter.value}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">{meter.hint}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <article className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-5">
                <div className="mb-4 flex items-center justify-between border-b border-slate-700/70 pb-3">
                  <h2 className="text-lg font-semibold text-slate-100">Recent Documents</h2>
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>

                {recentDocuments.length === 0 ? (
                  <p className="text-sm text-slate-400">No recent documents found.</p>
                ) : (
                  <div className="space-y-3">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="rounded-lg border border-slate-700/70 bg-slate-900/65 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-slate-100">
                              {doc.title || doc.fileName || 'Untitled document'}
                            </h3>
                            <p className="mt-1 font-mono text-xs text-slate-400">{doc.fileName || 'Unknown file'}</p>
                          </div>
                          <span className="rounded-md border border-indigo-300/25 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                            {toTitleCase(doc.status)}
                          </span>
                        </div>

                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDate(doc.lastAccessed)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-5">
                <div className="mb-4 flex items-center justify-between border-b border-slate-700/70 pb-3">
                  <h2 className="text-lg font-semibold text-slate-100">Recent Quiz Runs</h2>
                  <ClipboardCheck className="h-4 w-4 text-slate-400" />
                </div>

                {recentQuizzes.length === 0 ? (
                  <p className="text-sm text-slate-400">No quiz attempts found yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentQuizzes.map((quiz) => (
                      <div
                        key={quiz._id}
                        className="rounded-lg border border-slate-700/70 bg-slate-900/65 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-slate-100">
                              {quiz.title || quiz.document?.title || 'Quiz attempt'}
                            </h3>
                            <p className="mt-1 text-xs text-slate-400">
                              {quiz.document?.title || 'General quiz'}
                            </p>
                          </div>
                          <span className="rounded-md border border-teal-300/25 bg-teal-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-teal-100">
                            {quiz.score || 0}/{quiz.totalQuestions || 0}
                          </span>
                        </div>

                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDate(quiz.completedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;