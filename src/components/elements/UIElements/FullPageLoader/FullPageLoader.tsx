import React from "react";

export function FullPageLoader() {
  return (
    <div className="h-full flex-grow flex justify-center items-center ">
      <div className="w-16 h-16 rounded-full animate-spin border-8 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}
