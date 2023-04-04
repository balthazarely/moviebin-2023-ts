import React from "react";

export function PageWidthWrapper({ children, className }: any) {
  return (
    <div className={`mx-auto max-w-4xl px-2 ${className}`}>{children}</div>
  );
}
