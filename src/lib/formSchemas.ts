import { z } from 'zod';
import { GenderOptions, IdentificationTypes } from './constants';

export const userFormSchema = z.object({
	username: z
		.string()
		.min(2, 'Must be at least 2 characters')
		.max(50, 'Must be less than 50 characters'),
	email: z.string().email('Must be a valid email'),
	phone: z
		.string()
		.refine(
			phone =>
				/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone),
			{
				message: 'Must be a valid phone number',
			}
		),
});
export const userRegisterFormSchema = z.object({
	username: z
		.string()
		.min(2, 'Must be at least 2 characters')
		.max(50, 'Must be less than 50 characters'),
	email: z.string().email('Must be a valid email'),
	phone: z
		.string()
		.refine(
			phone =>
				/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone),
			{
				message: 'Must be a valid phone number',
			}
		),
	birthDate: z.date({
		required_error: 'A date of birth is required.',
	}),
	gender: z.enum(GenderOptions, {
		errorMap: () => ({ message: 'Gender is required.' }),
	}),
	address: z.string().min(5, 'Address must be at least 5 characters long'),
	occupation: z
		.string()
		.min(3, 'Occupation must be at least 3 characters long'),
	emergencyContactName: z
		.string()
		.min(3, 'Name must be at least 3 characters long'),
	emergencyContactNumber: z
		.string()
		.refine(
			phone =>
				/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone),
			{
				message: 'Must be a valid phone number',
			}
		),
	primaryPhysician: z.string().min(3, 'Please select a primary physician'),
	insuranceProvider: z.string().min(3, 'Please add an insurance provider'),
	insurancePolicyNumber: z
		.string()
		.min(3, 'Please add an insurance policy number'),
	allergies: z.string().optional(),
	currentMedication: z.string().optional(),
	familyMedicalHistory: z.string().optional(),
	pastMedicalHistory: z.string().optional(),
	identificationType: z
		.enum(IdentificationTypes, {
			errorMap: () => ({ message: 'Identification type is required.' }),
		})
		.optional(),
	identificationNumber: z
		.string()
		.min(3, 'Identification number must be at least 3 characters')
		.max(50, 'Policy number must be at most 50 characters')
		.optional(),
	identificationDocument: z
		.array(
			z.instanceof(File).refine(file => file.size < 1 * 1024 * 1024, {
				message: 'File size must be less than 1MB',
			})
		)
		.max(1, {
			message: 'Maximum 1 file is allowed',
		})
		.nullable(),
	treatmentConsent: z
		.boolean()
		.default(false)
		.refine(value => value === true, {
			message: 'You must consent to treatment in order to proceed',
		}),
	disclosureConsent: z
		.boolean()
		.default(false)
		.refine(value => value === true, {
			message: 'You must consent to disclosure in order to proceed',
		}),
	privacyConsent: z
		.boolean()
		.default(false)
		.refine(value => value === true, {
			message: 'You must consent to privacy in order to proceed',
		}),
});

export const createAppointmentSchema = z.object({
	primaryPhysician: z.string().min(2, 'Select at least one doctor'),
	schedule: z.coerce.date(),
	appointmentReason: z
		.string()
		.min(2, 'Reason must be at least 2 characters')
		.max(500, 'Reason must be at most 500 characters'),
	note: z.string().optional().nullable(),
});

export const scheduleAppointmentSchema = z
	.object({
		notesFromAdmin: z.string().optional(),
		cancelationReason: z.string().optional(),
	})
	.merge(createAppointmentSchema);

export const cancelAppointmentSchema = z.object({
	cancelationReason: z
		.string()
		.min(2, 'Reason must be at least 2 characters')
		.max(500, 'Reason must be at most 500 characters'),
});

export function getAppointmentSchema(type: 'create' | 'cancel' | 'schedule') {
	switch (type) {
		case 'create':
			return createAppointmentSchema;
		case 'cancel':
			return cancelAppointmentSchema;
		case 'schedule':
			return scheduleAppointmentSchema;
		default:
			return {};
	}
}
