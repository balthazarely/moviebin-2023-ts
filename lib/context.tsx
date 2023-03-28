import React, { createContext, useReducer } from "react";

const UIReducer = (state: any, action: any) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false };
    default:
      return state;
  }
};

type InitialStateType = {
  isDrawerOpen: boolean;
  isModalOpen: boolean;
};

const initialState = { isDrawerOpen: false, isModalOpen: false };

export const UIContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

const GlobalProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(UIReducer, initialState);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
};

export default GlobalProvider;
