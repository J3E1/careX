import Logo from '@/components/logo';
import StatCard from '@/components/stat-card';
import { columns, Payment } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';


export default function Dashboard() {
	return (
		<div className='container mx-auto'>
			<header className='flex justify-between items-center bg-secondary rounded-md my-4 py-2 px-4 shadow-lg'>
				<Logo />
				<Button variant={'ghost'}>Log out</Button>
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
						count={25}
						label='Scheduled appointments'
					/>
					<StatCard type='pending' count={12} label='Pending appointments' />
					<StatCard
						type='cancelled'
						count={32}
						label='Cancelled appointments'
					/>
				</section>

				<section className='my-10'>
					<DataTable
						columns={columns}
						data={
							[
								{
									id: '728ed52f',
									amount: 100,
									status: 'pending',
									email: 'm@example.com',
								},
								{
									id: '728ed5s2f',
									amount: 100,
									status: 'cancelled',
									email: 'm@example.com',
								},
								{
									id: '728sed52f',
									amount: 100,
									status: 'scheduled',
									email: 'm@example.com',
								},
								{
									id: '728esd52f',
									amount: 100,
									status: 'pending',
									email: 'm@example.com',
								},
							] as Payment[]
						}
					/>
				</section>
			</main>
		</div>
	);
}
