import React from "react";
import { colorHues } from "../../store/types";

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

interface FormSelectColorProps extends Omit<FormSelectProps, "children"> {}

export function FormSelectColor(props: FormSelectColorProps) {
  return (
    <FormSelect {...props}>
      {colorHues.map((hue) => (
        <option key={hue} value={hue}>
          {hue}
        </option>
      ))}
    </FormSelect>
  );
}

interface FormSelectWidthProps extends Omit<FormSelectProps, "children"> {}

export function FormSelectWidth(props: FormSelectWidthProps) {
  return (
    <FormSelect className="min-w-14" {...props}>
      {Array.from({ length: 8 }).map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </FormSelect>
  );
}

interface FormSelectOpacityProps extends Omit<FormSelectProps, "children"> {}

export function FormSelectOpacity(props: FormSelectOpacityProps) {
  return (
    <FormSelect className="min-w-14" {...props}>
      {Array.from({ length: 10 }).map((_, i) => {
        const n = Math.round(i) * 0.1 + 0.1;
        return (
          <option key={n} value={n}>
            {Math.round(n * 100)}%
          </option>
        );
      })}
    </FormSelect>
  );
}
