import React, { useState } from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import specialSkills from "./special-skills.json";
import { getMagicLore } from "../Functions/getMagicLore";
import { magic } from "../Data.js/Magic";
import { getRuleText } from "../Functions/getRuleText";

const checkLabel = (text, value, onChange) => (
  <label className="campaign-check">
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    />
    {text}
  </label>
);
function AdvanceCard({ advance, unit, army, post, update }) {
  const [choice, setChoice] = useState("");
  const special = specialSkills[R.normal(army.name)]?.entries || [];
  const skills = [
    ...R.skillChoices(unit),
    ...(unit.skills?.includes(5)
      ? special
          .filter(
            (s) =>
              !R.hasRule(unit, s.name) &&
              (!s.restriction ||
                (s.restriction.toLowerCase().includes("dowódca")
                  ? R.hasRule(unit, "Dowódca")
                  : R.normal(s.restriction).includes(R.normal(unit.unitName)))),
          )
          .map((s) => ({ ...s, list: "Specjalne" }))
      : []),
  ];
  const lore = getMagicLore([unit]);
  const spells =
    (R.hasRule(unit, "Mag") || R.hasRule(unit, "Duchowny")) && magic[lore]
      ? Object.values(magic[lore]).map(([name, , text]) => ({ name, text }))
      : [];
  const patch = (fn) =>
    update((p) => fn(p.advances.find((a) => a.id === advance.id)));
  if (advance.resolved)
    return (
      <p className="campaign-card">
        {R.label(unit)} · {advance.threshold} PD: {advance.description}
      </p>
    );
  const n =
    advance.selectedRoll !== undefined
      ? R.sum(advance.rolls[advance.selectedRoll]?.dice || [])
      : 0;
  const skill = R.needsSkill(unit, n),
    stats = R.availableStats(unit, n),
    promotion = !R.heroDevelopment(unit) && n >= 10;
  return (
    <article className="campaign-card">
      <h3>
        {R.label(unit)} · awans przy {advance.threshold} PD
      </h3>
      {Array.from({ length: R.isHero(unit) ? 2 : 1 }, (_, i) => (
        <div key={i}>
          <DiceInput
            label={`Rozwój ${i + 1}`}
            count={2}
            value={advance.rolls[i]?.dice || []}
            disabled={advance.selectedRoll !== undefined}
            onChange={(dice, source) =>
              patch((a) => {
                a.rolls[i] = { dice, source };
              })
            }
          />
        </div>
      ))}
      {advance.selectedRoll === undefined ? (
        <div className="campaign-row">
          {advance.rolls.map((r, i) => (
            <button
              className="button"
              key={i}
              disabled={
                !R.validDice(r.dice, 2) ||
                (R.isHero(unit) &&
                  (!R.validDice(advance.rolls[0]?.dice, 2) ||
                    !R.validDice(advance.rolls[1]?.dice, 2)))
              }
              onClick={() =>
                patch((a) => {
                  a.selectedRoll = i;
                })
              }
            >
              Wybierz wynik {i + 1}: {R.sum(r.dice)}
            </button>
          ))}
        </div>
      ) : (
        <>
          <p>
            Wybrany wynik: <strong>{n}</strong> ·{" "}
            {skill
              ? "Nowa umiejętność"
              : promotion
                ? "Chłopak ma talent!"
                : "Rozwinięcie charakterystyki"}
          </p>
          {skill && (
            <>
              <label>
                Umiejętność
                <select
                  value={choice}
                  onChange={(e) => setChoice(e.target.value)}
                >
                  <option value="">Wybierz z dostępnej listy</option>
                  {skills.map((s) => (
                    <option key={s.name} value={`rule:${s.name}`}>
                      {s.list}: {s.name}
                      {s.restriction ? ` (${s.restriction})` : ""}
                    </option>
                  ))}
                  {spells
                    .filter((s) => !unit.learnedSpells?.includes(s.name))
                    .map((s) => (
                      <option key={s.name} value={`spell:${s.name}`}>
                        Zaklęcie / modlitwa: {s.name}
                      </option>
                    ))}
                </select>
              </label>
              {choice.startsWith("rule:") && (
                <p>{getRuleText(choice.slice(5))}</p>
              )}
            </>
          )}
          {!skill && !promotion && (
            <label>
              Współczynnik
              <select
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
              >
                <option value="">Wybierz rozwinięcie</option>
                {stats.map((i) => (
                  <option key={i} value={`stat:${i}`}>
                    {R.STATS[i]} +1
                  </option>
                ))}
              </select>
            </label>
          )}
          {promotion && (
            <p>
              Wydziel model z grupy, wybierz dwie listy umiejętności i
              rozstrzygnij jego rozwój oraz ponowny rozwój grupy. Limit: 6
              bohaterów.
            </p>
          )}
          {!promotion ? (
            <button
              className="button"
              disabled={!choice}
              onClick={() =>
                update((p) => {
                  const u = p.units.find((x) => x.uniqueId === unit.uniqueId),
                    a = p.advances.find((x) => x.id === advance.id);
                  if (choice.startsWith("stat:")) {
                    const i = Number(choice.slice(5));
                    if (!R.availableStats(u, n).includes(i))
                      throw Error("To rozwinięcie jest niedostępne.");
                    R.changeStat(u, i, 1);
                    u.campaignAdvancements = [
                      ...(u.campaignAdvancements || []),
                      i,
                    ];
                  } else if (choice.startsWith("spell:"))
                    u.learnedSpells = [
                      ...(u.learnedSpells || []),
                      choice.slice(6),
                    ];
                  else R.addRule(u, choice.slice(5));
                  a.resolved = true;
                  a.description = choice.split(":").slice(1).join(":");
                  if (choice.startsWith("stat:"))
                    a.description = R.STATS[Number(choice.slice(5))] + " +1";
                  R.log(p, "advance", `${R.label(u)}: ${a.description}`);
                })
              }
            >
              Zastosuj rozwinięcie
            </button>
          ) : (
            <Promotion
              advance={advance}
              unit={unit}
              post={post}
              update={update}
            />
          )}
          {!skill && !promotion && stats.length === 0 && (
            <button
              className="button"
              onClick={() =>
                patch((a) => {
                  a.rolls = [];
                  delete a.selectedRoll;
                })
              }
            >
              Powtórz rzut: oba współczynniki są już maksymalne / rozwinięte
            </button>
          )}
          {promotion &&
            (advance.noPromotion ||
              post.units.filter(
                (u) =>
                  R.isHero(u) && !u.campaignModelStatus?.every((s) => s.dead),
              ).length >= 6) && (
              <button
                className="button"
                onClick={() =>
                  patch((a) => {
                    a.rolls = [];
                    delete a.selectedRoll;
                  })
                }
              >
                Powtórz: w kompanii jest już 6 bohaterów
              </button>
            )}
        </>
      )}
    </article>
  );
}
function Promotion({ advance, unit, post, update }) {
  const [lists, setLists] = useState([]);
  return (
    <>
      <div className="campaign-row">
        {R.SKILL_LISTS.slice(0, 5).map((name, i) => (
          <React.Fragment key={name}>
            {checkLabel(name, lists.includes(i), (checked) =>
              setLists(checked ? [...lists, i] : lists.filter((x) => x !== i)),
            )}
          </React.Fragment>
        ))}
      </div>
      <button
        className="button"
        disabled={
          advance.noPromotion ||
          lists.length !== 2 ||
          post.units.filter(
            (u) => R.isHero(u) && !u.campaignModelStatus?.every((s) => s.dead),
          ).length >= 6
        }
        onClick={() =>
          update((p) => {
            const u = p.units.find((x) => x.uniqueId === unit.uniqueId);
            const survivorIndex = (u.campaignModelStatus || []).findIndex(
              (s) => !s.dead,
            );
            const hero = R.clone(u);
            hero.uniqueId = R.uid();
            hero.type = "Bohater";
            hero.selectedNumber = 1;
            hero.number = 1;
            hero.skills = lists;
            hero.campaignModelStatus = [{}];
            hero.totalCost = hero.cost;
            hero.battleOutOfActionModels = [false];
            hero.battleAbsentModels = [false];
            if (R.modelCount(u) > 1) {
              u.selectedNumber -= 1;
              u.totalCost = u.cost * u.selectedNumber;
              u.campaignModelStatus = (u.campaignModelStatus || []).filter(
                (_, i) => i !== (survivorIndex < 0 ? 0 : survivorIndex),
              );
              p.units.push(hero);
            } else p.units[p.units.indexOf(u)] = hero;
            const a = p.advances.find((x) => x.id === advance.id);
            a.resolved = true;
            a.description = "Awans na bohatera";
            p.advances.push({
              id: R.uid(),
              unitId: hero.uniqueId,
              threshold: hero.exp,
              resolved: false,
              rolls: [],
            });
            if (R.modelCount(unit) > 1)
              p.advances.push({
                id: R.uid(),
                unitId: u.uniqueId,
                threshold: u.exp,
                resolved: false,
                rolls: [],
                noPromotion: true,
              });
            R.log(p, "promotion", `${R.label(hero)} awansował na bohatera.`);
          })
        }
      >
        Awansuj model na bohatera
      </button>
    </>
  );
}

export default AdvanceCard;
