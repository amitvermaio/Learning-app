import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const QuizPerformanceBarPlot = ({ data }) => {
  const chartData = (data || []).map((item, index) => ({
    name: item.name || `Quiz ${index + 1}`,
    score: Number(item.score) || 0,
    totalScore: Number(item.totalScore) || 100,
  }));

  return (
    <div className='bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-slate-200/50 p-6'>
      <div className='mb-4'>
        <h3 className='text-lg font-medium text-slate-900 tracking-tight'>Quiz Performance</h3>
        <p className='text-xs text-slate-500'>Scored marks vs. total marks by quiz</p>
      </div>

      {chartData.length === 0 ? (
        <div className='h-52 flex items-center justify-center text-sm text-slate-500'>
          No quiz performance data yet.
        </div>
      ) : (
        <div className='h-56'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 10, right: 18, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' />
              <XAxis dataKey='name' tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey='score' name='Scored Marks' fill='#10b981' radius={[6, 6, 0, 0]} />
              <Bar dataKey='totalScore' name='Total Marks' fill='#94a3b8' radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default QuizPerformanceBarPlot;