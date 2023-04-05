import React, { useContext } from "react";
import { UIContext } from "../../../../../lib/context";

export function ModalWrapper({ children }: any) {
  const { state } = useContext(UIContext);

  return (
    <div className="">
      <input
        type="checkbox"
        checked={state?.isModalOpen}
        id="my-modal-6"
        className="modal-toggle"
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box">{children}</div>
      </div>
    </div>
  );
}
