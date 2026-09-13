export type PatientStatus = "Active" | "Monitoring" | "Recovered";
export type BookingStatus = "Pending" | "Confirmed" | "Admitted" | "Completed" | "Cancelled";

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
};

export type Patient = {
  id: string;
  bookingId?: string;
  bookingStatus?: BookingStatus;
  doctorId: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  phone: string;
  condition: string;
  status: PatientStatus;
  admittedAt?: string;
  updatedAt: string;
  appointmentAt?: string;
  visitCompletedAt?: string;
};

export type DoctorInput = Omit<Doctor, "id" | "createdAt">;
export type PatientInput = Omit<Patient, "id" | "bookingId" | "bookingStatus" | "updatedAt"> & {
  appointmentAt: string;
};

export type Booking = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentAt: string;
  admittedAt?: string;
  visitCompletedAt?: string;
  condition: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  patient: Pick<Patient, "id" | "name" | "age" | "gender" | "phone">;
  doctor: Pick<Doctor, "id" | "name" | "specialization" | "hospital">;
};

export type BookingInput = {
  patientId: string;
  doctorId: string;
  appointmentAt: string;
  admittedAt?: string | null;
  visitCompletedAt?: string | null;
  condition?: string | null;
  status: BookingStatus;
};
