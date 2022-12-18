

import { createContext, useContext } from "react";

const ToolContext = createContext<any>({});
ToolContext.displayName = 'ToolContext'

export const ToolContextProvider = ToolContext.Provider;

export const useToolContext = () => {
  return useContext(ToolContext);
};