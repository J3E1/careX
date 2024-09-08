declare type Gender = 'Male' | 'Female' | 'Other';
declare type AppointmentStatus = 'pending' | 'scheduled' | 'cancelled';

declare interface CreateUserParams {
	username: string;
	email: string;
	phone: string;
}
declare interface User extends CreateUserParams {
	$id: string;
}

declare interface RegisterUserParam {
	userId: string;
	birthDate: Date;
	gender: Gender;
	address: string;
	occupation: string;
	emergencyContactName: string;
	emergencyContactNumber: string;
	primaryPhysician: string;
	insuranceProvider: string;
	insurancePolicyNumber: string;
	allergies?: string;
	currentMedication?: string;
	familyMedicalHistory?: string;
	pastMedicalHistory?: string;
	identificationType?: string;
	identificationNumber?: string;
	// identificationDocument: File[] | null;
	privacyConsent: boolean;
	disclosureConsent: boolean;
	treatmentConsent: boolean;
}

declare type CreateAppointmentParams = {
	userId: string;
	patient: string;
	primaryPhysician: string;
	appointmentReason: string;
	schedule: Date;
	status: Status;
	note?: string | null;
};

declare type ScheduleAppointmentParams = {
	primaryPhysician: string;
	schedule: Date;
	notesFromAdmin?: string;
	appointmentId: string;
};
declare type CancelAppointmentParams = {
	cancelationReason: string;
	appointmentId: string;
};

declare type Appointment = {
	appointmentId: string;
	userId: string;
	patient: string;
	schedule: Date;
	status: AppointmentStatus;
	primaryPhysician: string;
	appointmentReason: string;
	note?: string | null;
	cancellationReason?: string;
	notesFromAdmin?: string;
};
