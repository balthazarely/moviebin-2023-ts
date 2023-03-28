import React, { useContext } from "react";
import { UIContext } from "../../../../lib/context";

export function ModalWrapper({ children }: any) {
  const { state, dispatch } = useContext(UIContext);

  return (
    <div>
      <input
        type="checkbox"
        checked={state?.isModalOpen}
        id="my-modal-6"
        className="modal-toggle"
      />
      <div
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
        className="modal modal-bottom sm:modal-middle "
      >
        <div className="modal-box">{children}</div>
      </div>
    </div>
  );
}
