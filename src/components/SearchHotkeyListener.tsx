"use client";

import { useEffect } from "react";

export function SearchHotkeyListener() {
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      // Ignore if user is already typing in an input/textarea or using a modifier
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (
        e.defaultPrevented ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT"
      ) {
        return;
      }
      if (e.key === "/") {
        const input = document.getElementById("imdbId") as HTMLInputElement | null;
        if (input) {
          e.preventDefault();
          input.focus();
          input.select();
        }
      }
    }

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  return null;
}

