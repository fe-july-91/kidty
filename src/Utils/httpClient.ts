/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'http://localhost:8088/api/';

function wait(delay: number) {
  const isDev = process.env.NODE_ENV === 'development';
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
    .then((response) => {
      if (response.status === 401) {
        window.location.href = 'kidty#/login';
        throw new Error('Неавторизований. Будь ласка, увійдіть до системи');
      }

      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || error.error || 'Помилка на сервері');
        });
      }

      if (response.status === 204) {
        return null as T;
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        return null as T;
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

export async function getChildInfo(id: number, parametr: string) {
  const currentToken = localStorage.getItem('authToken');

  if (!currentToken) {
    throw new Error('Щось пішло не так. Необхідно знову авторизуватися');
  }

  if (!id || !parametr) {
    throw new Error('Неправильні параметри запиту');
  }

  const url = `${BASE_URL}children/${id}/${encodeURIComponent(parametr)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${currentToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
