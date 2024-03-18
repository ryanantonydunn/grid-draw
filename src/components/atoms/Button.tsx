import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ className, children, ...otherProps }: ButtonProps) {
  const classString = `bg-slate-600 hover:bg-slate-500 font-bold py-1 px-2 text-xs rounded ${className}`;
  return (
    <button className={classString} {...otherProps}>
      {children}
    </button>
  );
}
