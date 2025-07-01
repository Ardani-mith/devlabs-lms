import React from 'react';
import { FormFieldProps } from '@/lib/types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  className = '',
  error,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-neutral-800/70 text-sm 
            ${Icon ? 'pl-11' : 'pl-4'} 
            ${error 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400' 
              : 'border-neutral-300 dark:border-neutral-700 focus:ring-brand-purple dark:focus:ring-purple-500'
            }
            focus:ring-2 focus:border-transparent 
            placeholder-neutral-400 dark:placeholder-neutral-500 
            text-neutral-900 dark:text-neutral-100 
            transition-shadow duration-200 focus:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField; 