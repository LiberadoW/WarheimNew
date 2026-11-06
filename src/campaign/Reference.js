import React from "react";
import reference from "./reference.json";
export default function Reference({ pages, title = "Zasady z podręcznika" }) {
  return (
    <details>
      <summary>{title}</summary>
      {pages.map((page) => (
        <section key={page}>
          <p className="campaign-source">Podręcznik AD2026.04.15 · s. {page}</p>
          <div className="campaign-reference">{reference[page]}</div>
        </section>
      ))}
    </details>
  );
}
