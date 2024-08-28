import { cn } from '@/lib/utils';
import { Ban, CalendarCheck2, Hourglass } from 'lucide-react';

type Props = {
	type: 'appointments' | 'pending' | 'cancelled';
	count: number;
	label: string;
};
export default function StatCard({ count = 0, label, type }: Props) {
	return (
		<div
			className={cn('stat-card', {
				'bg-appointments': type === 'appointments',
				'bg-pending': type === 'pending',
				'bg-cancelled': type === 'cancelled',
			})}>
			<div className='flex items-center gap-4'>
				{type === 'appointments' ? (
					<CalendarCheck2 className='text-yellow-400 size-8' />
				) : type === 'cancelled' ? (
					<Ban className='text-red-400 size-8' />
				) : (
					<Hourglass className='text-green-400 size-8' />
				)}
				<h2 className='text-white text-2xl font-semibold'>{count}</h2>
			</div>

			<p className='text-base'>{label}</p>
		</div>
	);
}
