import React from 'react';
import { ButtonProps } from '@/lib/types';

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl shadow-sm
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    dark:focus:ring-offset-neutral-900
    transition-all duration-300 ease-in-out transform hover:scale-105
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variantClasses = {
    primary: `
      text-white bg-gradient-to-r from-brand-purple to-purple-600 
      hover:from-purple-600 hover:to-purple-700 
      dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800
      focus:ring-purple-500 border border-transparent
    `,
    secondary: `
      text-brand-purple dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 
      hover:bg-purple-100 dark:hover:bg-purple-900/30
      focus:ring-purple-500 border border-purple-200 dark:border-purple-800
    `,
    outline: `
      text-brand-purple dark:text-purple-400 bg-transparent 
      hover:bg-purple-50 dark:hover:bg-purple-900/20
      focus:ring-purple-500 border border-brand-purple dark:border-purple-400
    `,
    ghost: `
      text-neutral-600 dark:text-neutral-300 bg-transparent 
      hover:bg-gray-100 dark:hover:bg-neutral-800
      focus:ring-gray-500 border border-transparent
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm h-9',
    md: 'px-4 py-2.5 text-sm h-10',
    lg: 'px-6 py-3.5 text-base h-12',
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 