import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function FormInput({ className, ...otherProps }: FormInputProps) {
  const classString = `bg-slate-600 py-1 px-2 text-xs text-white ${className}`;
  return <input className={classString} {...otherProps} />;
}
