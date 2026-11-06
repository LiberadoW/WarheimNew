import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "../styles/HeaderMenu.css";

// A button that opens a small panel of actions or settings. Closes on Escape
// and outside clicks, returns focus to its button, and keeps the panel inside
// the viewport.
const HeaderMenu = ({
  label,
  icon,
  ariaLabel,
  buttonClassName = "button button-secondary",
  showCaret = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();

  const close = (restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        close(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Moves keyboard focus into the panel when it opens.
  useEffect(() => {
    if (isOpen) {
      panelRef.current
        ?.querySelector("button, input, select, [tabindex]")
        ?.focus();
    }
  }, [isOpen]);

  // The panel is right-aligned to its button; shift it back if that would
  // push it past the left edge of a narrow screen.
  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) {
      setShift(0);
      return;
    }
    const { left } = panelRef.current.getBoundingClientRect();
    const margin = 12;
    setShift(left < margin ? margin - left : 0);
  }, [isOpen]);

  return (
    <div className="header-menu" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <i className={icon} aria-hidden="true"></i>}
        {label}
        {showCaret && (
          <i className="fa-solid fa-chevron-down header-menu-caret" aria-hidden="true"></i>
        )}
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          className="header-menu-panel"
          role="group"
          aria-label={ariaLabel || label}
          style={shift ? { transform: `translateX(${shift}px)` } : undefined}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
