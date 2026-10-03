/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8088/api/';

function wait(delay: number) {
  const isDev = import.meta.env.DEV;
  if (!isDev) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, delay));
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null
): Promise<T> {
  const authToken = localStorage.getItem('authToken');
  const options: RequestInit = { method };

  if (authToken && !url.startsWith('auth/')) {
    options.headers = { Authorization: `Bearer ${authToken}` };
  }

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
  }

  return wait(0)
    .then(() => fetch(BASE_URL + url, options))
    .then(async (response) => {
      if (response.status === 401) {
        window.location.hash = '#/login';
        throw new Error('Неавторизований. Будь ласка, увійдіть до системи');
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join('\n'), {
            cause: { status: response.status, details: errorData }
          });
        }
        throw new Error(errorData.message || errorData.error || 'Помилка на сервері', {
          cause: { status: response.status, details: errorData }
        });
      }

      if (response.status === 204) {
        return null as T;
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        return response.json();
      }
      
      if (contentType?.includes('text/plain')) {
        return response.text();
      }
      return response.json();

    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  put: <T>(url: string, data: any) => request<T>(url, 'PUT', data),
  delete: (url: string) => request(url, 'DELETE'),
};
