import React, { createContext, useReducer } from "react";
//
// type User = firebase.User | null;
type User = any | null;

type UserState = {
  user: User;
  userDoc: any;
  userDocLoading: boolean;
};

type UserAction = {
  type: string;
  payload: any;
};

type UserContextType = {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
};

const initialState: UserState = {
  user: null,
  userDoc: null,
  userDocLoading: true,
};

const userReducer = (state: UserState, action: UserAction) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_USER_DOC":
      return {
        ...state,
        userDoc: action.payload,
      };
    case "SET_USER_DOC_LOADING":
      return {
        ...state,
        userDocLoading: action.payload,
      };
    default:
      return state;
  }
};

export const UserContext = createContext<UserContextType>({
  state: initialState,
  dispatch: () => null,
});

const GlobalUserProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default GlobalUserProvider;
