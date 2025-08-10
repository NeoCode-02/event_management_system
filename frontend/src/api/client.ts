export class ApiError extends Error {
  status: number;
  payload?: any;
  constructor(status: number, message: string, payload?: any) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

const DEFAULT_TIMEOUT_MS = 15000;

async function request<T>(method: string, url: string, body?: unknown, token?: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(`/api${url}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      const message = await extractErrorMessage(res);
      throw new ApiError(res.status, message);
    }
    if (res.status === 204) return undefined as unknown as T;
    return res.json();
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new ApiError(0, 'Request timed out');
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, err?.message || 'Network error');
  } finally {
    clearTimeout(timeout);
  }
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((d: any) => d.msg || d.message).filter(Boolean).join(', ');
    }
    return res.statusText;
  } catch {
    return res.statusText;
  }
}

export const api = {
  get: <T,>(url: string, token?: string) => request<T>('GET', url, undefined, token),
  post: <T,>(url: string, body?: unknown, token?: string) => request<T>('POST', url, body, token),
  put: <T,>(url: string, body?: unknown, token?: string) => request<T>('PUT', url, body, token),
  del: <T,>(url: string, token?: string) => request<T>('DELETE', url, undefined, token),
};


