import React, { useState } from "react";
import * as R from "./rules";
import { createUnit } from "../Functions/createUnit";
import { getUnitAvailability } from "../Functions/getUnitAvailability";

function Recruitment({ post, update, army }) {
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState(0);
  const [token, setToken] = useState("");
  const unit = army.heroes?.[name];
  const units = post.units.filter(
    (u) => !u.campaignModelStatus?.every((s) => s.dead),
  );
  const state = name ? getUnitAvailability(army, units)[name] : null;
  const rosterAtLimit =
    units.reduce((n, u) => n + R.modelCount(u), 0) >=
    (army.maxModels || Infinity);
  const heroAtLimit =
    unit?.type === "Bohater" && units.filter(R.isHero).length >= 6;
  return (
    <>
      <p>
        Nowi rekruci mogą otrzymać ekwipunek powszechny. Przedmioty rzadkie
        dopiero po następnej potyczce, chyba że są już w skarbcu.
      </p>
      <label>
        Nowy rekrut
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option value="">Wybierz</option>
          {Object.keys(army.heroes || {}).map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      {unit && (
        <>
          <p>
            Koszt: {unit.cost} zk ·{" "}
            {(state?.blockedBy
              ? `Blokuje: ${state.blockedBy}`
              : state?.isAtLimit
                ? "Osiągnięto limit"
                : "") || ""}
          </p>
          <label>
            Dostępność z opisu rekruta (0 = powszechna)
            <input
              type="number"
              min="0"
              max="20"
              value={availability}
              onChange={(e) =>
                setAvailability(Math.max(0, Number(e.target.value)))
              }
            />
          </label>
          {availability > 0 && (
            <label>
              Wynik puli dostępności
              <select value={token} onChange={(e) => setToken(e.target.value)}>
                <option value="">Wybierz</option>
                {(post.availability || [])
                  .filter((t) => t.locked && !t.used && t.total >= availability)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}: {t.total}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <button
            className="button"
            disabled={
              rosterAtLimit ||
              heroAtLimit ||
              post.treasury < unit.cost ||
              !state?.isAvailable ||
              (availability > 0 && !token)
            }
            onClick={() =>
              update((p) => {
                if (availability > 0) {
                  const t = p.availability.find((x) => x.id === token);
                  if (!t || t.used || t.total < availability)
                    throw Error("Brak dostępności.");
                  t.used = true;
                }
                const u = createUnit(army.heroes, name);
                if (p.treasury < unit.cost * R.modelCount(u))
                  throw Error("Za mało złota na pełną drużynę.");
                u.campaignNewRecruit = true;
                p.units.push(u);
                p.treasury -= unit.cost * R.modelCount(u);
                R.log(
                  p,
                  "recruitment",
                  `${name}: ${unit.cost} zk, dostępność ${availability || "powszechna"}.`,
                );
              })
            }
          >
            Zrekrutuj
          </button>
        </>
      )}
    </>
  );
}

export default Recruitment;
