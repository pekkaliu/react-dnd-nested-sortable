

import { createContext, useContext } from "react";

const SortableContext = createContext<any>({});
SortableContext.displayName = 'SortableContext'

export const SortableContextProvider = SortableContext.Provider;

export const useSortableContext = () => {
  return useContext(SortableContext);
};