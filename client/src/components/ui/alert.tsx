import React from "react";

// Variantes do alerta
const variants = {
  default: "bg-background text-foreground border",
  destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  info: "border-blue-200 text-blue-800 bg-blue-50 dark:border-blue-200 [&>svg]:text-blue-500",
  success: "border-green-200 text-green-800 bg-green-50 dark:border-green-200 [&>svg]:text-green-500",
  warning: "border-amber-200 text-amber-800 bg-amber-50 dark:border-amber-200 [&>svg]:text-amber-500",
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export function Alert({
  className = "",
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground
        ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function AlertTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

export function AlertDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    />
  );
}