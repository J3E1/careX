import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Ban, CalendarCheck2, Hourglass } from 'lucide-react';
import { Button } from '../ui/button';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'cancelled' | 'scheduled';
	email: string;
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const { status } = row.original;
			return (
				<Badge
					variant={'outline'}
					className={cn(
						status === 'pending'
							? 'bg-blue-400/20 text-blue-400'
							: status === 'cancelled'
							? 'bg-red-400/20 text-red-400'
							: 'bg-green-400/20 text-green-400'
					)}>
					{status === 'scheduled' ? (
						<>
							<CalendarCheck2 className='mr-1 size-3' />
							Scheduled
						</>
					) : status === 'cancelled' ? (
						<>
							<Ban className='mr-1 size-3' />
							Cancelled
						</>
					) : (
						<>
							<Hourglass className='mr-1 size-3' />
							Pending
						</>
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'amount',
		header: () => <div className='text-right'>Amount</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('amount'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className='text-right font-medium'>{formatted}</div>;
		},
	},
	{
		id: 'actions',
		header: () => <div className='text-center'>Actions</div>,
		cell: ({ row }) => {
			const appointment = row.original;

			return (
				<div className='flex justify-end gap-4'>
					<Button size={'sm'}>Schedule</Button>
					<Button size={'sm'} variant={'outline'}>
						<span>Cancel</span>
					</Button>
					{/* <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          /> */}
				</div>
			);
		},
	},
];
