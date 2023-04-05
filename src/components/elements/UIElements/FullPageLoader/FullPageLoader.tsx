import React from "react";

export function FullPageLoader({ className }: any) {
  return (
    <div className={`flex flex-grow items-center justify-center ${className}`}>
      <div className="h-16 w-16 animate-spin rounded-full border-8 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}
