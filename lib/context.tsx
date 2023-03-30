import React, { createContext, useReducer } from "react";

const UIReducer = (state: any, action: any) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false };
    case "OPEN_ADD_MOVIE_MODAL":
      return { ...state, isAddMovieModalOpen: true };
    case "CLOSE_ADD_MOVIE_MODAL":
      return { ...state, isAddMovieModalOpen: false };
    case "ADD_TEMP_MOVIE":
      return {
        ...state,
        tempMovie: action.payload,
      };
    case "REMOVE_TEMP_MOVIE":
      return {
        ...state,
        tempMovie: null,
      };
    default:
      return state;
  }
};

type InitialStateType = {
  isModalOpen: boolean;
  isAddMovieModalOpen: boolean;
  tempMovie: any;
};

const initialState = {
  isModalOpen: false,
  isAddMovieModalOpen: false,
  tempMovie: null,
};

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
