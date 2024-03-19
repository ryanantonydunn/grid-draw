import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ className, children, ...otherProps }: ButtonProps) {
  const enabledStyle = "bg-slate-600 hover:bg-slate-500 text-white";
  const disabledStyle = "bg-slate-700 text-slate-500";
  const sharedStyle = "font-bold py-1 px-2 text-xs rounded";
  const classString = `${sharedStyle} ${otherProps.disabled ? disabledStyle : enabledStyle} ${className}`;
  return (
    <button className={classString} {...otherProps}>
      {children}
    </button>
  );
}
