import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const formatMimeLabel = (mimeType) => {
	if (!mimeType) return 'unknown';
	const parts = mimeType.split('/');
	return parts[1] || parts[0] || 'unknown';
};

const DocumentsTypePieChart = ({ data }) => {
	const chartData = (data || []).map((item) => ({
		name: formatMimeLabel(item.mimeType),
		value: Number(item.count) || 0,
	}));

	return (
		<div className='bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-slate-200/50 p-6'>
			<div className='mb-4'>
				<h3 className='text-lg font-medium text-slate-900 tracking-tight'>Document Types</h3>
				<p className='text-xs text-slate-500'>Breakdown by uploaded file type</p>
			</div>

			{chartData.length === 0 ? (
				<div className='h-52 flex items-center justify-center text-sm text-slate-500'>
					No document type data yet.
				</div>
			) : (
				<div className='h-56 flex items-center gap-4'>
					<div className='h-full w-full'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<Pie
									data={chartData}
									dataKey='value'
									nameKey='name'
									innerRadius={48}
									outerRadius={80}
									paddingAngle={3}
									cornerRadius={8}
								>
									{chartData.map((entry, index) => (
										<Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className='min-w-[120px] space-y-2'>
						{chartData.map((entry, index) => (
							<div key={`legend-${entry.name}-${index}`} className='flex items-center gap-2 text-xs text-slate-600'>
								<span
									className='inline-block h-2.5 w-2.5 rounded-full'
									style={{ backgroundColor: COLORS[index % COLORS.length] }}
								/>
								<span className='truncate'>{entry.name}</span>
								<span className='ml-auto text-slate-500'>{entry.value}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DocumentsTypePieChart;