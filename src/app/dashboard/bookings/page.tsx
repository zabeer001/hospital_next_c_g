"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { hospitalApi } from "@/dashboard/api";
import { useDashboard } from "@/dashboard/dashboard-provider";
import { DoctorForm, PatientForm } from "@/dashboard/forms";
import type { Booking, BookingInput, BookingStatus } from "@/dashboard/types";
import { BookingStatusBadge, ConfirmDialog, EmptyState, Overlay, Pagination } from "@/dashboard/ui";

const PAGE_SIZE = 8;
const STATUSES: BookingStatus[] = ["Pending", "Confirmed", "Admitted", "Completed", "Cancelled"];

export default function BookingsPage() {
  const { doctors, patients, addDoctor, addPatient, notify, refresh } = useDashboard();
  const { can } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [doctorId, setDoctorId] = useState("All doctors");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [creatingDoctor, setCreatingDoctor] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try { setBookings(await hospitalApi.getBookings()); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Bookings could not be loaded"); }
    finally { if (showLoading) setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => bookings.filter((booking) => {
    const text = `${booking.patient.name} ${booking.patient.phone} ${booking.doctor.name} ${booking.condition}`.toLowerCase();
    const day = booking.appointmentAt.slice(0, 10);
    return text.includes(query.toLowerCase())
      && (status === "All statuses" || booking.status === status)
      && (doctorId === "All doctors" || booking.doctorId === doctorId)
      && (!from || day >= from)
      && (!to || day <= to);
  }), [bookings, doctorId, from, query, status, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const setFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };

  async function save(input: BookingInput, id?: string) {
    setPending(true);
    setError("");
    try {
      const booking = id ? await hospitalApi.updateBooking(id, input) : await hospitalApi.createBooking(input);
      setBookings((items) => id ? items.map((item) => item.id === id ? booking : item) : [booking, ...items]);
      notify(id ? "Booking updated successfully" : "Booking created successfully");
      void refresh();
      return true;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Booking could not be saved";
      setError(message); notify(message, "error"); return false;
    } finally { setPending(false); }
  }

  async function remove() {
    if (!deleting) return;
    setPending(true);
    try {
      await hospitalApi.deleteBooking(deleting.id);
      setBookings((items) => items.filter((item) => item.id !== deleting.id));
      notify("Booking deleted successfully"); setDeleting(null);
      void refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Booking could not be deleted";
      setError(message); notify(message, "error");
    } finally { setPending(false); }
  }

  async function cancel(booking: Booking) {
    setPending(true);
    setError("");
    try {
      const updated = await hospitalApi.updateBooking(booking.id, { status: "Cancelled" });
      setBookings((items) => items.map((item) => item.id === booking.id ? updated : item));
      notify("Booking cancelled successfully");
      void refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Booking could not be cancelled";
      setError(message); notify(message, "error");
    } finally { setPending(false); }
  }

  if (loading) return <div className="grid min-h-64 place-items-center"><span className="loading loading-spinner loading-lg text-primary" aria-label="Loading bookings" /></div>;

  return <>
    {error && <div className="alert alert-error mb-5"><span>{error}</span><button type="button" className="btn btn-sm" onClick={() => void load()}>Retry</button></div>}
    <section className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
      <header className="flex flex-col gap-4 border-b border-base-300 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div><h2 className="card-title text-xl">Appointment bookings</h2><p className="mt-1 text-sm text-base-content/55">Schedule and manage every patient visit in one place.</p></div>
        {can("bookings.create") && <button type="button" className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>+ New booking</button>}
      </header>
      <div className="grid gap-3 border-b border-base-300 bg-base-200/45 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:px-6">
        <label className="input input-bordered flex items-center gap-2 bg-base-100 lg:col-span-2"><span aria-hidden="true">⌕</span><input className="grow" value={query} onChange={(event) => setFilter(setQuery)(event.target.value)} placeholder="Patient, doctor, condition…" aria-label="Search bookings" /></label>
        <select className="select select-bordered w-full bg-base-100" value={status} onChange={(event) => setFilter(setStatus)(event.target.value)} aria-label="Filter booking status"><option>All statuses</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="select select-bordered w-full bg-base-100" value={doctorId} onChange={(event) => setFilter(setDoctorId)(event.target.value)} aria-label="Filter doctor"><option>All doctors</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}</select>
        <button type="button" className="btn btn-ghost" onClick={() => { setQuery(""); setStatus("All statuses"); setDoctorId("All doctors"); setFrom(""); setTo(""); setPage(1); }}>Clear filters</button>
        <label className="fieldset sm:col-span-1"><span className="fieldset-legend">From</span><input className="input input-bordered w-full bg-base-100" type="date" value={from} onChange={(event) => setFilter(setFrom)(event.target.value)} /></label>
        <label className="fieldset sm:col-span-1"><span className="fieldset-legend">To</span><input className="input input-bordered w-full bg-base-100" type="date" value={to} onChange={(event) => setFilter(setTo)(event.target.value)} /></label>
      </div>
      {visible.length ? <>
        <div className="overflow-x-auto"><table className="table table-zebra"><thead><tr><th>Patient</th><th>Doctor</th><th>Appointment</th><th>Condition</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map((booking) => <tr key={booking.id}>
          <td><strong className="block">{booking.patient.name}</strong><small className="text-base-content/50">{booking.patient.phone || `Patient #${booking.patientId}`}</small></td>
          <td><strong className="block text-sm">{booking.doctor.name}</strong><small className="text-base-content/50">{booking.doctor.specialization}</small></td>
          <td><time dateTime={booking.appointmentAt}>{formatDateTime(booking.appointmentAt)}</time></td>
          <td><span className="line-clamp-2 max-w-56 text-sm">{booking.condition || "—"}</span></td>
          <td><BookingStatusBadge status={booking.status} /></td>
          <td><div className="flex justify-end gap-1">{can("bookings.update") && <><button type="button" className="btn btn-ghost btn-xs" disabled={pending} onClick={() => setEditing(booking)}>Edit</button>{booking.status !== "Cancelled" && <button type="button" className="btn btn-ghost btn-xs text-error" disabled={pending} onClick={() => void cancel(booking)}>Cancel</button>}</>}{can("bookings.delete") && <button type="button" className="btn btn-ghost btn-xs" disabled={pending} onClick={() => setDeleting(booking)}>Delete</button>}</div></td>
        </tr>)}</tbody></table></div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 p-4 sm:flex-row sm:px-6"><p className="text-xs text-base-content/55">Showing {visible.length} of {filtered.length} bookings</p><Pagination page={currentPage} pages={pages} onChange={setPage} /></div>
      </> : <EmptyState title="No bookings found" text="Try widening your search or clearing the current filters." onReset={() => { setQuery(""); setStatus("All statuses"); setDoctorId("All doctors"); setFrom(""); setTo(""); }} />}
    </section>

    <Overlay open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} title={editing ? "Edit booking" : "Create booking"} description="Choose the patient, clinician, appointment time, and current status." variant="drawer">
      <div className="p-5 sm:p-6"><BookingForm booking={editing || undefined} patients={patients} doctors={doctors} pending={pending} canCreatePatient={can("patients.create")} canCreateDoctor={can("doctors.create")} onCreatePatient={() => setCreatingPatient(true)} onCreateDoctor={() => setCreatingDoctor(true)} onCancel={() => { setCreating(false); setEditing(null); }} onSubmit={async (input) => { const saved = await save(input, editing?.id); if (saved) { setCreating(false); setEditing(null); } }} /></div>
    </Overlay>
    <Overlay open={creatingPatient} onClose={() => setCreatingPatient(false)} title="Add a new patient" description="Create the patient, then select them in the booking form.">
      <PatientForm doctors={doctors} onCancel={() => setCreatingPatient(false)} onSubmit={async (input) => {
        const saved = await addPatient(input);
        if (saved) {
          await load(false);
          setCreatingPatient(false);
        }
        return saved;
      }} />
    </Overlay>
    <Overlay open={creatingDoctor} onClose={() => setCreatingDoctor(false)} title="Add a new doctor" description="Create the clinician, then select them in the booking form.">
      <DoctorForm onCancel={() => setCreatingDoctor(false)} onSubmit={async (input) => { const saved = await addDoctor(input); if (saved) setCreatingDoctor(false); return saved; }} />
    </Overlay>
    <ConfirmDialog open={Boolean(deleting)} title="Delete booking?" text={`${deleting?.patient.name || "This patient"}’s appointment record will be permanently removed.`} pending={pending} confirmLabel="Delete booking" onCancel={() => setDeleting(null)} onConfirm={() => void remove()} />
  </>;
}

