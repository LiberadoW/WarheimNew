import React from "react";

// Lists roster problems. A message tied to a unit opens that unit.
const ArmyListErrors = ({ messages, onSelect }) => (
  <ul className="army-list-errors" id="army-error-list">
    {messages.map(({ message, uniqueId }, index) => (
      <li key={`${index}-${message}`}>
        {uniqueId && onSelect ? (
          <button
            type="button"
            className="army-error-link"
            onClick={() => onSelect(uniqueId)}
          >
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            <span>{message}</span>
            <span className="army-error-link-hint">Pokaż jednostkę</span>
          </button>
        ) : (
          <span className="army-error-text">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            <span>{message}</span>
          </span>
        )}
      </li>
    ))}
  </ul>
);

export default ArmyListErrors;
