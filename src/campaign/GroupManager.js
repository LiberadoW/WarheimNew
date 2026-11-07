import React, { useState } from "react";
import * as R from "./rules";

// Step 9: split a henchman group or merge two identical ones.
export default function GroupManager({ post, update }) {
  const groups = post.units.filter((u) => R.isGroup(u) && R.groupSize(u) > 0);
  const [open, setOpen] = useState("");
  const [picked, setPicked] = useState([]);
  if (!groups.length) return null;
  return (
    <section className="campaign-section">
      <h3>Grupy stronników</h3>
      <p className="campaign-lead">
        Podziel grupę albo połącz dwie takie same (ten sam oręż, pancerz, PD i
        rozwinięcia).
      </p>
      {groups.map((g) => {
        const alive = Array.from({ length: R.modelCount(g) }, (_, i) => i).filter(
          (i) => !g.campaignModelStatus?.[i]?.dead,
        );
        const partners = groups
          .slice(groups.indexOf(g) + 1)
          .filter((x) => !R.mergeProblem(g, x));
        const isOpen = open === g.uniqueId;
        return (
          <article className="campaign-row-card" key={g.uniqueId}>
            <div className="campaign-row-card-head">
              <div>
                <strong>{R.label(g)}</strong>
                <small>
                  {alive.length} / {R.groupLimit(g)} modeli · {g.exp || 0} PD
                </small>
              </div>
              {alive.length > 1 && (
                <button
                  type="button"
                  className="campaign-link"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpen(isOpen ? "" : g.uniqueId);
                    setPicked([]);
                  }}
                >
                  {isOpen ? "Zamknij" : "Podziel"}
                </button>
              )}
            </div>
            {isOpen && (
              <div className="campaign-row-card-body">
                <p className="campaign-source">Zaznacz modele nowej grupy:</p>
                <div className="campaign-chips">
                  {alive.map((i) => (
                    <label className="campaign-chip-toggle" key={i}>
                      <input
                        type="checkbox"
                        checked={picked.includes(i)}
                        onChange={(e) =>
                          setPicked(
                            e.target.checked
                              ? [...picked, i]
                              : picked.filter((x) => x !== i),
                          )
                        }
                      />
                      <span>Model #{i + 1}</span>
                    </label>
                  ))}
                </div>
                <button
                  className="button"
                  disabled={!picked.length || picked.length >= alive.length}
                  onClick={() => {
                    update((p) => R.splitGroup(p, g.uniqueId, picked));
                    setOpen("");
                    setPicked([]);
                  }}
                >
                  Wydziel {picked.length || ""} do nowej grupy
                </button>
              </div>
            )}
            {partners.map((x) => (
              <button
                key={x.uniqueId}
                className="button button-secondary"
                onClick={() => update((p) => R.mergeGroups(p, g.uniqueId, x.uniqueId))}
              >
                Dołącz „{R.label(x)}” ({R.groupSize(x)}) do tej grupy
              </button>
            ))}
          </article>
        );
      })}
    </section>
  );
}
