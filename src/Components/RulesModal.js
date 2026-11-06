import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/RulesModal.css";

// Full rule texts for one unit in a dialog. `sections` is a list of
// { title, entries: [{ name, text, source? }] }. When `focusName` is set the
// dialog opens scrolled to that entry.
const RulesModal = ({ title, sections, focusName, onClose }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
      }
      // Keep Tab inside the dialog.
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          "button, [href], input, select, [tabindex]:not([tabindex='-1'])",
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (!focusName || !dialogRef.current) {
      return;
    }
    const target = [...dialogRef.current.querySelectorAll("[data-rule-name]")].find(
      (element) => element.dataset.ruleName === focusName,
    );
    target?.scrollIntoView({ block: "start" });
  }, [focusName]);

  const content = (
    <div
      className="rules-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="rules-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-modal-title"
      >
        <div className="rules-modal-header">
          <h2 id="rules-modal-title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="rules-modal-close"
            onClick={onClose}
            aria-label="Zamknij"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div className="rules-modal-body">
          {sections
            .filter((section) => section.entries.length > 0)
            .map((section) => (
              <section className="rules-modal-section" key={section.title}>
                <h3>{section.title}</h3>
                {section.entries.map(({ name, text, source }) => (
                  <article
                    className={`rules-modal-entry${
                      name === focusName ? " is-focused" : ""
                    }`}
                    key={name}
                    data-rule-name={name}
                  >
                    <h4>
                      {name}
                      {source && <span className="rules-modal-source">{source}</span>}
                    </h4>
                    <p>{text || "Brak opisu zasady."}</p>
                  </article>
                ))}
              </section>
            ))}
        </div>
      </div>
    </div>
  );

  // Rendered inside .app so the theme tokens apply, above every panel.
  return createPortal(content, document.getElementById("app") || document.body);
};

export default RulesModal;
