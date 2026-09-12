import type { Doctor, Patient } from "./types";

export const initialDoctors: Doctor[] = [
  { id: "doc-1", name: "Dr. Samira Hasan", specialization: "Cardiology", hospital: "Central Medical Centre", phone: "+880 1711 204 810", email: "samira.hasan@centralmed.com", createdAt: "2026-09-08" },
  { id: "doc-2", name: "Dr. Arif Khan", specialization: "Neurology", hospital: "Northpoint Hospital", phone: "+880 1812 992 140", email: "arif.khan@northpoint.com", createdAt: "2026-08-22" },
  { id: "doc-3", name: "Dr. Nusrat Jahan", specialization: "Pediatrics", hospital: "Central Medical Centre", phone: "+880 1914 822 315", email: "nusrat.jahan@centralmed.com", createdAt: "2026-08-14" },
  { id: "doc-4", name: "Dr. Imran Chowdhury", specialization: "Orthopedics", hospital: "Green Life Hospital", phone: "+880 1610 503 612", email: "imran.c@greenlife.com", createdAt: "2026-07-30" },
  { id: "doc-5", name: "Dr. Farzana Ahmed", specialization: "Dermatology", hospital: "Northpoint Hospital", phone: "+880 1718 445 920", email: "farzana.ahmed@northpoint.com", createdAt: "2026-07-11" },
  { id: "doc-6", name: "Dr. Tareq Rahman", specialization: "Internal Medicine", hospital: "City Care Clinic", phone: "+880 1911 420 774", email: "tareq.rahman@citycare.com", createdAt: "2026-06-28" },
  { id: "doc-7", name: "Dr. Mehnaz Karim", specialization: "Endocrinology", hospital: "Green Life Hospital", phone: "+880 1819 300 567", email: "mehnaz.karim@greenlife.com", createdAt: "2026-06-05" },
  { id: "doc-8", name: "Dr. Faisal Noor", specialization: "Pulmonology", hospital: "City Care Clinic", phone: "+880 1713 980 445", email: "faisal.noor@citycare.com", createdAt: "2026-05-18" },
];

export const initialPatients: Patient[] = [
  { id: "pat-1", doctorId: "doc-1", name: "Amina Rahman", age: 46, gender: "Female", phone: "+880 1712 440 101", condition: "Hypertension", status: "Active", admittedAt: "2026-09-10", updatedAt: "2026-09-11", appointmentAt: "2026-09-13T09:30" },
  { id: "pat-2", doctorId: "doc-3", name: "Rafi Islam", age: 8, gender: "Male", phone: "+880 1811 502 712", condition: "Asthma", status: "Monitoring", admittedAt: "2026-09-09", updatedAt: "2026-09-10", appointmentAt: "2026-09-13T11:00" },
  { id: "pat-3", doctorId: "doc-2", name: "Jannat Sultana", age: 37, gender: "Female", phone: "+880 1912 693 889", condition: "Migraine", status: "Recovered", admittedAt: "2026-09-05", updatedAt: "2026-09-09" },
  { id: "pat-4", doctorId: "doc-6", name: "Hasan Mahmud", age: 58, gender: "Male", phone: "+880 1715 280 676", condition: "Diabetes", status: "Active", admittedAt: "2026-09-02", updatedAt: "2026-09-08", appointmentAt: "2026-09-14T14:15" },
  { id: "pat-5", doctorId: "doc-4", name: "Rashed Kabir", age: 63, gender: "Male", phone: "+880 1614 590 322", condition: "Arthritis", status: "Monitoring", admittedAt: "2026-08-29", updatedAt: "2026-09-07" },
  { id: "pat-6", doctorId: "doc-7", name: "Nadia Akter", age: 42, gender: "Female", phone: "+880 1813 721 449", condition: "Diabetes", status: "Active", admittedAt: "2026-08-24", updatedAt: "2026-09-06" },
  { id: "pat-7", doctorId: "doc-1", name: "Omar Faruk", age: 51, gender: "Male", phone: "+880 1915 332 908", condition: "Heart condition", status: "Monitoring", admittedAt: "2026-08-17", updatedAt: "2026-09-05", appointmentAt: "2026-09-14T10:45" },
  { id: "pat-8", doctorId: "doc-5", name: "Sadia Noor", age: 29, gender: "Female", phone: "+880 1718 462 712", condition: "Dermatitis", status: "Recovered", admittedAt: "2026-08-03", updatedAt: "2026-08-28" },
  { id: "pat-9", doctorId: "doc-8", name: "Kamrul Haque", age: 67, gender: "Male", phone: "+880 1816 928 103", condition: "Asthma", status: "Active", admittedAt: "2026-07-26", updatedAt: "2026-08-25" },
  { id: "pat-10", doctorId: "doc-3", name: "Maliha Ahmed", age: 12, gender: "Female", phone: "+880 1917 114 567", condition: "Allergy", status: "Recovered", admittedAt: "2026-07-15", updatedAt: "2026-08-17" },
  { id: "pat-11", doctorId: "doc-6", name: "Salman Bari", age: 34, gender: "Male", phone: "+880 1714 662 092", condition: "Hypertension", status: "Monitoring", admittedAt: "2026-06-23", updatedAt: "2026-08-10" },
  { id: "pat-12", doctorId: "doc-2", name: "Tanjina Alam", age: 41, gender: "Female", phone: "+880 1815 109 477", condition: "Migraine", status: "Active", admittedAt: "2026-06-08", updatedAt: "2026-08-04" },
  { id: "pat-13", doctorId: "doc-4", name: "Shakil Hossain", age: 55, gender: "Male", phone: "+880 1913 845 220", condition: "Fracture recovery", status: "Recovered", admittedAt: "2026-05-19", updatedAt: "2026-07-28" },
  { id: "pat-14", doctorId: "doc-7", name: "Lamia Zaman", age: 32, gender: "Female", phone: "+880 1716 237 855", condition: "Thyroid disorder", status: "Monitoring", admittedAt: "2026-05-05", updatedAt: "2026-07-20" },
  { id: "pat-15", doctorId: "doc-1", name: "Abdul Matin", age: 70, gender: "Male", phone: "+880 1818 409 133", condition: "Heart condition", status: "Active", admittedAt: "2026-04-21", updatedAt: "2026-07-15", appointmentAt: "2026-09-16T15:30" },
  { id: "pat-16", doctorId: "doc-8", name: "Rehana Yasmin", age: 49, gender: "Female", phone: "+880 1919 650 482", condition: "Asthma", status: "Monitoring", admittedAt: "2026-04-03", updatedAt: "2026-07-02" },
  { id: "pat-17", doctorId: "doc-6", name: "Nayeem Hasan", age: 38, gender: "Male", phone: "+880 1719 518 774", condition: "Diabetes", status: "Active", admittedAt: "2026-03-12", updatedAt: "2026-06-25" },
  { id: "pat-18", doctorId: "doc-5", name: "Rumana Islam", age: 27, gender: "Female", phone: "+880 1814 337 912", condition: "Dermatitis", status: "Recovered", admittedAt: "2026-03-01", updatedAt: "2026-06-10" },
];
