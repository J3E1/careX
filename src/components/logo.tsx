import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = { className?: string };
export default function Logo({ className }: Props) {
	return (
		<Link
			to='/'
			className={cn(
				'text-2xl font-bold flex justify-start items-centers',
				className
			)}>
			<LoaderCircle className='size-8' />
			are<span className='text-[#cf64d4]'>X</span>
		</Link>
	);
}
