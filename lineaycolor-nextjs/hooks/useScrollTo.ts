"use client";

import { useCallback } from "react";

export function useScrollTo() {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.querySelector(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  return scrollTo;
}