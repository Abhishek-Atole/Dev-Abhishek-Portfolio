import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children }) => {
  const baseStyles = 'inline-flex items-center px-2 py-1 rounded text-sm font-medium';
  const variantStyles = {
    default: 'bg-primary text-white',
    outline: 'border border-primary text-primary',
    secondary: 'bg-secondary text-white',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;