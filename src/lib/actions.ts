import { Models, Query } from 'appwrite';
import { db, ID } from './appwrite';
import type { NavigateFunction } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
const PATIENT_COLLECTION_ID = import.meta.env
	.VITE_APPWRITE_PATIENT_COLLECTION_ID;
const APPOINTMENT_COLLECTION_ID = import.meta.env
	.VITE_APPWRITE_APPOINTMENT_COLLECTION_ID;

export const createUser = async (
	user: CreateUserParams,
	navigate: NavigateFunction
) => {
	try {
		const users = await db.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
			Query.equal('email', user.email),
		]);
		if (users.total > 0) {
			const patients = await db.listDocuments(
				DATABASE_ID,
				PATIENT_COLLECTION_ID,
				[Query.equal('userId', users.documents[0].$id)]
			);

			if (patients.total > 0) {
				navigate(`/${patients.documents[0].$id}/new-appointment`);
				toast({
					title: 'Please fill the appointment form',
				});
			} else {
				navigate(`/${users.documents[0].$id}/register`);
				toast({
					title: 'Please register with filling patient form',
				});
			}
		} else {
			const createdUser = await db.createDocument(
				DATABASE_ID,
				USERS_COLLECTION_ID,
				ID.unique(),
				user
			);
			navigate(`/${createdUser.$id}/register`);
			toast({
				title: 'Please register with filling patient form',
			});
		}
	} catch (error) {
		console.log('🚀 ~ file: actions.ts:42 ~ error:', error);
	}
};

export const getUserData = async (userId: string) => {
	try {
		type UserFromDB = Models.Document & {
			username: string;
			email: string;
			phone: string;
		};
		const user: UserFromDB = await db.getDocument(
			DATABASE_ID,
			USERS_COLLECTION_ID,
			userId
		);
		return user;
	} catch (error) {
		console.log('🚀 ~ file: actions.ts:61 ~ getUserData ~ error:', error);
	}
};

export const createPatient = async (
	patient: RegisterUserParam,
	navigate: NavigateFunction
) => {
	try {
		await db.createDocument(
			DATABASE_ID,
			PATIENT_COLLECTION_ID,
			ID.unique(),
			patient
		);
		navigate(`/${patient.userId}/new-appointment`);
	} catch (error) {
		console.log('🚀 ~ file: actions.ts:79 ~ error:', error);
	}
};

export const createAppointment = async (
	appointment: CreateAppointmentParams,
	navigate: NavigateFunction
) => {
	try {
		const createdAppointment = await db.createDocument(
			DATABASE_ID,
			APPOINTMENT_COLLECTION_ID,
			ID.unique(),
			appointment
		);
		navigate(
			`/${appointment.userId}/appointment/${createdAppointment.$id}/success`
		);
	} catch (error) {
		console.log('🚀 ~ file: actions.ts:94 ~ error:', error);
	}
};

export const getAllAppointments = async () => {
	try {
		type AppointmentsFromDB = Models.DocumentList<
			Models.Document & CreateAppointmentParams
		>;
		const appointments: AppointmentsFromDB = await db.listDocuments(
			DATABASE_ID,
			APPOINTMENT_COLLECTION_ID
		);
		return appointments;
	} catch (error) {
		console.log(
			'🚀 ~ file: actions.ts:106 ~ getAllAppointments ~ error:',
			error
		);
	}
};

export const scheduleAppointment = async (data: ScheduleAppointmentParams) => {
	try {
		await db.updateDocument(
			DATABASE_ID,
			APPOINTMENT_COLLECTION_ID,
			data.appointmentId,
			{
				status: 'scheduled',
				primaryPhysician: data.primaryPhysician,
				schedule: data.schedule,
				notesFromAdmin: data.notesFromAdmin,
			}
		);
	} catch (error) {
		console.log(
			'🚀 ~ file: actions.ts:121 ~ scheduleAppointment ~ error:',
			error
		);
	}
};

export const cancelAppointment = async (data: CancelAppointmentParams) => {
	try {
		await db.updateDocument(
			DATABASE_ID,
			APPOINTMENT_COLLECTION_ID,
			data.appointmentId,
			{
				status: 'cancelled',
				cancelationReason: data.cancelationReason,
			}
		);
	} catch (error) {
		console.log(
			'🚀 ~ file: actions.ts:152 ~ cancelAppointment ~ error:',
			error
		);
	}
};

export type AppointmentFromDB = Models.Document & CreateAppointmentParams;
export const getAppointmentById = async (id: string) => {
	try {
		const appointment: AppointmentFromDB = await db.getDocument(
			DATABASE_ID,
			APPOINTMENT_COLLECTION_ID,
			id
		);
		return appointment;
	} catch (error) {
		console.log(
			'🚀 ~ file: actions.ts:168 ~ getAppointmentById ~ error:',
			error
		);
	}
};
