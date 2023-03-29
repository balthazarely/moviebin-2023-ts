import React from "react";

export function PageWidthWrapper({ children, className }: any) {
  return (
    <div className={`max-w-4xl px-2 mx-auto ${className}`}>{children}</div>
  );
}
