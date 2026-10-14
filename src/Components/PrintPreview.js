import React, { useEffect, useRef } from "react";

// Keep the print sheet rendered offscreen so PDF export also works with the preview closed.
export default function PrintPreview({ open, onClose, children }) {
  const closeButton = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);
  const handleKeyDown = (event) => {
    if (event.key === "Escape") onClose();
    if (event.key === "Tab") {
      const elements = Array.from(event.currentTarget.querySelectorAll('button, input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]'));
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  return (
    <section className={`print-preview ${open ? "is-open" : ""}`} role={open ? "dialog" : undefined}
      aria-modal={open ? "true" : undefined} aria-label="Podgląd karty kompanii"
      aria-hidden={!open} inert={!open ? "" : undefined} onKeyDown={handleKeyDown}>
      <div className="print-preview-toolbar">
        <div><strong>Karta kompanii</strong><span>Podgląd wydruku · format A4</span></div>
        <button ref={closeButton} className="button" onClick={onClose}>Wróć do kompanii</button>
      </div>
      {children}
    </section>
  );
}
