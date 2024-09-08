import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from './ui/input-otp';
const PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY;

export default function PasskeyModal() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [isOpen, setIsOpen] = useState(!!searchParams.get('admin'));
	const [passkey, setPasskey] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (searchParams.get('admin')) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [searchParams]);

	useEffect(() => {
		const localPassKey = localStorage.getItem('passkey');
		if (btoa(PASSKEY) === localPassKey) {
			navigate('/dashboard');
		}
	}, [navigate]);

	const onChangeModal = (currentlyOpen: boolean) => {
		if (!currentlyOpen) {
			navigate('/');
			setError('');
			setPasskey('');
		}
		setIsOpen(currentlyOpen);
	};

	const validatePasskey = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();

		if (passkey.length !== 6) {
			setError('Please enter a valid passkey');
			return;
		}

		if (passkey === PASSKEY) {
			const encryptedPasskeyString = btoa(passkey);
			localStorage.setItem('passkey', encryptedPasskeyString);
			setError('');
			navigate('/dashboard');
			setIsOpen(false);
		} else {
			setError('Invalid passkey. Please try again.');
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={onChangeModal}>
			<DialogContent className='max-w-fit'>
				<DialogHeader>
					<DialogTitle>Admin access validation</DialogTitle>
					<DialogDescription>
						To enter the admin panel, please enter the passkey.
					</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col gap-4 justify-center items-center'>
					<InputOTP maxLength={6} value={passkey} onChange={setPasskey}>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>

					{!!error && (
						<p className={'text-sm font-medium text-destructive'}>{error}</p>
					)}
				</div>
				<DialogFooter className='mt-2'>
					<Button
						className='w-full'
						variant='outline'
						onClick={() => setPasskey('')}>
						<span>Clear</span>
					</Button>
					<Button className='w-full' onClick={validatePasskey}>
						Continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
