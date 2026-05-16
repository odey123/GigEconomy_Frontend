const BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ??
  'https://gigeconomy-backend.onrender.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: string }).message)
        : `Request failed (${status})`,
    );
    this.name = 'ApiError';
  }
}

function getToken() {
  return localStorage.getItem('access_token');
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const init: RequestInit = {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  };

  let res = await fetch(`${BASE_URL}${path}`, init);

  // Silently refresh on 401 and retry once
  if (res.status === 401) {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (refreshRes.ok) {
        // Backend returns { status, data: { token, refreshToken } }
        const json = await refreshRes.json();
        const newToken: string = json?.data?.token ?? json?.token;
        localStorage.setItem('access_token', newToken);
        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
      } else {
        ['access_token', 'refresh_token', 'user'].forEach(k => localStorage.removeItem(k));
        window.location.href = '/login';
        throw new ApiError(401, { message: 'Session expired' });
      }
    } else {
      ['access_token', 'refresh_token', 'user'].forEach(k => localStorage.removeItem(k));
      window.location.href = '/login';
      throw new ApiError(401, { message: 'Not authenticated' });
    }
  }

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  upload: <T>(path: string, formData: FormData) => request<T>('POST', path, formData),
};
