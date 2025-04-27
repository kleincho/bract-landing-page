import React from 'react';

function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200';
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600',
    secondary: 'bg-sky-50 text-sky-600 hover:bg-sky-100',
    ghost: 'hover:bg-sky-50 text-gray-600',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
