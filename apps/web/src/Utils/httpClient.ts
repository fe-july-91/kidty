/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8088/api/';

function wait(delay: number) {
  const isDev = import.meta.env.DEV;
  if (!isDev) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, delay));
}

type ApiError = {
  code?: string;
  message?: string;
  errors?: { field: string; code: string }[];
};

/** Turns an API error body into a message in the current language. */
function apiErrorMessage({ code, message, errors }: ApiError) {
  const translate = (key: string, fallback?: string) =>
    i18n.t(`apiErrors.${key}`, { defaultValue: fallback ?? i18n.t('apiErrors.invalid') });

  if (errors?.length) {
    return [...new Set(errors.map((e) => translate(e.code)))].join('\n');
  }
  return code ? translate(code, message) : message || i18n.t('errors.server');
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null
): Promise<T> {
  // The session is an httpOnly cookie, so it has to travel with every
  // request. Accept-Language picks the language of emails the API sends.
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: { 'Accept-Language': i18n.language },
  };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
  }

  return wait(0)
    .then(() => fetch(BASE_URL + url, options))
    .catch(() => {
      throw new Error(i18n.t('errors.network'));
    })
    .then(async (response) => {
      // A 401 from auth/* (e.g. a wrong password) is a normal form error, and
      // account/me just reports "not logged in"; elsewhere the session expired.
      if (response.status === 401 && !url.startsWith('auth/') && url !== 'account/me') {
        window.location.hash = '#/login';
        throw new Error(i18n.t('errors.unauthorized'));
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(apiErrorMessage(errorData), {
          cause: { status: response.status, details: errorData },
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
