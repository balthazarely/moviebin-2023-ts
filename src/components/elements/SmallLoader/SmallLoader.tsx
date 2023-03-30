import React from "react";

export function SmallLoader() {
  return (
    <div className="h-full flex-grow flex justify-center items-center ">
      <div className="w-6 h-6 rounded-full animate-spin border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
}
