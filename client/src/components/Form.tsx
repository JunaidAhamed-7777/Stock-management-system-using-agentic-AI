import React from "react";

export const Form: React.FC<{
  onSubmit: (data: { [key: string]: string }) => void;
  children: React.ReactNode;
}> = ({ onSubmit, children }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
    </form>
  );
};

export const FormGroup: React.FC<{
  children: React.ReactNode;
  Label: string;
}> = ({ children, Label }) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {Label}
      </label>

      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export const Label: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
}> = ({ htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  );
};

export const Input: React.FC<{
  type: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  type,
  placeholder,
  required,
  id,
  name,
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    />
  );
};

export const Button: React.FC<{
  type?: "submit" | "button";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({
  type = "submit",
  children,
  className = "",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50${className ? ` ${className}` : ""}`}
    >
      {children}
    </button>
  );
};