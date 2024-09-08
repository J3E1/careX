import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userRegisterFormSchema } from '@/lib/formSchemas';
import {
	CalendarIcon,
	Mail,
	UserRound,
	MapPinHouse,
	BriefcaseBusiness,
} from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import FormLayout from '@/components/form-layout';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	SelectContent,
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileInput, FileUploader } from '@/components/ui/file-input';
import { DropzoneOptions } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import {
	Doctors,
	GenderOptions,
	IdentificationTypes,
	Images,
} from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useParams } from 'react-router-dom';
import { createPatient, getUserData } from '@/lib/actions';
import Loader from '@/components/loader';
import { toast } from '@/hooks/use-toast';

export default function RegistrationPage() {
	const params = useParams();

	const navigate = useNavigate();

	const form = useForm<z.infer<typeof userRegisterFormSchema>>({
		resolver: zodResolver(userRegisterFormSchema),
		defaultValues: async () => {
			const user = await getUserData(params.userId as string);
			return {
				username: user?.username || '',
				email: user?.email || '',
				phone: user?.phone || '',
				birthDate: new Date(Date.now()),
				gender: 'Male',
				address: '',
				occupation: '',
				emergencyContactName: '',
				emergencyContactNumber: '',
				primaryPhysician: '',
				insuranceProvider: '',
				insurancePolicyNumber: '',
				allergies: '',
				currentMedication: '',
				familyMedicalHistory: '',
				pastMedicalHistory: '',
				identificationType: 'Birth Certificate',
				identificationNumber: '',
				identificationDocument: [],
				treatmentConsent: false,
				disclosureConsent: false,
				privacyConsent: false,
			};
		},
	});

	const dropZoneConfig = {
		accept: {
			'image/*': ['.jpg', '.jpeg', '.png'],
		},
		multiple: false,
		maxFiles: 4,
		maxSize: 1 * 1024 * 1024,
	} satisfies DropzoneOptions;

	async function onSubmit(values: z.infer<typeof userRegisterFormSchema>) {
		const user = {
			userId: params.userId || '',
			birthDate: values.birthDate,
			gender: values.gender,
			address: values.address,
			occupation: values.occupation,
			emergencyContactName: values.emergencyContactName,
			emergencyContactNumber: values.emergencyContactNumber,
			primaryPhysician: values.primaryPhysician,
			insuranceProvider: values.insuranceProvider,
			insurancePolicyNumber: values.insurancePolicyNumber,
			allergies: values.allergies,
			currentMedication: values.currentMedication,
			familyMedicalHistory: values.familyMedicalHistory,
			pastMedicalHistory: values.pastMedicalHistory,
			identificationType: values.identificationType,
			identificationNumber: values.identificationNumber,
			privacyConsent: values.privacyConsent,
			disclosureConsent: values.disclosureConsent,
			treatmentConsent: values.treatmentConsent,
		};

		await createPatient(user, navigate);
		toast({
			title: 'Your details has been submitted.',
		});
	}
	return (
		<FormLayout
			subtitle='Let us know more about you.'
			title='Welcome'
			img={Images.registrationPageBackground}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-8'>
					<h2 className='text-2xl font-semibold'>Personal Information</h2>
					<div className='grid grid-cols-2 gap-4 mb-4'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem className='col-span-full'>
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
								<FormItem className='col-span-2 md:col-span-1'>
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
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Phone number</FormLabel>
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
						<FormField
							control={form.control}
							name='birthDate'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Date of birth</FormLabel>
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
													date > new Date() || date < new Date('1900-01-01')
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
							name='gender'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Gender</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='w-full flex h-11 gap-x-3 justify-between'>
											{GenderOptions.map((option, i) => (
												<div
													key={option + i}
													className={cn(
														buttonVariants({ variant: 'outlineOld' }),
														'space-x-2 px-3'
													)}>
													<RadioGroupItem value={option} id={option} />
													<Label htmlFor={option} className='cursor-pointer'>
														{option}
													</Label>
												</div>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<div className='relative h-10 w-full'>
											<MapPinHouse className='absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10' />
											<Input
												placeholder='123 Main St, Anytown, USA'
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
							name='occupation'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Occupation</FormLabel>
									<FormControl>
										<div className='relative h-10 w-full'>
											<BriefcaseBusiness className='absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10' />
											<Input
												placeholder='Software Engineer'
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
							name='emergencyContactName'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Emergency contact name</FormLabel>
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
							name='emergencyContactNumber'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Emergency contact number</FormLabel>
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
					</div>
					<h2 className='text-2xl font-semibold'>Medical Information</h2>
					<div className='grid grid-cols-2 gap-4 mb-4'>
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
							name='insuranceProvider'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Insurance provider</FormLabel>
									<Input placeholder='BlueCross BlueShield' {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='insurancePolicyNumber'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Insurance number</FormLabel>
									<FormControl>
										<Input placeholder='ABC123456789' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='allergies'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Allergies (if any)</FormLabel>
									<Textarea
										{...field}
										placeholder='Peanuts, Penicillin, Pollen'
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='currentMedication'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Current medications (if any)</FormLabel>
									<Textarea
										{...field}
										placeholder='Ibuprofen 200mg, Levothyroxine 50mcg'
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='familyMedicalHistory'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Family medical history (if relevant)</FormLabel>
									<Textarea
										{...field}
										placeholder='Mother had brain cancer, Father has hypertension'
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='pastMedicalHistory'
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Past medical history</FormLabel>
									<Textarea
										{...field}
										placeholder='Appendectomy in 2015, Asthma diagnosis in childhood'
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<h2 className='text-2xl font-semibold'>
						Identification and Verification
					</h2>
					<div className='grid grid-cols-2 gap-4 mb-4'>
						<FormField
							control={form.control}
							name='identificationType'
							render={({ field }) => (
								<FormItem className='col-span-full'>
									<FormLabel>Identification Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a identification type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{IdentificationTypes.map(identificationType => (
												<SelectItem
													key={identificationType}
													value={identificationType}>
													{identificationType}
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
							name='identificationNumber'
							render={({ field }) => (
								<FormItem className='col-span-2'>
									<FormLabel>Identification number</FormLabel>
									<Input placeholder='123456789' {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='identificationDocument'
							render={({ field }) => (
								<FormItem className='col-span-2'>
									<FormLabel>
										Scanned copy of identification documentation
									</FormLabel>
									<FileUploader
										value={field.value}
										onValueChange={field.onChange}
										dropzoneOptions={dropZoneConfig}
										reSelect={true}
										className='relative bg-background p-2'>
										<FileInput className='outline-dashed outline-1 outline-muted-foreground'>
											<div className='flex items-center justify-center flex-col pt-3 pb-4 w-full '>
												<svg
													className='w-8 h-8 mb-3 text-muted-foreground'
													aria-hidden='true'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 20 16'>
													<path
														stroke='currentColor'
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
													/>
												</svg>
												<p className='mb-1 text-sm text-muted-foreground'>
													<span className='font-semibold'>Click to upload</span>
													&nbsp; or drag and drop
												</p>
												<p className='text-xs text-muted-foreground'>
													PNG, JPEG or JPG
												</p>
											</div>
										</FileInput>
									</FileUploader>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<h2 className='text-2xl font-semibold'>Consent and Privacy</h2>
					<div className='grid grid-cols-2 gap-2 mb-4'>
						<FormField
							control={form.control}
							name='treatmentConsent'
							render={({ field }) => (
								<FormItem className='col-span-full'>
									<div className=' flex flex-row items-start space-x-3 space-y-0 my-2'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>
												I consent to receive treatment for my health condition.
											</FormLabel>
										</div>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='disclosureConsent'
							render={({ field }) => (
								<FormItem className='col-span-full'>
									<div className=' flex flex-row items-start space-x-3 space-y-0 my-2'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>
												I consent to the use and disclosure of my health
												information for treatment purposes.
											</FormLabel>
										</div>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='privacyConsent'
							render={({ field }) => (
								<FormItem className='col-span-full'>
									<div className=' flex flex-row items-start space-x-3 space-y-0 my-2'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>
												I acknowledge that I have reviewed and agree to the
												privacy policy
											</FormLabel>
										</div>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && <Loader />}
						Submit
					</Button>
				</form>
			</Form>
		</FormLayout>
	);
}
