"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

import { DEFAULT_MODEL } from "@/lib/llm/types";

interface GlobalState {
  initialMessage: string;
  setInitialMessage: (content: string) => void;
  initialModel: string;
  setInitialModel: (model: string) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [initialMessage, setInitialMessage] = useState("");
  const [initialModel, setInitialModel] = useState<string>(DEFAULT_MODEL);

  return (
    <GlobalStateContext.Provider
      value={{
        initialMessage,
        setInitialMessage,
        initialModel,
        setInitialModel,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
