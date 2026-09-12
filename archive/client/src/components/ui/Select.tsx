import React, { useState } from "react";

export interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value || options[0]?.value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedValue(selected);
    onChange?.(selected);
  };

  return (
    <div className="space-y-1.5">
      <label
        className="
          block
          text-sm
          font-medium
          text-slate-700
        "
      >
        {label}
      </label>
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        className="
          w-full
          rounded-md
          border-border-subtle
          shadow-sm
          bg-white
          py-2
          px-3
          text-sm
          text-slate-700
          focus:border-primary-600
          focus:ring-1
          focus:ring-primary-500
          ${className ? className : ""}
        "
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            selected={option.value === selectedValue}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};