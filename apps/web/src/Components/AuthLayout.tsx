import React from 'react';

type Props = { title: string; subtitle?: string; children: React.ReactNode };

/** Centred card used by the log in, sign up and password pages. */
export const AuthLayout: React.FC<Props> = ({ title, subtitle, children }) => (
  <div className="flex min-h-[calc(100vh-96px)] items-start justify-center bg-canvas px-4 py-10 text-ink md:items-center lg:min-h-[calc(100vh-120px)]">
    <div className="grid w-full max-w-[400px] gap-5 rounded-[22px] bg-white p-6 shadow-card md:p-8">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-2">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

export const FormError: React.FC<{ message: string }> = ({ message }) =>
  message ? (
    <p role="alert" className="whitespace-pre-line rounded-xl bg-danger-100 px-4 py-3 text-sm text-danger-700">
      {message}
    </p>
  ) : null;

export const FormNotice: React.FC<{ message: string }> = ({ message }) => (
  <p role="status" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
    {message}
  </p>
);
