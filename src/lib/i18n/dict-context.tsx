"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";

type Dict = Record<string, unknown>;

const DictContext = createContext<Dict>({});

export function DictProvider({ dict, children }: { dict: Dict; children: ReactNode }) {
  return <DictContext.Provider value={dict}>{children}</DictContext.Provider>;
}

export function useDict(): Dict {
  return useContext(DictContext);
}

export function useT(): (path: string) => string {
  const dict = useDict();
  return useCallback(
    (path: string): string => {
      const keys = path.split(".");
      let current: unknown = dict;
      for (const key of keys) {
        if (current === null || current === undefined || typeof current !== "object") return path;
        current = (current as Record<string, unknown>)[key];
      }
      return typeof current === "string" ? current : path;
    },
    [dict]
  );
}
