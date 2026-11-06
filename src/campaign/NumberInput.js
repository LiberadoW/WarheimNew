import React, { useEffect, useRef, useState } from "react";

// Keep the editing text separate from the last valid campaign value. In
// particular, deleting the last digit must not immediately put 0/1 back.
export default function NumberInput({
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}) {
  const [draft, setDraft] = useState(String(value ?? ""));
  const editing = useRef(false);

  useEffect(() => {
    if (!editing.current) setDraft(String(value ?? ""));
  }, [value]);

  return (
    <input
      {...props}
      type="number"
      value={draft}
      onFocus={(event) => {
        editing.current = true;
        onFocus?.(event);
      }}
      onChange={(event) => {
        const text = event.target.value;
        setDraft(text);
        if (text !== "" && Number.isFinite(Number(text))) onChange?.(event);
      }}
      onBlur={(event) => {
        editing.current = false;
        setDraft(String(value ?? ""));
        onBlur?.(event);
      }}
    />
  );
}