function BookingForm({ booking, patients, doctors, pending, canCreatePatient, canCreateDoctor, onCreatePatient, onCreateDoctor, onCancel, onSubmit }: { booking?: Booking; patients: ReturnType<typeof useDashboard>["patients"]; doctors: ReturnType<typeof useDashboard>["doctors"]; pending: boolean; canCreatePatient: boolean; canCreateDoctor: boolean; onCreatePatient(): void; onCreateDoctor(): void; onCancel(): void; onSubmit(input: BookingInput): void }) {
  const [patientId, setPatientId] = useState(booking?.patientId || "");
  const [doctorId, setDoctorId] = useState(booking?.doctorId || "");
  const [selectionError, setSelectionError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (!patientId || !doctorId) {
      setSelectionError("Select both a patient and a doctor from the search results.");
      return;
    }
    const data = new FormData(event.currentTarget);
    onSubmit({
      patientId, doctorId,
      appointmentAt: new Date(String(data.get("appointmentAt"))).toISOString(),
      admittedAt: optionalDate(data.get("admittedAt")), visitCompletedAt: optionalDate(data.get("visitCompletedAt")),
      condition: String(data.get("condition")).trim() || null, status: String(data.get("status")) as BookingStatus,
    });
  }
  return <form onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2">
    <SearchableBookingSelect
      label="Patient"
      value={patientId}
      onChange={(value) => { setPatientId(value); setSelectionError(""); }}
      canCreate={canCreatePatient}
      onCreate={onCreatePatient}
      placeholder="Search patient name or phone"
      emptyText="No patients match that search."
      options={patients.map((patient) => ({
        value: patient.id,
        label: patient.name,
        details: patient.phone || `Patient #${patient.id}`,
        searchText: `${patient.name} ${patient.phone}`,
      }))}
    />
    <SearchableBookingSelect
      label="Doctor"
      value={doctorId}
      onChange={(value) => { setDoctorId(value); setSelectionError(""); }}
      canCreate={canCreateDoctor}
      onCreate={onCreateDoctor}
      placeholder="Search doctor name, phone or email"
      emptyText="No doctors match that search."
      options={doctors.map((doctor) => ({
        value: doctor.id,
        label: doctor.name,
        details: [doctor.specialization, doctor.phone, doctor.email].filter(Boolean).join(" · "),
        searchText: `${doctor.name} ${doctor.specialization} ${doctor.phone} ${doctor.email}`,
      }))}
    />
    {selectionError && <div className="alert alert-error py-2 text-sm sm:col-span-2" role="alert">{selectionError}</div>}
    <BookingField name="appointmentAt" label="Appointment" type="datetime-local" value={localDateTime(booking?.appointmentAt)} required />
    <BookingSelect name="status" label="Status" value={booking?.status || "Pending"} options={STATUSES.map((item) => ({ value: item, label: item }))} />
    <BookingField name="admittedAt" label="Admitted at" type="datetime-local" value={localDateTime(booking?.admittedAt)} />
    <BookingField name="visitCompletedAt" label="Visit completed at" type="datetime-local" value={localDateTime(booking?.visitCompletedAt)} />
    <label className="fieldset sm:col-span-2"><span className="fieldset-legend font-semibold">Condition</span><textarea className="textarea textarea-bordered min-h-24 w-full bg-base-100" name="condition" maxLength={180} defaultValue={booking?.condition} placeholder="Reason for the appointment" /></label>
  </div><div className="mt-6 flex justify-end gap-2 border-t border-base-300 pt-4"><button type="button" className="btn btn-ghost" disabled={pending} onClick={onCancel}>Cancel</button><button type="submit" className="btn btn-primary" disabled={pending}>{pending && <span className="loading loading-spinner loading-xs" />}{pending ? "Saving…" : booking ? "Save changes" : "Create booking"}</button></div></form>;
}

