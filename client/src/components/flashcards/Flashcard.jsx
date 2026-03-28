import { useState } from 'react';

const Flashcard = ({ card }) => {
	const [flipped, setFlipped] = useState(false);

	if (!card) return null;

	return (
		<div
			onClick={() => setFlipped(!flipped)}
			className="cursor-pointer w-full max-w-xl mx-auto h-64 flex items-center justify-center rounded-2xl shadow-lg bg-white border border-slate-200 p-6 text-center transition-all"
		>
			<p className="text-lg font-medium text-slate-800">
				{flipped ? card.answer : card.question}
			</p>
		</div>
	);
};

export default Flashcard;