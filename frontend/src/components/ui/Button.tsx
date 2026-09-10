import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button = ({ children, variant = 'primary', className = '', isLoading, disabled, ...props }: ButtonProps) => {
  const baseClasses = "flex items-center justify-center px-5 py-2.5 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-black hover:bg-primary-light shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] border border-transparent",
    secondary: "bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5",
    danger: "bg-danger text-white hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-transparent",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
      ) : null}
      {children}
    </button>
  );
};
