import Logo from '@/components/logo';
import StatCard from '@/components/stat-card';
import { columns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { getAllAppointments } from '@/lib/actions';
import { useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

type AppointmentsContext = {
	reFetchAppointments: () => Promise<void>;
	appointments: Appointment[];
};

export const AppointmentsContext = createContext<AppointmentsContext>({
	appointments: [],
	reFetchAppointments: async () => {},
});

export default function Dashboard() {
	const navigate = useNavigate();

	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [stats, setStats] = useState({
		pendingAppointments: 0,
		cancelledAppointments: 0,
		scheduledAppointments: 0,
	});

	useEffect(() => {
		document.title = 'CareX | Dashboard';
		reFetchAppointments();
	}, []);

	const reFetchAppointments = () =>
		getAllAppointments().then(data => {
			setAppointments(
				data?.documents?.map(app => ({
					appointmentId: app.$id,
					patient: app.patient,
					primaryPhysician: app.primaryPhysician,
					appointmentReason: app.appointmentReason,
					schedule: app.schedule,
					status: app.status,
					note: app.note,
					cancellationReason: app.cancellationReason,
					notesFromAdmin: app.notesFromAdmin,
					userId: app.userId,
				})) || []
			);
			setStats(
				data?.documents?.reduce(
					(acc, app) => ({
						pendingAppointments:
							app.status === 'pending'
								? acc.pendingAppointments + 1
								: acc.pendingAppointments,
						scheduledAppointments:
							app.status === 'scheduled'
								? acc.scheduledAppointments + 1
								: acc.scheduledAppointments,
						cancelledAppointments:
							app.status === 'cancelled'
								? acc.cancelledAppointments + 1
								: acc.cancelledAppointments,
					}),
					{
						pendingAppointments: 0,
						scheduledAppointments: 0,
						cancelledAppointments: 0,
					}
				) || {
					pendingAppointments: 0,
					scheduledAppointments: 0,
					cancelledAppointments: 0,
				}
			);
		});

	const logout = () => {
		navigate('/');
		localStorage.clear();
	};
	return (
		<div className='container mx-auto'>
			<header className='flex justify-between items-center bg-secondary rounded-md my-4 py-2 px-4 shadow-lg'>
				<Logo />
				<Button variant={'ghost'} onClick={logout}>
					Log out
				</Button>
			</header>
			<main className='md:px-4'>
				<section className='my-10'>
					<h1 className='text-3xl font-semibold'>Welcome Admin</h1>
					<p className='text-balance text-muted-foreground'>
						Start day with managing new appointments.
					</p>
				</section>
				<section className='admin-stat'>
					<StatCard
						type='appointments'
						count={stats.scheduledAppointments}
						label='Scheduled appointments'
					/>
					<StatCard
						type='pending'
						count={stats.pendingAppointments}
						label='Pending appointments'
					/>
					<StatCard
						type='cancelled'
						count={stats.cancelledAppointments}
						label='Cancelled appointments'
					/>
				</section>

				<section className='my-10'>
					<AppointmentsContext.Provider
						value={{ appointments, reFetchAppointments }}>
						<DataTable columns={columns} data={appointments} />
					</AppointmentsContext.Provider>
				</section>
			</main>
		</div>
	);
}
