import { Dispatch, SetStateAction, useContext, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { format } from 'date-fns';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Doctors } from '@/lib/constants';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	cancelAppointmentSchema,
	scheduleAppointmentSchema,
} from '@/lib/formSchemas';
import { z } from 'zod';
import { cancelAppointment, scheduleAppointment } from '@/lib/actions';
import { AppointmentsContext } from '@/pages/Dashboard';
import Loader from './loader';
import { toast } from '@/hooks/use-toast';

export const AppointmentModal = ({
	appointment,
	type,
}: {
	appointment: Appointment;
	type: 'schedule' | 'cancel';
}) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{type === 'schedule' ? (
					<Button size={'sm'} className='uppercase'>
						Schedule
					</Button>
				) : (
					<Button size={'sm'} className='uppercase' variant={'outline'}>
						<span>Cancel</span>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className='shad-dialog sm:max-w-md'>
				<DialogHeader className='mb-4 space-y-3'>
					<DialogTitle className='capitalize'>
						{type === 'schedule' ? 'Schedule' : 'Cancel'} Appointment
					</DialogTitle>
					<DialogDescription>
						Please fill in the following details to {type} appointment
					</DialogDescription>
				</DialogHeader>

				{type === 'schedule' ? (
					<ScheduleAppointment appointment={appointment} setOpen={setOpen} />
				) : (
					<CancelAppointment
						setOpen={setOpen}
						appointmentId={appointment.appointmentId}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};

const ScheduleAppointment = ({
	appointment,
	setOpen,
}: {
	appointment: Appointment;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const { reFetchAppointments } = useContext(AppointmentsContext);

	const form = useForm<z.infer<typeof scheduleAppointmentSchema>>({
		resolver: zodResolver(scheduleAppointmentSchema),
		defaultValues: {
			schedule: new Date(appointment?.schedule),
			note: appointment?.note,
			primaryPhysician: appointment?.primaryPhysician,
			appointmentReason: appointment?.appointmentReason,
		},
	});
	async function onSubmit(values: z.infer<typeof scheduleAppointmentSchema>) {
		await scheduleAppointment({
			primaryPhysician: values.primaryPhysician,
			schedule: values.schedule,
			notesFromAdmin: values.notesFromAdmin,
			appointmentId: appointment.appointmentId,
		});
		await reFetchAppointments();
		toast({
			title: 'Appointment Scheduled',
		});
		setOpen(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid grid-cols-2 gap-y-8 gap-x-4'>
				<FormField
					control={form.control}
					name='primaryPhysician'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>Primary physician</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select your primary physician' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Doctors.map((doctor, i) => (
										<SelectItem key={doctor.name + i} value={doctor.name}>
											<div className='flex cursor-pointer items-center gap-2'>
												<img
													src={doctor.image}
													alt='doctor'
													className='size-8 rounded-full border border-dark-500'
												/>
												<p>{doctor.name}</p>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='schedule'
					render={({ field }) => (
						<FormItem className='col-span-full'>
							<FormLabel>Expected appointment date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outlineOld'}
											className={cn(
												'w-full pr-3 text-left font-normal justify-start',
												!field.value && 'text-muted-foreground'
											)}>
											<CalendarIcon className='h-4 w-4 opacity-70 mr-2' />
											{field.value ? (
												format(field.value, 'PPP')
											) : (
												<span>Pick a date</span>
											)}
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										disabled={date =>
											date < new Date() || date > new Date('2030-01-01')
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='appointmentReason'
					render={({ field }) => (
						<FormItem className='col-span-2 md:col-span-1'>
							<FormLabel>Appointment reason</FormLabel>
							<Textarea
								{...field}
								disabled
								placeholder='Annual monthly check-up'
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='note'
					render={({ field }) => (
						<FormItem className='col-span-2 md:col-span-1'>
							<FormLabel>Comments/notes</FormLabel>
							<Textarea
								{...field}
								value={field.value || ''}
								disabled
								placeholder='Prefer afternoon appointments, if possible'
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='notesFromAdmin'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel>Notes from admin</FormLabel>
							<Textarea
								{...field}
								placeholder='Prefer afternoon appointments, if possible'
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='w-full col-span-2'
					disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && <Loader />}
					Submit
				</Button>
			</form>
		</Form>
	);
};
const CancelAppointment = ({
	appointmentId,
	setOpen,
}: {
	appointmentId: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const { reFetchAppointments } = useContext(AppointmentsContext);
	const form = useForm<z.infer<typeof cancelAppointmentSchema>>({
		resolver: zodResolver(cancelAppointmentSchema),
		defaultValues: {
			cancelationReason: '',
		},
	});
	async function onSubmit(values: z.infer<typeof cancelAppointmentSchema>) {
		await cancelAppointment({
			appointmentId,
			cancelationReason: values.cancelationReason,
		});
		await reFetchAppointments();
		toast({
			title: 'Appointment Cancelled',
		});
		setOpen(false);
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid grid-cols-2 gap-y-8 gap-x-4'>
				<FormField
					control={form.control}
					name='cancelationReason'
					render={({ field }) => (
						<FormItem className='col-span-2'>
							<FormLabel>Cancelation reason</FormLabel>
							<Textarea {...field} placeholder='Doctor is not available' />
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					variant={'destructive'}
					className='w-full col-span-2'
					disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && <Loader />}
					Submit
				</Button>
			</form>
		</Form>
	);
};
