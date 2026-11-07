import { useEffect } from "react";

// The A4 roster sheet lives outside the router; pages without a roster hide it.
export default function useHidePrintSheet() {
  useEffect(() => {
    document.body.classList.add("no-print-sheet");
    return () => document.body.classList.remove("no-print-sheet");
  }, []);
}
