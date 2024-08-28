import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ReactElement, useMemo } from 'react';
import Logo from './logo';

type Props = {
	children: ReactElement;
	img: string;
	title: string;
	subtitle: string;
	showAdmin?: boolean;
};
export default function FormLayout({
	children,
	img,
	title,
	subtitle,
	showAdmin = false,
}: Props) {
	const currentYear = useMemo(() => new Date().getFullYear(), []);
	return (
		<>
			<div className='w-full lg:grid lg:grid-cols-10'>
				<div className='col-span-full lg:col-span-6 flex items-center justify-center py-auto'>
					<div className='w-[38rem] mx-4 md:mx-auto grid gap-6'>
						<Logo className='mt-6'/>
						<div className='grid gap-2 text-center lg:text-left'>
							<h1 className='text-3xl font-bold'>{title}</h1>
							<p className='text-balance text-muted-foreground'>{subtitle}</p>
						</div>
						{children}
						<div className='mt-4 flex justify-between items-center mb-4'>
							<span className='text-muted-foreground text-sm'>
								&copy; {currentYear} CareX
							</span>
							{showAdmin && (
								<Button asChild variant={'link'}>
									<Link to='?admin=true'>Admin</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
				<div className='hidden min-h-screen bg-muted lg:block lg:col-span-4'>
					<img src={img} alt='Image' className='h-full w-full object-cover' />
				</div>
			</div>
		</>
	);
}
