import * as React from 'react';

const VARIANT_CLASS = {
  default: 'border-gray-200 bg-white text-gray-700 [&>svg]:text-gray-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-700',
};

function Alert({ className = '', variant = 'default', children, ...props }) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.default;

  return (
    <div
      role="alert"
      className={`relative w-full rounded-xl border px-4 py-3 [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function AlertTitle({ className = '', children, ...props }) {
  return (
    <h5 className={`mb-1 font-semibold leading-none tracking-tight text-gray-900 ${className}`} {...props}>
      {children}
    </h5>
  );
}

function AlertDescription({ className = '', children, ...props }) {
  return (
    <div className={`text-sm text-gray-600 leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Alert, AlertDescription, AlertTitle };
