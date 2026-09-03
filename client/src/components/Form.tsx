import React from "react";

export const Form: React.FC<{
  onSubmit: (data: { [key: string]: string }) => void;
}> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: { [key: string]: string } = {};
    formData.forEach((value: string, key: string) => {
      data[key] = value as string;
    });
    onSubmit(data);
  };

  return <form onSubmit={handleSubmit} className="space-y-4">{this.props.children}</form>;
};

export const FormGroup = React.FC<{
  children: React.ReactNode;
  Label: string;
}> = ({ children, Label }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{Label}</label>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export const Label = React.FC<{ htmlFor: string; children: string }> = ({
  htmlFor,
  children,
}) => {
  return <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">{children}</label>;
};

export const Input = React.FC<{
  type: string;
  placeholder?: string;
  required?: boolean;
  htmlFor?: string;
}> = ({ type, placeholder, required, htmlFor }) => {
  const attributes: any = {
    type,
    className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full resolve-text-sm focus:ring-offset-2 bg-white py-2 px-3 text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
  };
  if (placeholder) attributes.placeholder = placeholder;
  if (required) attributes.required = required;
  if (htmlFor) attributes.htmlFor = htmlFor;
  return <input {...attributes} />;
};

export const Button = React.FC<{
  type?: "submit" | "button";
  children: React.ReactNode;
  className?: string;
}> = ({ type = "submit", children, className }) => {
  return (
    <button
      type={type}
      className={`
        w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed
      ${className ? ` ${className}` : ``}
      `}
    >
      {children}
    </button>
  );
};