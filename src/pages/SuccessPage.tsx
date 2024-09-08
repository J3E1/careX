import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { AppointmentFromDB, getAppointmentById } from '@/lib/actions';
import { Doctors } from '@/lib/constants';
import { Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function SuccessPage() {
	const params = useParams();

	const [appointment, setAppointment] = useState<AppointmentFromDB | null>(
		null
	);
	useEffect(() => {
		getAppointmentById(params.appointmentId || '').then(data => {
			if (data) setAppointment(data);
		});
	}, [params.appointmentId]);

	const foundDoctor = useMemo(
		() => Doctors.find(doctor => doctor.name === appointment?.primaryPhysician),
		[appointment?.primaryPhysician]
	);
	const currentYear = useMemo(() => new Date().getFullYear(), []);

	if (!appointment) return null;

	return (
		<div className='container mx-auto pt-28'>
			<div className='flex flex-col items-center'>
				<Link to='/' className='mb-8'>
					<Logo />
				</Link>

				<section className='flex flex-col items-center'>
					{/* <img src='/gifs/success.gif' height={300} width={280} alt='success' /> */}
					<h2 className='header mb-6 max-w-[600px] text-center'>
						Your <span className='text-[#cf64d4]'>appointment request</span> has
						been successfully submitted!
					</h2>
					<p>We&apos;ll be in touch shortly to confirm.</p>
				</section>

				<section className='text-center my-4 space-y-2'>
					<p>Requested appointment details: </p>
					<div className='flex justify-center gap-3'>
						<img
							src={foundDoctor!.image!}
							alt='doctor'
							className='size-6 filter'
						/>
						<p className='whitespace-nowrap text-center'>
							Dr. {appointment?.primaryPhysician}
						</p>
					</div>
					<div className='flex justify-center gap-3'>
						<Calendar className='h-6 w-6' />
						<p>
							{new Intl.DateTimeFormat('en-US', {
								dateStyle: 'full',
							}).format(new Date(appointment?.schedule || ''))}
						</p>
					</div>
				</section>

				<Button asChild className='my-4 uppercase'>
					<Link to={`/${appointment?.userId}/new-appointment`}>
						Book A New Appointment
					</Link>
				</Button>

				<span className='text-muted-foreground text-sm'>
					&copy; {currentYear} CareX
				</span>
			</div>
		</div>
	);
}
