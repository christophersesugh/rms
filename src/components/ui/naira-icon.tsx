import React from "react";

export function NairaIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* N shape */}
      <path d="M6 19V5l12 14V5" />
      {/* Two horizontal lines */}
      <path d="M4 10h16" />
      <path d="M4 14h16" />
    </svg>
  );
}
