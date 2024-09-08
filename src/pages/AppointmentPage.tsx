import FormLayout from '@/components/form-layout';
import { Button } from '@/components/ui/button';
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
import { Doctors, Images } from '@/lib/constants';
import { createAppointmentSchema } from '@/lib/formSchemas';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createAppointment, getUserData } from '@/lib/actions';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/loader';
import { toast } from '@/hooks/use-toast';

export default function AppointmentPage() {
	const params = useParams();

	const navigate = useNavigate();
	const form = useForm<z.infer<typeof createAppointmentSchema>>({
		resolver: zodResolver(createAppointmentSchema),
		defaultValues: {
			schedule: new Date(),
			note: '',
			primaryPhysician: '',
			appointmentReason: '',
		},
	});

	async function onSubmit(values: z.infer<typeof createAppointmentSchema>) {
		const user = await getUserData(params.userId as string);

		const appointment: CreateAppointmentParams = {
			userId: params.userId as string,
			patient: user?.username || 'NA',
			primaryPhysician: values.primaryPhysician,
			appointmentReason: values.appointmentReason,
			schedule: values.schedule,
			status: 'pending',
			note: values.note,
		};
		await createAppointment(appointment, navigate);
		toast({
			title: 'Appointment Requested',
			description:
				'Your appointment has been requested. We will get back to you shortly.',
		});
	}
	return (
		<FormLayout
			subtitle='Request a new appointment in 10 seconds.'
			title='New Appointment'
			img={Images.homePageBackground}>
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
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
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
								<Textarea {...field} placeholder='Annual monthly check-up' />
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
		</FormLayout>
	);
}