function BookingField({ name, label, type, value, required = false }: { name: string; label: string; type: string; value?: string; required?: boolean }) {
  return <label className="fieldset"><span className="fieldset-legend font-semibold">{label}{required && <span className="text-error"> *</span>}</span><input className="input input-bordered w-full bg-base-100" name={name} type={type} defaultValue={value} required={required} /></label>;
}
function BookingSelect({ name, label, value = "", options }: { name: string; label: string; value?: string; options: Array<{ value: string; label: string }> }) {
  return <label className="fieldset"><span className="fieldset-legend font-semibold">{label}<span className="text-error"> *</span></span><select className="select select-bordered w-full bg-base-100" name={name} defaultValue={value} required><option value="" disabled>Select {label.toLowerCase()}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

type SearchOption = {
  value: string;
  label: string;
  details: string;
  searchText: string;
};

function SearchableBookingSelect({
  label,
  value,
  options,
  placeholder,
  emptyText,
  canCreate,
  onCreate,
  onChange,
}: {
  label: string;
  value: string;
  options: SearchOption[];
  placeholder: string;
  emptyText: string;
  canCreate: boolean;
  onCreate(): void;
  onChange(value: string): void;
}) {
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label || "");
  const [open, setOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const matches = options.filter((option) =>
    !normalizedQuery || option.searchText.toLowerCase().includes(normalizedQuery),
  );

  function choose(option: SearchOption) {
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
  }

  return (
    <div
      className="fieldset relative"
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setQuery(selected?.label || "");
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <label className="fieldset-legend font-semibold" htmlFor={`booking-${label.toLowerCase()}`}>
          {label}<span className="text-error"> *</span>
        </label>
        {canCreate && (
          <button
            type="button"
            className="btn btn-primary btn-xs"
            aria-label={`Add ${label.toLowerCase()}`}
            onClick={() => { setOpen(false); onCreate(); }}
          >
            + Add
          </button>
        )}
      </div>
      <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
        <span aria-hidden="true">⌕</span>
        <input
          id={`booking-${label.toLowerCase()}`}
          className="grow"
          value={query}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={`booking-${label.toLowerCase()}-options`}
          autoComplete="off"
          onFocus={(event) => event.currentTarget.select()}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange("");
            setOpen(true);
          }}
        />
        {selected && <span className="badge badge-success badge-sm">Selected</span>}
      </label>
      {open && (
        <div id={`booking-${label.toLowerCase()}-options`} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-xl">
          {matches.length ? matches.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-base-200 ${option.value === value ? "bg-primary/10" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="mt-0.5 text-xs text-base-content/55">{option.details}</span>
            </button>
          )) : <p className="px-3 py-4 text-center text-sm text-base-content/55">{emptyText}</p>}
        </div>
      )}
    </div>
  );
}
function optionalDate(value: FormDataEntryValue | null) { const text = String(value || ""); return text ? new Date(text).toISOString() : null; }
function localDateTime(value?: string) { if (!value) return undefined; const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16); }
function formatDateTime(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
