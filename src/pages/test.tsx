import { TestModal } from "@/components/modals";
import React, { useContext, useState } from "react";
import { UIContext } from "../../lib/context";

export default function Test() {
  const [modalTypeOpen, setModalTypeOpen] = useState<string>("");
  const [testText, settestText] = useState<string>("test");

  return (
    <div>
      <div className="flex gap-5">
        <button className="btn-large btn-primary btn">Unrelated Button</button>
        <button
          onClick={() => settestText("shit hole")}
          className="btn-large btn-primary btn"
        >
          Button
        </button>
      </div>
      <ChildComponent testText={testText} />
      <OtherChildComponent setModalTypeOpen={setModalTypeOpen} />
      {/* <ModalWrapper> */}
      {modalTypeOpen === "test-modal" && <TestModal />}
      {/* </ModalWrapper> */}
    </div>
  );
}

function ChildComponent({ testText }: any) {
  return (
    <div className="my-2 border-2 bg-slate-600 p-4 ">
      <div className="text-2xl font-bold">ChildComponent</div>
      <div className="text-xl font-bold">{testText}</div>
    </div>
  );
}

function OtherChildComponent({ setModalTypeOpen }: any) {
  const { dispatch } = useContext(UIContext);

  return (
    <div className="my-2 border-2 bg-slate-600 p-4 ">
      <div className="text-2xl font-bold">OtherChildComponent</div>
      <button
        onClick={() => {
          setModalTypeOpen("test-modal");
          dispatch({ type: "OPEN_MODAL" });
        }}
      >
        MODAL
      </button>
    </div>
  );
}
