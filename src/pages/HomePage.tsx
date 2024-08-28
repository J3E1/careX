import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userFormSchema } from '@/lib/formSchemas';
import { Mail, UserRound } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import PasskeyModal from '@/components/passkey-modal';
import FormLayout from '@/components/form-layout';
import { Images } from '@/lib/constants';

type Props = {};
export default function HomePage({}: Props) {
	const form = useForm<z.infer<typeof userFormSchema>>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			username: '',
			email: '',
			phone: '',
		},
	});

	function onSubmit(values: z.infer<typeof userFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<>
			<PasskeyModal />
			<FormLayout
				showAdmin
				subtitle='Get started with appointments.'
				title='Hey there'
				img={Images.homePageBackground}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full name</FormLabel>
									<FormControl>
										<div className='relative h-10 w-full'>
											<UserRound className='absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10' />
											<Input
												placeholder='John Doe'
												className='pl-10'
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<div className='relative h-10 w-full'>
											<Mail className='absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10' />
											<Input
												placeholder='johndome@yahoo.com'
												className='pl-10'
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<PhoneInput
											defaultCountry='IN'
											placeholder='Enter phone number'
											international
											countryCallingCodeEditable
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type='submit' className='w-full'>
							Submit
						</Button>
					</form>
				</Form>
			</FormLayout>
		</>
	);
}
