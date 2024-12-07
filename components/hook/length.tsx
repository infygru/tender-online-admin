import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the type of the context data
type AppContextType<T> = {
  length: any;
  setLength: React.Dispatch<React.SetStateAction<T>>;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
};

// Generic default value for the context
function createDefaultContext<T>(defaultValue: T): AppContextType<T> {
  return {
    length: 0,
    setLength: () => {},
    setRefetch: () => {},
    refetch: false,
  };
}

// Create a generic Context
export const createDynamicContext = <T,>(defaultValue: T) => {
  const Context = createContext<AppContextType<T>>(
    createDefaultContext(defaultValue)
  );

  const Provider: React.FC<{ initialState: T; children: ReactNode }> = ({
    initialState,
    children,
  }) => {
    const [length, setLength] = useState<any>(0);
    const [refetch, setRefetch] = useState<boolean>(false);

    return (
      <Context.Provider value={{ setLength, length, setRefetch, refetch }}>
        {children}
      </Context.Provider>
    );
  };

  const useDynamicContext = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useDynamicContext must be used within a Provider.");
    }
    return context;
  };

  return { Provider, useDynamicContext };
};
// Define the type of your state
type UserState = {
  length: number;
};

// Create a User Context
const defaultUserState: UserState = { length: 0 };

export const { Provider: UserProvider, useDynamicContext: useUserContext } =
  createDynamicContext<UserState>(defaultUserState);
