import React from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function FormSelect({ className, children, ...otherProps }: FormSelectProps) {
  const classString = `bg-slate-600 py-1 px-2 text-xs text-white ${className}`;
  return (
    <select className={classString} {...otherProps}>
      {children}
    </select>
  );
}
