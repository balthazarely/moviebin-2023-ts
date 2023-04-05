import React, { useContext } from "react";
import { UIContext } from "../../../../lib/context";
import { HiX } from "react-icons/hi";

export function TestModal() {
  const { dispatch } = useContext(UIContext);

  return (
    <div className=" relative  h-full w-full text-center">
      asglasgklashglkhsalkghlkasg
      <button
        className="btn-sm btn absolute -top-4 -right-4 border-none bg-base-100 "
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        <HiX />
      </button>
    </div>
  );
}
