import React, { createContext, useContext, useRef } from "react";

const ListenerContext = createContext<{
  addUnsubscribe: (unsubscribe: () => void) => void;
  clearListeners: () => void;
} | null>(null);

export const ListenerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const unsubscribeList = useRef<(() => void)[]>([]);

  const addUnsubscribe = (unsubscribe: () => void) => {
    unsubscribeList.current.push(unsubscribe);
  };

  const clearListeners = () => {
    unsubscribeList.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeList.current = [];
  };

  return (
    <ListenerContext.Provider value={{ addUnsubscribe, clearListeners }}>
      {children}
    </ListenerContext.Provider>
  );
};

export const useListener = () => {
  const context = useContext(ListenerContext);
  if (!context) {
    throw new Error("useListener must be used within a ListenerProvider");
  }
  return context;
};
