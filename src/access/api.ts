import { authenticatedRequest } from "@/auth/client";

type Envelope<T> = { data: T };

export type AccessRole = {
  id: number;
  name: string;
  description: string | null;
  userCount: number;
  permissions: string[];
};

export type PermissionOption = {
  id: number;
  name: string;
  description: string | null;
};

export type ManagedUser = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roleNames: string[];
  permissions: string[];
};

export const accessApi = {
  roles: () => authenticatedRequest<Envelope<AccessRole[]>>("/roles").then(({ data }) => data),
  permissions: () => authenticatedRequest<Envelope<PermissionOption[]>>("/permissions").then(({ data }) => data),
  createRole: (input: { name: string; description: string; permissionIds: number[] }) => authenticatedRequest<Envelope<AccessRole>>("/roles", { method: "POST", body: JSON.stringify(input) }),
  updateRole: (id: number, input: { name: string; description: string; permissionIds: number[] }) => authenticatedRequest<Envelope<AccessRole>>(`/roles/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteRole: (id: number) => authenticatedRequest<void>(`/roles/${id}`, { method: "DELETE" }),
  users: () => authenticatedRequest<Envelope<ManagedUser[]>>("/users").then(({ data }) => data),
  createUser: (input: { name: string; email: string; password: string; roleIds: number[] }) => authenticatedRequest<Envelope<ManagedUser>>("/users", { method: "POST", body: JSON.stringify(input) }).then(({ data }) => data),
  setUserRoles: (id: number, roleIds: number[]) => authenticatedRequest<Envelope<ManagedUser>>(`/users/${id}/roles`, { method: "PATCH", body: JSON.stringify({ roleIds }) }).then(({ data }) => data),
};
