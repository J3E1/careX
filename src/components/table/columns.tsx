import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Ban, CalendarCheck2, Hourglass } from 'lucide-react';
import { Button } from '../ui/button';
import { Doctors } from '@/lib/constants';
import { AppointmentModal } from '../appointment-modal';
import { Checkbox } from '../ui/checkbox';

export const columns: ColumnDef<Appointment>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && 'indeterminate')
	// 			}
	// 			onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label='Select all'
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={value => row.toggleSelected(!!value)}
	// 			aria-label='Select row'
	// 		/>
	// 	),
	// },
	{
		accessorKey: 'appointmentId',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					ID
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<span className='font-medium truncate'>
					{row.original.appointmentId}
				</span>
			);
		},
	},
	{
		accessorKey: 'patient',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Patient
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Status
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
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
		accessorKey: 'schedule',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Appointment
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const formatted = new Intl.DateTimeFormat('en-US', {
				dateStyle: 'full',
			}).format(new Date(row.original.schedule));

			return <div className='font-medium'>{formatted}</div>;
		},
	},
	{
		accessorKey: 'primaryPhysician',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Doctor
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const { primaryPhysician } = row.original;
			const doctor = Doctors.find(doc => doc.name === primaryPhysician)!;
			return (
				<div className='flex cursor-pointer items-center gap-2'>
					<img
						src={doctor.image}
						alt='doctor'
						className='size-8 rounded-full border border-dark-500'
					/>
					<p>{doctor.name}</p>
				</div>
			);
		},
	},
	{
		id: 'actions',
		header: () => 'Actions',
		cell: ({ row }) => {
			const appointment = row.original;

			if (appointment.status !== 'pending') return null;

			return (
				<div className='space-x-4 space-y-2'>
					<AppointmentModal type='schedule' appointment={appointment} />
					<AppointmentModal type='cancel' appointment={appointment} />
				</div>
			);
		},
	},
];
