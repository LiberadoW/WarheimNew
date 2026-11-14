import React, { useState } from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import specialSkills from "./special-skills.json";
import characterProfiles from "./drama.json";
import mercenaryProfiles from "./mercenary-profiles.json";
import {
  arcaneLores,
  collegeLores,
  hedgeSpell,
  isCaster,
  isHedgeWizard,
  isPriest,
  knownSpells,
  learnDice,
  learnTotal,
  loreOf,
  masteryText,
  spellForRoll,
} from "./spells";
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
// Nauka nowych zaklęć (s. 550) / modlitw (s. 590): a mage rolls 2K6 on the
// common spells or his lore, a priest 3K3 on his prayers. A known result may
// be rerolled or taken as mastery of that spell.
function LearnSpell({ unit, advance, lore: ownLore, patch, update }) {
  const d = learnDice(unit);
  const hedge = isHedgeWizard(unit);
  // GUŚLARSTWO: the player picks the college for this spell.
  const lore = hedge ? advance.spellLore || ownLore : ownLore;
  const dice = advance.spellDice || [];
  const ready = R.validDice(dice, d.count);
  const total = ready ? learnTotal(unit, dice) : null;
  const spell = total != null ? (hedge ? hedgeSpell(lore, total) : spellForRoll(lore, total)) : null;
  const known = spell && knownSpells(unit).some((s) => s.key === spell.key);
  // WIEDZA TAJEMNA: the own-lore result waits for the extra spell.
  const arcane = arcaneLores(unit);
  const chosen = advance.mainSpell || null;
  const applyMain = (u, m) => {
    if (m.mastery) u.spellMastery = { ...(u.spellMastery || {}), [m.key]: (Number(u.spellMastery?.[m.key]) || 0) + 1 };
    else u.learnedSpells = [...(u.learnedSpells || []), m.key];
  };
  const finish = (fn, description) => {
    if (arcane.length && !chosen) {
      // Keep the own-lore result; the extra spell finishes the advance.
      const mastery = /^opanowanie/.test(description);
      patch((a) => {
        a.mainSpell = { key: spell.key, mastery, description, roll: `${d.label}: ${total}` };
      });
      return;
    }
    update((p) => {
      const u = p.units.find((x) => x.uniqueId === unit.uniqueId),
        a = p.advances.find((x) => x.id === advance.id);
      fn(u);
      a.resolved = true;
      a.description = description;
      R.log(p, "advance", `${R.label(u)}: ${description} (${d.label}: ${total})`);
    });
  };
  if (arcane.length && chosen)
    return <ArcaneSpell unit={unit} advance={advance} lores={arcane} chosen={chosen} applyMain={applyMain} patch={patch} update={update} />;
  return (
    <div className="campaign-learn-spell">
      {hedge && (
        <label>
          Guślarstwo: Kolegium Magii dla tego zaklęcia
          <select
            value={lore || ""}
            disabled={ready}
            onChange={(e) => patch((a) => { a.spellLore = e.target.value; a.spellDice = []; })}
          >
            {collegeLores().map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <small className="campaign-muted">K6 = numer w nawiasie na liście (zaklęcia 7–12).</small>
        </label>
      )}
      <DiceInput
        label={`${isPriest(unit) ? "Modlitwa" : "Zaklęcie"}: ${d.label}${isPriest(unit) ? " (K6 ÷ 2)" : ""}`}
        count={d.count}
        value={dice}
        onChange={(v) => patch((a) => { a.spellDice = v; })}
      />
      {spell && (
        <>
          <p>
            {isPriest(unit)
              ? `K3: ${dice.map((x) => Math.ceil(x / 2)).join(" + ")} = ${total}`
              : hedge
                ? `K6: ${total} → (${total}) na liście ${lore}`
                : `Wynik: ${total}`} ·{" "}
            <strong>{spell.name}</strong> <span className="campaign-muted">{spell.cast}</span>
          </p>
          <p className="campaign-muted">{spell.text}</p>
          {!known ? (
            <button className="button" onClick={() => finish((u) => { u.learnedSpells = [...(u.learnedSpells || []), spell.key]; }, `nowe ${isPriest(unit) ? "modlitwa" : "zaklęcie"}: ${spell.name}`)}>
              Naucz się: {spell.name}
            </button>
          ) : (
            <>
              <p>Postać zna już to {isPriest(unit) ? "modlitwę" : "zaklęcie"}. Rzuć ponownie albo wybierz lepsze opanowanie: {masteryText(unit)}.</p>
              <div className="campaign-row">
                <button className="button button-secondary" onClick={() => patch((a) => { a.spellDice = []; })}>
                  Rzuć ponownie
                </button>
                <button
                  className="button"
                  onClick={() =>
                    finish((u) => {
                      u.spellMastery = { ...(u.spellMastery || {}), [spell.key]: (Number(u.spellMastery?.[spell.key]) || 0) + 1 };
                    }, `opanowanie: ${spell.name}`)
                  }
                >
                  Lepiej opanuje: {spell.name}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// WIEDZA TAJEMNA (x): the extra spell from the lore in brackets, K6 read as
// the number in brackets (spells 7–12); a known spell is rolled again.
function ArcaneSpell({ unit, advance, lores, chosen, applyMain, patch, update }) {
  const lore = lores.includes(advance.arcaneLore) ? advance.arcaneLore : lores[0];
  const dice = advance.arcaneDice || [];
  const ready = R.validDice(dice, 1);
  const spell = ready ? hedgeSpell(lore, dice[0]) : null;
  const known =
    spell && (knownSpells(unit).some((s) => s.key === spell.key) || (!chosen.mastery && chosen.key === spell.key));
  return (
    <div className="campaign-learn-spell">
      <p>
        Z własnej tradycji: <strong>{chosen.description}</strong> ({chosen.roll}){" "}
        <button type="button" className="button button-ghost button-small" onClick={() => patch((a) => { delete a.mainSpell; a.spellDice = []; })}>
          Zmień
        </button>
      </p>
      <p className="campaign-muted">
        Wiedza tajemna: mag uczy się też dodatkowego czaru. K6 = numer w nawiasie na liście wybranej tradycji (zaklęcia
        7–12); znane zaklęcie rzuca się ponownie.
      </p>
      {lores.length > 1 && (
        <label>
          Tradycja dodatkowego czaru
          <select value={lore} disabled={ready} onChange={(e) => patch((a) => { a.arcaneLore = e.target.value; a.arcaneDice = []; })}>
            {lores.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
      )}
      <DiceInput label={`Dodatkowy czar: ${lore}`} count={1} value={dice} onChange={(v) => patch((a) => { a.arcaneDice = v; a.arcaneLore = lore; })} />
      {spell && (
        <>
          <p>
            K6: {dice[0]} → ({dice[0]}) na liście {lore} · <strong>{spell.name}</strong>{" "}
            <span className="campaign-muted">{spell.cast}</span>
          </p>
          <p className="campaign-muted">{spell.text}</p>
          {known ? (
            <>
              <p>Mag zna już to zaklęcie: rzuć ponownie.</p>
              <button className="button button-secondary" onClick={() => patch((a) => { a.arcaneDice = []; })}>
                Rzuć ponownie
              </button>
            </>
          ) : (
            <button
              className="button"
              onClick={() =>
                update((p) => {
                  const u = p.units.find((x) => x.uniqueId === unit.uniqueId),
                    a = p.advances.find((x) => x.id === advance.id);
                  applyMain(u, chosen);
                  u.learnedSpells = [...(u.learnedSpells || []), spell.key];
                  a.resolved = true;
                  a.description = `${chosen.description}; Wiedza tajemna: ${spell.name} (${lore})`;
                  R.log(p, "advance", `${R.label(u)}: ${a.description} (${chosen.roll}; K6: ${dice[0]})`);
                })
              }
            >
              Naucz się obu: {chosen.description.replace(/^nowe zaklęcie: /, "")} i {spell.name}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function AdvanceCard({ advance, unit, army, post, update }) {
  const [choice, setChoice] = useState("");
  const personalProfile = (
    unit.type === "Postać Dramatu"
      ? characterProfiles
      : unit.type === "Najemne Ostrze"
        ? mercenaryProfiles
        : []
  ).find((p) => R.normal(p.name) === R.normal(unit.dramaId || unit.unitName));
  const special = personalProfile
    ? (personalProfile.specialSkills || []).map((name) => ({
        name,
        restriction: "",
      }))
    : specialSkills[R.normal(army.name)]?.entries || [];
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
  const lore = isCaster(unit) ? loreOf(unit) : null;
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
  const fallback = R.allAdvancementStatsMaxed(unit);
  const skill = R.needsSkill(unit, n) || (fallback && R.heroDevelopment(unit)),
    stats = R.availableStats(unit, n),
    promotion = !R.heroDevelopment(unit) && n >= 10 && !fallback;
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
              {R.validDice(r.dice, 2)
                ? `Wybierz ${R.sum(r.dice)} · ${R.advanceLabel(unit, R.sum(r.dice))}`
                : `Wynik ${i + 1}: rzuć kośćmi`}
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
          {fallback && (
            <p>
              Współczynniki z tabeli rozwoju osiągnęły rasowe maksimum. Możesz
              wybrać umiejętność (jeśli dostępna) lub +1 Sz w granicach
              maksimum.
            </p>
          )}
          {skill && (
            <>
              <label>
                Umiejętność
                <select
                  value={choice}
                  onChange={(e) => setChoice(e.target.value)}
                >
                  <option value="">Wybierz z dostępnej listy</option>
                  {fallback && stats.includes(0) && (
                    <option value="stat:0">
                      Sz +1 (maksimum pozostałych współczynników)
                    </option>
                  )}
                  {skills.map((s) => (
                    <option key={s.name} value={`rule:${s.name}`}>
                      {s.list}: {s.name}
                      {s.restriction ? ` (${s.restriction})` : ""}
                    </option>
                  ))}
                  {lore && (
                    <option value="spell:roll">
                      {isPriest(unit) ? "Nowa modlitwa (rzut 3K3)" : "Nowe zaklęcie (rzut 2K6)"}
                    </option>
                  )}
                </select>
              </label>
              {choice === "spell:roll" && (
                <LearnSpell unit={unit} advance={advance} lore={lore} patch={patch} update={update} />
              )}
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
            choice !== "spell:roll" && <button
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
                    const taken = R.takenAdvances(u);
                    R.changeStat(u, i, 1);
                    u.campaignAdvancements = [...taken, i];
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
