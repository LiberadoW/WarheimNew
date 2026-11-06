import React from "react";
import * as R from "./rules";
import { immortalTasks, applyCompanyRules } from "./company";
import { createUnit } from "../Functions/createUnit";
export default function ImmortalRecruits({ post, update, army }) {
  const tasks = immortalTasks(post);
  if (!tasks.length) return null;
  return (
    <section className="campaign-card">
      <h3>Nieśmiertelni — bezpłatne zastępstwa</h3>
      {tasks.map((t) => (
        <div key={t.key}>
          <p>
            {R.label(t.unit)} #{t.index + 1}: zastępstwo tego samego rodzaju,
            bez rozwinięć poprzednika.
          </p>
          <button
            className="button"
            disabled={!army.heroes?.[t.unit.unitName]}
            onClick={() =>
              update((p) => {
                if (!immortalTasks(p).some((x) => x.key === t.key))
                  throw Error("Zastępstwo już rozliczono.");
                const fresh = createUnit(army.heroes, t.unit.unitName);
                fresh.selectedNumber = 1;
                fresh.totalCost = fresh.cost;
                fresh.exp = R.isHero(fresh)
                  ? Number(army.heroes[t.unit.unitName].exp) || 0
                  : 0;
                fresh.campaignNewRecruit = true;
                fresh.battleAbsentModels = [true];
                p.units.push(fresh);
                p.immortalRecruits = {
                  ...(p.immortalRecruits || {}),
                  [t.key]: fresh.uniqueId,
                };
                applyCompanyRules(p);
                R.log(
                  p,
                  "immortal",
                  `Nieśmiertelni: bezpłatny ${fresh.unitName}, ${fresh.exp} początkowych PD.`,
                );
              })
            }
          >
            Zrekrutuj zastępstwo: {t.unit.unitName}
          </button>
        </div>
      ))}
    </section>
  );
}
