import React from 'react';

/**
 * Shared Button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Shared Card component
 */
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 overflow-hidden">
      {children}
    </div>
  );
}
