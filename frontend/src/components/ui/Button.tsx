import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  pill?: boolean;
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading, disabled, pill, ...props }: ButtonProps) => {
  const base = "inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-[15px]",
    lg: "px-8 py-3.5 text-base",
  };

  const radius = pill ? 'rounded-full' : 'rounded-[12px]';

  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
    secondary: "bg-transparent text-text-secondary border border-border-light hover:bg-bg-light hover:text-text-primary",
    danger: "bg-danger text-white hover:bg-red-600",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-light",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${radius} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>}
      {children}
    </button>
  );
};
