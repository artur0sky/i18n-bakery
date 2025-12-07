import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'secondary', className = '', ...props }) => {
  const baseStyles = "px-3 py-1 rounded cursor-pointer transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 focus:ring-gray-400",
    outline: "bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-50 focus:ring-gray-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
