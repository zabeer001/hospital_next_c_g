export type PatientStatus = "Active" | "Monitoring" | "Recovered";

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
  doctorId: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  phone: string;
  condition: string;
  status: PatientStatus;
  admittedAt: string;
  updatedAt: string;
  appointmentAt?: string;
  visitCompletedAt?: string;
};

export type DoctorInput = Omit<Doctor, "id" | "createdAt">;
export type PatientInput = Omit<Patient, "id" | "updatedAt">;
