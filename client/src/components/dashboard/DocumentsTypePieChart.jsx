import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const MIME_LABELS = {
	'application/pdf': { label: 'PDF', icon: '/pdf.svg' },
	'application/msword': { label: 'Word', icon: '/Microsoft_Office_Word.svg' },
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
		label: 'Word',
		icon: '/Microsoft_Office_Word.svg',
	},
	'application/vnd.ms-powerpoint': { label: 'PowerPoint', icon: '/Microsoft_Office_PowerPoint.svg' },
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
		label: 'PowerPoint',
		icon: '/Microsoft_Office_PowerPoint.svg',
	},
	'application/vnd.ms-excel': { label: 'Excel', icon: '/Microsoft_Office_Excel.svg' },
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
		label: 'Excel',
		icon: '/Microsoft_Office_Excel.svg',
	},
};

const formatMimeLabel = (mimeType) => {
	if (!mimeType) return { label: 'Unknown', icon: null };
	const directMatch = MIME_LABELS[mimeType];
	if (directMatch) return directMatch;

	const lower = mimeType.toLowerCase();
	if (lower.includes('pdf')) return { label: 'PDF', icon: '/pdf.svg' };
	if (lower.includes('word')) return { label: 'Word', icon: '/Microsoft_Office_Word.svg' };
	if (lower.includes('powerpoint') || lower.includes('presentation')) {
		return { label: 'PowerPoint', icon: '/Microsoft_Office_PowerPoint.svg' };
	}
	if (lower.includes('excel') || lower.includes('spreadsheet')) {
		return { label: 'Excel', icon: '/Microsoft_Office_Excel.svg' };
	}

	const parts = mimeType.split('/');
	const raw = parts[1] || parts[0] || 'unknown';
	const label = raw
		.replace(/^vnd\./, '')
		.replace(/^x-/, '')
		.replace(/[.-]/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());

	return { label, icon: null };
};

const DocumentsTypePieChart = ({ data }) => {
	const chartData = (data || []).map((item) => {
		const meta = formatMimeLabel(item.mimeType);
		return {
			name: meta.label,
			icon: meta.icon,
			value: Number(item.count) || 0,
		};
	});

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
				<div className='flex flex-col gap-4 sm:h-56 sm:flex-row sm:items-center'>
					<div className='h-56 w-full sm:h-full sm:w-3/5'>
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
					<div className='w-full space-y-2 sm:w-2/5'>
						{chartData.map((entry, index) => (
							<div key={`legend-${entry.name}-${index}`} className='flex items-center gap-2 text-xs text-slate-600'>
								<span
									className='inline-block h-2.5 w-2.5 rounded-full flex-shrink-0'
									style={{ backgroundColor: COLORS[index % COLORS.length] }}
								/>
								{entry.icon ? (
									<img src={entry.icon} alt='' className='h-4 w-4 flex-shrink-0' />
								) : null}
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