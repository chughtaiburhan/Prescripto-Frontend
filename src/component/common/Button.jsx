import React from 'react';

const Button = ({
  text,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  children,
}) => {
  const baseClasses = 'cursor-pointer transition-all duration-300 font-medium rounded-full';

  const variantClasses = {
    primary: 'bg-[#5f6FFF] text-white hover:bg-[#4f5fef] hover:-translate-y-0.5',
    secondary: 'bg-blue-50 text-gray-600 hover:bg-blue-100 hover:-translate-y-0.5',
    outline: 'border border-gray-300 text-gray-600 hover:bg-[#5f6FFF] hover:text-white hover:border-[#5f6FFF]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-12 py-4 text-xl',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
    >
      {text || children}
    </button>
  );
};

export default Button;
