"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { accessApi, type AccessRole, type ManagedUser } from "@/access/api";

const PROTECTED_ROLE = "software_engineer";

export default function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const assignableRoles = useMemo(() => roles.filter((role) => role.name !== PROTECTED_ROLE), [roles]);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextUsers, nextRoles] = await Promise.all([accessApi.users(), accessApi.roles()]);
      setUsers(nextUsers);
      setRoles(nextRoles);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Users could not be loaded");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setSaving(true);
    setError("");
    try {
      const user = await accessApi.createUser({
        name: String(data.get("name")),
        email: String(data.get("email")),
        password: String(data.get("password")),
        roleIds: data.getAll("roleIds").map(Number),
      });
      setUsers((items) => [...items, user].sort((a, b) => a.name.localeCompare(b.name)));
      setCreating(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "User could not be created");
    } finally {
      setSaving(false);
    }
  }

  async function assign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const roleIds = new FormData(event.currentTarget).getAll("roleIds").map(Number);
    setSaving(true);
    setError("");
    try {
      const updated = await accessApi.setUserRoles(editing.id, roleIds);
      setUsers((items) => items.map((user) => user.id === updated.id ? updated : user));
      setEditing(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Roles could not be assigned");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="grid min-h-64 place-items-center"><span className="loading loading-spinner loading-lg text-primary" aria-label="Loading users" /></div>;

  return (
    <div className="space-y-6">
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex-row items-center justify-between gap-4 p-5 sm:p-7"><div><h2 className="card-title">System users</h2><p className="mt-1 text-sm text-base-content/55">Add staff accounts and assign their roles.</p></div><button type="button" className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>+ Add user</button></div>
      </section>
      {error && <div className="alert alert-error"><span>{error}</span><button type="button" className="btn btn-sm" onClick={() => void load()}>Retry</button></div>}
      <section className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto"><table className="table table-zebra"><thead><tr><th>User</th><th>Roles</th><th>Effective powers</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
          {users.map((user) => {
            const protectedUser = user.roleNames.includes(PROTECTED_ROLE);
            return <tr key={user.id}><td><div><strong className="block">{user.name}</strong><small className="text-base-content/50">{user.email}</small></div></td><td><div className="flex flex-wrap gap-1">{user.roleNames.length ? user.roleNames.map((role) => <span className="badge badge-outline badge-sm" key={role}>{pretty(role)}</span>) : <span className="text-xs text-base-content/45">No role</span>}</div></td><td><span className="badge badge-ghost">{user.permissions.length} permissions</span></td><td><span className={`badge badge-sm ${user.isActive ? "badge-success" : "badge-error"}`}>{user.isActive ? "Active" : "Inactive"}</span></td><td><button type="button" className="btn btn-ghost btn-sm" disabled={protectedUser} onClick={() => setEditing(user)}>Assign roles</button></td></tr>;
          })}
        </tbody></table></div>
      </section>
      {!users.length && <div className="text-center text-sm text-base-content/50">No users found.</div>}

      {creating && <div className="modal modal-open" role="presentation"><div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="add-user-title"><h2 id="add-user-title" className="text-xl font-bold">Add system user</h2><p className="mt-1 text-sm text-base-content/55">Create a login and choose the user’s initial roles.</p><form className="mt-6 space-y-4" onSubmit={create}><label className="fieldset"><span className="fieldset-legend">Full name *</span><input className="input input-bordered w-full" name="name" required /></label><label className="fieldset"><span className="fieldset-legend">Email *</span><input className="input input-bordered w-full" name="email" type="email" required /></label><label className="fieldset"><span className="fieldset-legend">Temporary password *</span><input className="input input-bordered w-full" name="password" type="password" minLength={8} autoComplete="new-password" required /></label><RoleChoices roles={assignableRoles} /><div className="modal-action"><button type="button" className="btn btn-ghost" disabled={saving} onClick={() => setCreating(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Creating…" : "Create user"}</button></div></form></div><button type="button" className="modal-backdrop" onClick={() => setCreating(false)}>close</button></div>}
      {editing && <div className="modal modal-open" role="presentation"><div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="assign-role-title"><h2 id="assign-role-title" className="text-xl font-bold">Assign roles</h2><p className="mt-1 text-sm text-base-content/55">Choose roles for {editing.name}. Powers are inherited from every selected role.</p><form className="mt-6" onSubmit={assign}><RoleChoices roles={assignableRoles} selected={new Set(editing.roleNames)} /><div className="modal-action"><button type="button" className="btn btn-ghost" disabled={saving} onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save assignments"}</button></div></form></div><button type="button" className="modal-backdrop" onClick={() => setEditing(null)}>close</button></div>}
    </div>
  );
}

function RoleChoices({ roles, selected = new Set<string>() }: { roles: AccessRole[]; selected?: Set<string> }) {
  return <fieldset className="rounded-box border border-base-300 p-4"><legend className="px-2 text-sm font-bold">Roles</legend><div className="grid gap-2 sm:grid-cols-2">{roles.map((role) => <label key={role.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-base-200"><input className="checkbox checkbox-primary checkbox-sm" type="checkbox" name="roleIds" value={role.id} defaultChecked={selected.has(role.name)} /><span><strong className="block text-sm">{pretty(role.name)}</strong><small className="text-base-content/45">{role.permissions.length} powers</small></span></label>)}</div>{!roles.length && <p className="text-sm text-base-content/50">Create an assignable role first.</p>}</fieldset>;
}

function pretty(value: string) { return value.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
