import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function LuxuryInput({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-[10px] uppercase-letter-spacing font-bold text-text-secondary">
          {label}
        </label>
      )}
      <input
        className="w-full bg-transparent border-b border-brand-border py-2 px-1 text-sm font-light text-text-primary outline-none transition-all duration-300 focus:border-accent placeholder:text-text-secondary/40"
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 font-light mt-1">{error}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function LuxurySelect({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-[10px] uppercase-letter-spacing font-bold text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className="w-full bg-transparent border-b border-brand-border py-2 px-1 text-sm font-light text-text-primary outline-none transition-all duration-300 focus:border-accent appearance-none cursor-pointer"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background-secondary text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
          {/* Custom SVG arrow down */}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <span className="text-[10px] text-red-500 font-light mt-1">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function LuxuryTextarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-[10px] uppercase-letter-spacing font-bold text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        className="w-full bg-transparent border-b border-brand-border py-2 px-1 text-sm font-light text-text-primary outline-none transition-all duration-300 focus:border-accent placeholder:text-text-secondary/40 resize-y min-h-[80px]"
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 font-light mt-1">{error}</span>}
    </div>
  );
}
