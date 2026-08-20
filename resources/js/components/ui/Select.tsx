import React, { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], helperText, className, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'block w-full rounded-lg border text-sm transition-colors py-2 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-400',
            props.disabled && 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200',
            className
          )}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
