const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

const SESSION_KEY = "doctor-tracker-auth";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roleNames: string[];
  permissions: string[];
};

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

type SignInResponse = AuthSession & { user: AuthUser };
type Envelope<T> = { data: T };
type ApiErrorBody = { error?: { message?: string; details?: Record<string, string[]> } };

export class ApiRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function browserStorage() {
  if (typeof window === "undefined") return null;
  return { local: window.localStorage, session: window.sessionStorage };
}

export function getAuthSession(): AuthSession | null {
  const storage = browserStorage();
  if (!storage) return null;
  const value = storage.session.getItem(SESSION_KEY) || storage.local.getItem(SESSION_KEY);
  if (!value) return null;
  try {
    const session = JSON.parse(value) as Partial<AuthSession>;
    if (typeof session.accessToken !== "string" || typeof session.refreshToken !== "string") throw new Error("Invalid session");
    return session as AuthSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession, remember: boolean) {
  const storage = browserStorage();
  if (!storage) return;
  storage.local.removeItem(SESSION_KEY);
  storage.session.removeItem(SESSION_KEY);
  (remember ? storage.local : storage.session).setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  const storage = browserStorage();
  storage?.local.removeItem(SESSION_KEY);
  storage?.session.removeItem(SESSION_KEY);
}

function expireAuthSession() {
  clearAuthSession();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("doctor-tracker-auth-expired"));
}

function updateAuthSession(session: AuthSession) {
  const storage = browserStorage();
  if (!storage) return;
  const persistent = storage.local.getItem(SESSION_KEY) !== null;
  saveAuthSession(session, persistent);
}

async function errorFrom(response: Response) {
  const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
  const details = body.error?.details ? Object.values(body.error.details).flat().join(" ") : "";
  return new ApiRequestError(details || body.error?.message || `Request failed (${response.status})`, response.status);
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) throw await errorFrom(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

let refreshRequest: Promise<AuthSession> | null = null;

async function refreshSession(): Promise<AuthSession> {
  if (refreshRequest) return refreshRequest;
  const current = getAuthSession();
  if (!current) throw new ApiRequestError("Authentication required", 401);

  refreshRequest = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
  })
    .then((response) => parse<Envelope<AuthSession>>(response))
    .then(({ data }) => {
      updateAuthSession(data);
      return data;
    })
    .catch((error) => {
      expireAuthSession();
      throw error;
    })
    .finally(() => { refreshRequest = null; });

  return refreshRequest;
}

function headersWithAuth(init: RequestInit, accessToken: string) {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);
  return headers;
}

export async function authenticatedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = getAuthSession();
  if (!session) throw new ApiRequestError("Authentication required", 401);

  let response = await fetch(`${API_URL}${path}`, { ...init, headers: headersWithAuth(init, session.accessToken) });
  if (response.status === 401) {
    const refreshed = await refreshSession();
    response = await fetch(`${API_URL}${path}`, { ...init, headers: headersWithAuth(init, refreshed.accessToken) });
    if (response.status === 401) expireAuthSession();
  }
  return parse<T>(response);
}

export const authApi = {
  async signIn(email: string, password: string, remember: boolean) {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const { data } = await parse<Envelope<SignInResponse>>(response);
    const { user, ...session } = data;
    saveAuthSession(session, remember);
    return user;
  },
  profile: () => authenticatedRequest<Envelope<AuthUser>>("/auth/profile").then(({ data }) => data),
  async changePassword(currentPassword: string, password: string, passwordConfirmation: string) {
    await authenticatedRequest<void>("/auth/profile/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, password, passwordConfirmation }),
    });
    clearAuthSession();
  },
  async signOut() {
    try {
      await authenticatedRequest<void>("/auth/signout", { method: "POST" });
    } finally {
      clearAuthSession();
    }
  },
};
