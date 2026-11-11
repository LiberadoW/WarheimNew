import NumberInput from "./NumberInput";
import { SanityTasks, Mutations } from "./SanityPanel";
import { sanityTasks } from "./sanity";
import Crafting from "./Crafting";
import Drama from "./Drama";
import { dramaWageUnits } from "./drama-rules";
import Inventory from "./Inventory";
import { companyChoices } from "./company";
import PreBattle, { oldWoundUnits } from "./PreBattle";
import ImmortalRecruits from "./ImmortalRecruits";
import Recruitment from "./Recruitment";
import CampaignPoints, { applyCampaignPoints } from "./CampaignPoints";
import LootSale, { applyLootSale, lootQuote } from "./LootSale";
import Exploration, { applyExploration, explorationState } from "./Exploration";
import { companyInjuryModifier } from "./company";
import UnitAdjustments from "./UnitAdjustments";
import AdvanceCard from "./Advancement";
import InjuryCard from "./InjuryCard";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import Reference from "./Reference";
import BattleTracker from "./BattleTracker";
import GroupManager from "./GroupManager";
import DiceInput from "./DiceInput";
import useRollDraft from "./useRollDraft";
import { getPrestige } from "../Functions/getPrestige";
import Trade from "./Trade";
import {
  RollNotebook,
  EconomyAdjustment,
  ExperiencedRecruits,
  Wages,
  wageUnits,
  RecruitBudget,
} from "./Extras";
import * as R from "./rules";
import "./Campaign.css";

// The rulebook scenario tables are large; load them only on the battle form.
const ScenarioField = lazy(() => import("./ScenarioField"));

const STEPS = [
  "Potyczka",
  "Poważne rany",
  "Doświadczenie i rozwój",
  "Punkty kampanii",
  "Eksploracja",
  "Sprzedaż łupów",
  "Doświadczeni stronnicy",
  "Handel i dostępność",
  "Postacie Dramatu",
  "Rekrutacja",
  "Podział ekwipunku",
  "Podsumowanie",
];
const LEADS = [
  "Zapisuj przebieg na bieżąco, a po grze uzupełnij dane potyczki.",
  "Rzut na tabelę poważnych ran dla każdego modelu wyłączonego z akcji.",
  "Nalicz PD i rozstrzygnij awanse bohaterów oraz grup.",
  "Determinacja, Gniew i Odporność oraz rozwinięcia kompanii.",
  "Pula kostek eksploracji, powtórzenia i znalezione łupy.",
  "Łupy można sprzedać tylko raz w sekwencji.",
  "Rzut 2K6 na sumę PD rekrutów dołączających do grup.",
  "Pula dostępności i zakup rzadkiego ekwipunku.",
  "Wynajęcie Postaci Dramatu i ich żołd.",
  "Nowi drużynnicy, Najemne Ostrza, rzemiosło i grupy stronników.",
  "Wymiana oręża i ekwipunku między postaciami i skarbcem.",
  "Sprawdź wynik i zapisz rozliczenie.",
];
const PAGES = {
  1: [409, 410],
  2: [414, 415],
  3: [416, 417],
  4: [418],
  5: [424],
  6: [426],
  7: [426],
  8: [408],
  9: [426],
  10: [426],
  11: [408],
};
const RESULTS = { win: "Zwycięstwo", loss: "Porażka", draw: "Remis" };
// From here on every step is optional: the player may skip to the summary.
const FIRST_OPTIONAL = 6;

const injuryDice = (unit) => (R.injuryKind(unit) === "hero" ? 2 : 1);
// Rolled injuries the player has not applied yet.
const rolledInjuries = (post) =>
  R.injuryTasks(post).filter(
    (t) =>
      !post.injuries[t.key] &&
      R.validDice(post.injuryDrafts?.[t.key]?.dice, injuryDice(t.unit)),
  );
// Applies every rolled injury that needs no further input; the others stay
// on their cards with the reason shown there.
const applyRolledInjuries = (post) => {
  let current = post;
  rolledInjuries(post).forEach(({ key }) => {
    const next = R.clone(current);
    const task = R.injuryTasks(next).find((t) => t.key === key);
    const draft = next.injuryDrafts[key];
    try {
      const result = R.injuryResult(
        task.unit,
        draft.dice,
        companyInjuryModifier(next, task.unit),
      );
      R.applyInjury(next, task, result, draft);
      current = next;
    } catch {
      // Left for the card: a follow-up roll or choice is still missing.
    }
  });
  return current;
};
const withClone = (post, fn) => {
  const next = R.clone(post);
  fn(next);
  return next;
};

// What the main button does on a step before moving on: the step's own
// confirmation, when nothing else has to be decided for it.
const pendingAction = (stage, battle, post, notes, army) => {
  if (!post) return null;
  if (stage === 1) {
    const n = rolledInjuries(post).length;
    return n
      ? {
          label: n > 1 ? `Zastosuj obrażenia (${n}) i dalej` : "Zastosuj obrażenia i dalej",
          run: applyRolledInjuries,
        }
      : null;
  }
  if (stage === 2 && !post.expApplied)
    return {
      label: "Nalicz doświadczenie i dalej",
      run: (p) => withClone(p, R.applyExperience),
    };
  if (stage === 3 && !post.campaignPointsApplied)
    return {
      label: "Zatwierdź punkty i dalej",
      run: (p) => withClone(p, (c) => applyCampaignPoints(c, battle, notes)),
    };
  if (stage === 4 && !post.explorationApplied) {
    const x = explorationState(battle, post, army);
    if (!x.result) return null;
    // Rerolls and the encounter's choices are made on the locked pool.
    if (!x.e.locked && (x.rerolls > 0 || !x.plan.ready))
      return {
        label: "Zatwierdź wynik eksploracji",
        stay:
          x.rerolls > 0
            ? "Pula zatwierdzona. Użyj przerzutów z zasad albo przejdź dalej."
            : "Pula zatwierdzona. Rozstrzygnij zdarzenie z eksploracji.",
        run: (p) =>
          withClone(p, (c) => {
            c.exploration = { ...x.e, locked: true, originalDice: [...x.e.dice] };
          }),
      };
    return x.plan.ready && x.autoTotals
      ? {
          label: "Zatwierdź eksplorację i dalej",
          run: (p) => withClone(p, (c) => applyExploration(c, battle, army)),
        }
      : null;
  }
  if (stage === 5 && !post.lootSold) {
    const q = lootQuote(battle, post);
    if (q.needsCp) return null;
    return {
      label: q.quantity
        ? `Sprzedaj ${q.quantity} za ${q.gold} zk i dalej`
        : "Bez sprzedaży łupów, dalej",
      run: (p) => withClone(p, (c) => applyLootSale(c, battle)),
    };
  }
  return null;
};

// Why the sequence cannot leave a step yet, or "" when it can.
const blocker = (stage, battle, post, notes, army) => {
  if (stage === 1) {
    if (R.injuryTasks(post).some((t) => !post.injuries[t.key]))
      return "Rozstrzygnij obrażenia wszystkich modeli WzA.";
    if (post.dissolved) return "";
    const succession = R.leaderSuccession(post);
    if (succession?.dissolves) return "Potwierdź rozpad kompanii nieumarłych.";
    if (succession?.candidates.length && !post.succession)
      return "Wskaż nowego dowódcę kompanii.";
  }
  if (stage === 2) {
    if (!post.expApplied) return "Nalicz PD i rozstrzygnij wszystkie awanse.";
    if (post.advances.some((a) => !a.resolved))
      return "Rozstrzygnij wszystkie awanse poniżej.";
    if (sanityTasks(post).length)
      return "Rozstrzygnij choroby psychiczne z nowych progów Obłędu.";
    if (post.underdog && !post.underdogGoldApplied)
      return "Rzuć na dodatkowe złote korony Żółtodziobów.";
  }
  if (
    stage === 3 &&
    (!post.campaignPointsApplied ||
      companyChoices(post, notes).some((c) => !c.selected))
  )
    return post.campaignPointsApplied
      ? "Wybierz rozwinięcie kompanii."
      : "Zatwierdź punkty kampanii.";
  if (stage === 4) {
    if (!post.explorationApplied) {
      const x = explorationState(battle, post, army);
      if (!x.result) return "Rzuć kości eksploracji.";
      if (!x.plan.ready)
        return x.plan.error || "Rozstrzygnij zdarzenie z eksploracji.";
      if (!x.autoTotals) return "Wykonaj rzuty z zasad kompanii.";
      return "Zatwierdź eksplorację.";
    }
    if (post.advances.some((a) => !a.resolved))
      return "Rozstrzygnij awanse z eksploracji.";
  }
  if (stage === 5 && !post.lootSold)
    return lootQuote(battle, post).needsCp
      ? "Rzuć test CP dowódcy (Rozrzutność)."
      : "Zatwierdź sprzedaż lub pozostawienie łupów.";
  if (stage === 7 && post.effects?.strigosTheftPending)
    return "Zakończ handel z taborytami i rozstrzygnij kradzież.";
  if (
    stage === 8 &&
    dramaWageUnits(post).some((u) => !post.dramaWages?.[u.uniqueId])
  )
    return "Rozlicz żołd Postaci Dramatu.";
  if (stage === 9 && post.craftQuote && !post.craftQuote.used)
    return "Rozstrzygnij rozpoczętą próbę rzemiosła.";
  if (stage === 9 && wageUnits(post).some((u) => !post.wages?.[u.uniqueId]))
    return "Wypłać żołd albo odpraw Najemne Ostrza.";
  return "";
};
const safePrestige = (units) => {
  try {
    return getPrestige(units)[0];
  } catch {
    return null;
  }
};

function UnderdogGold({ post, update }) {
  const bonus = post.underdog;
  const [dice, setDice] = useRollDraft(post, update, "underdog-gold");
  if (!bonus) return null;
  const total = R.validDice(dice, bonus.dice) ? bonus.gold + R.sum(dice) : null;
  return (
    <section className="campaign-card">
      <h3>Żółtodzioby (różnica prestiżu {bonus.diff})</h3>
      <p>
        Każdy uczestniczący bohater i grupa stronników otrzymuje +{bonus.exp}{" "}
        PD (wliczone w naliczanie). Zasady na tę sekwencję:{" "}
        {bonus.rules.join(", ")}.
      </p>
      {post.underdogGoldApplied ? (
        <p>Dodano {post.underdogGoldApplied} zk do skarbca.</p>
      ) : (
        <>
          <DiceInput
            label={`Dodatkowe zk: ${bonus.gold}+${bonus.dice}K6`}
            count={bonus.dice}
            value={dice}
            onChange={setDice}
          />
          <button
            className="button"
            disabled={total === null}
            onClick={() =>
              update((p) => {
                p.treasury += total;
                p.underdogGoldApplied = total;
                R.log(
                  p,
                  "income",
                  `Żółtodzioby: ${bonus.gold} + ${dice.join("+")} = ${total} zk.`,
                );
              })
            }
          >
            Dodaj {total ?? "…"} zk do skarbca
          </button>
        </>
      )}
    </section>
  );
}

function Succession({ post, update }) {
  const s = R.leaderSuccession(post);
  if (!s || R.injuryTasks(post).some((t) => !post.injuries[t.key])) return null;
  const chosen = post.units.find((u) => u.uniqueId === post.succession);
  return (
    <section className="campaign-card">
      <h3>Śmierć dowódcy: {R.label(s.leader)}</h3>
      {s.undead && (
        <p>
          Kompania nieumarłych: dowództwo obejmuje Nekromanta, Licz lub Profeta
          (s. 409). Poległego dowódcę można zrekrutować ponownie w następnej
          sekwencji, jeśli opiekun zrzeknie się dowodzenia.
        </p>
      )}
      <p className="campaign-source">
        Nowy DOWÓDCA, gdy osiągnie kolejny poziom, przejmuje zasady poprzednika
        (Mag, Duchowny, Kowal run…) opisane w kompanii.
      </p>
      {post.dissolved ? (
        <p className="campaign-error">
          Kompania rozpadła się. Zapisz rozliczenie i zrekrutuj nową drużynę.
        </p>
      ) : chosen ? (
        <p className="campaign-done">✓ Dowództwo objął {R.label(chosen)}</p>
      ) : s.dissolves ? (
        <>
          <p>
            W kompanii nie ma Nekromanty, Licza ani Profety: czar utrzymujący
            ożywieńców zostaje rozproszony. Wszystkie postacie i ekwipunek
            zostają stracone.
          </p>
          <button
            className="button"
            onClick={() => {
              if (
                window.confirm(
                  "Rozwiązać kompanię? Wszystkie postacie i ekwipunek przepadną.",
                )
              )
                update((p) => R.dissolveCompany(p));
            }}
          >
            Kompania rozpada się
          </button>
        </>
      ) : !s.candidates.length ? (
        <p>Brak bohatera, który może objąć dowództwo.</p>
      ) : (
        <>
          {s.tied.length > 1 && !s.undead && (
            <p>Remis CP i PD: wybierz zwycięzcę rzutu kością.</p>
          )}
          {(s.undead ? s.candidates : s.tied).map((u) => (
            <button
              key={u.uniqueId}
              className="button"
              onClick={() => update((p) => R.assignLeader(p, u.uniqueId))}
            >
              Dowódca: {R.label(u)} (CP {R.currentStats(u)[8]}, {u.exp || 0} PD)
            </button>
          ))}
        </>
      )}
    </section>
  );
}

// One tap rolls the injury dice of every model still waiting for a roll.
function RollAllInjuries({ post, update }) {
  const waiting = R.injuryTasks(post).filter(
    (t) =>
      !post.injuries[t.key] &&
      !(post.injuryDrafts?.[t.key]?.dice || []).some((d) => d !== "" && d != null),
  );
  if (waiting.length < 2) return null;
  return (
    <div className="campaign-bulk">
      <span>
        {waiting.length} modeli czeka na rzut obrażeń.
      </span>
      <button
        type="button"
        className="button button-secondary"
        onClick={() =>
          update((p) => {
            p.injuryDrafts = p.injuryDrafts || {};
            waiting.forEach((t) => {
              p.injuryDrafts[t.key] = {
                secondary: [],
                note: "",
                resolved: false,
                ...p.injuryDrafts[t.key],
                dice: R.roll(injuryDice(t.unit)),
                source: "app",
              };
            });
          })
        }
      >
        <i className="fa-solid fa-dice" aria-hidden="true"></i> Rzuć za
        wszystkich
      </button>
    </div>
  );
}

// Hand-offs from a campaign game arrive filled in: their editors start folded.
const Collapsible = ({ collapsed, title, children }) =>
  collapsed ? (
    <details className="campaign-section">
      <summary>{title}</summary>
      {children}
    </details>
  ) : (
    children
  );

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

export default function CampaignManager({
  unitList,
  setUnitList,
  army,
  campaignNotes,
  setCampaignNotes,
  onFinish,
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  // The last saved sequence, shown until the next skirmish starts.
  const [finished, setFinished] = useState(null);
  const campaign = {
    ...R.campaignDefaults(),
    ...(campaignNotes.campaign || {}),
  };
  const battle = campaign.activeBattle;
  const post = battle?.post;
  const setCampaign = (next) =>
    setCampaignNotes((current) => ({ ...current, campaign: next }));
  const setBattle = (next) => setCampaign({ ...campaign, activeBattle: next });
  // Several draft setters can run in one event (e.g. finish a test and clear
  // its dice). Compose those edits before React renders the next snapshot.
  const latestPost = useRef(post);
  latestPost.current = post;
  const update = (fn) => {
    try {
      const p = R.clone(latestPost.current);
      fn(p);
      latestPost.current = p;
      setBattle({ ...battle, post: p });
      setError("");
      setNotice("");
    } catch (e) {
      setError(e.message);
    }
  };
  // Leaves the current step: runs its confirmation (only when `act`), checks
  // what is still open and moves on. Returns the battle and why it stopped.
  const stepOnce = (b, act) => {
    if (b.stage === 0 && b.post) return { battle: { ...b, stage: 1 } };
    if (b.stage === 0) {
      if (oldWoundUnits(unitList).some((u) => !b.preBattle?.[u.uniqueId]))
        return {
          battle: b,
          error: "Rozstrzygnij testy starych wojennych ran przed potyczką.",
        };
      if (!b.gameName.trim())
        return { battle: b, error: "Wpisz nazwę potyczki." };
      return {
        battle: R.beginPostBattle(
          { ...b, ownPrestige: safePrestige(unitList) ?? 0 },
          unitList,
          campaignNotes,
          army,
        ),
      };
    }
    const action = act && pendingAction(b.stage, b, b.post, campaignNotes, army);
    let p = action ? action.run(b.post) : b.post;
    if (action?.stay) return { battle: { ...b, post: p }, notice: action.stay };
    const reason = blocker(b.stage, b, p, campaignNotes, army);
    // After a confirmation, what is left is the next thing to do, not a mistake.
    if (reason)
      return { battle: { ...b, post: p }, [action ? "notice" : "error"]: reason };
    if (b.stage === 1 && p.dissolved)
      return { battle: { ...b, post: p, stage: 11 } };
    // Trading opens with the availability pool already drawn up (s. 426).
    if (b.stage === 6 && !p.availability) {
      p = p === b.post ? R.clone(p) : p;
      R.createAvailabilityPool(p);
    }
    return { battle: { ...b, post: p, stage: Math.min(11, b.stage + 1) } };
  };
  const [notice, setNotice] = useState("");
  // Moves forward to `target`, confirming only the current step; a later
  // step that still needs the player stops the jump there.
  const goTo = (target) => {
    setError("");
    setNotice("");
    try {
      let b = battle;
      let first = true;
      while (b.stage < target) {
        const r = stepOnce(b, first);
        first = false;
        b = r.battle;
        if (r.error || r.notice) {
          const stopped = target > b.stage + 1 && b.stage !== battle.stage;
          if (r.error)
            setError(stopped ? `${STEPS[b.stage]}: ${r.error}` : r.error);
          else setNotice(r.notice);
          break;
        }
      }
      setBattle(b);
    } catch (e) {
      setError(e.message);
    }
  };
  const next = () => goTo((battle.stage || 0) + 1);
  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      if (sanityTasks(post).length)
        throw Error("Rozstrzygnij choroby psychiczne z nowych progów Obłędu.");
      const result = R.finalizePostBattle(battle, campaignNotes);
      const outcome = await onFinish({
        ...result,
        campaignGame: battle.campaignGame || null,
      });
      setUnitList(result.units);
      setCampaignNotes(result.notes);
      setFinished({
        name: battle.gameName,
        campaignId: outcome?.campaignId || null,
        uploaded: !!outcome?.uploaded,
      });
    } catch (e) {
      setError(
        `Nie zapisano zakończenia: ${e.message}. Wersja robocza pozostaje do ponownej próby.`,
      );
    } finally {
      setSaving(false);
    }
  };
  const phase = battle?.stage || 0;
  // What "Nalicz doświadczenie" will give each model, shown before applying.
  let expPreview = null;
  if (phase === 2 && post && !post.expApplied) {
    try {
      const next = R.clone(post);
      R.applyExperience(next);
      expPreview = Object.fromEntries(next.units.map((u) => [u.uniqueId, u.exp || 0]));
    } catch {
      expPreview = null;
    }
  }
  const fromCampaign = !!battle?.campaignGame?.gameId;
  const panel = useRef(null);
  const previousStage = useRef(phase);
  useEffect(() => {
    if (previousStage.current !== phase) {
      panel.current?.scrollIntoView?.({ block: "start", behavior: "instant" });
      panel.current?.focus({ preventScroll: true });
    }
    previousStage.current = phase;
  }, [phase]);
  return (
    <section ref={panel} tabIndex={-1} className="campaign" aria-label="Prowadzenie kampanii">
      {!battle && <h2>Kampania</h2>}
      {!battle && error && (
        <p role="alert" className="campaign-error">
          {error}
        </p>
      )}
      {!battle && finished && (
        <section className="campaign-finished" role="status">
          <p className="campaign-done">
            ✓ Zapisano rozliczenie: {finished.name}
          </p>
          {finished.campaignId &&
            (finished.uploaded ? (
              <p>Rozpiska w kampanii została zaktualizowana.</p>
            ) : (
              <p className="campaign-error">
                Nie udało się zaktualizować rozpiski w kampanii. Wgraj ją na
                stronie kampanii.
              </p>
            ))}
          {finished.campaignId && (
            <a className="button" href={`/campaigns/${finished.campaignId}`}>
              Wróć do kampanii
            </a>
          )}
        </section>
      )}
      {!battle ? (
        <>
          <p className="campaign-lead">
            Rozpocznij potyczkę, zaznacz uczestników i zapisuj PD oraz modele
            wyłączone z akcji w panelach jednostek.
          </p>
          <details>
            <summary>Ustawienia kampanii</summary>
            <p>
              Dodatkowe reguły są włączane osobno. Ich efekty zapisujesz przy
              postaciach i w dzienniku rozliczenia.
            </p>
            <div className="campaign-row">
              {Object.keys(campaign.settings).map((key) => (
                <React.Fragment key={key}>
                  {checkLabel(
                    {
                      obled: "Obłęd i Mroczne Pakty",
                      choroby: "Choroby psychiczne",
                      mutacje: "Stygmaty Chaosu",
                    }[key] || key,
                    campaign.settings[key],
                    (value) =>
                      setCampaign({
                        ...campaign,
                        settings: { ...campaign.settings, [key]: value },
                      }),
                  )}
                </React.Fragment>
              ))}
            </div>
          </details>
          <button
            className="button"
            disabled={!unitList.length}
            onClick={() => {
              const units = R.clone(unitList).map((u) => ({
                ...u,
                battleExp: 0,
                battleKills: 0,
                battleObled: 0,
                battlePacts: 0,
                battleOutOfActionModels: Array.from(
                  { length: R.modelCount(u) },
                  () => false,
                ),
                battleAbsentModels: Array.from(
                  { length: R.modelCount(u) },
                  (_, i) =>
                    !!u.campaignModelStatus?.[i]?.captured ||
                    (u.campaignModelStatus?.[i]?.skip || 0) > 0,
                ),
              }));
              setUnitList(units);
              setFinished(null);
              setBattle(R.newBattle(units));
            }}
          >
            Rozpocznij potyczkę
          </button>
        </>
      ) : (
        <>
          <div className="campaign-head">
            <p className="campaign-overline">
              {battle.gameName || "Nowa potyczka"}
            </p>
            <div className="campaign-head-row">
              <h2>{phase ? STEPS[phase] : "Przebieg potyczki"}</h2>
              <label className="campaign-step-picker">
                <span>
                  Krok {phase + 1}/{STEPS.length}
                </span>
                <select
                  aria-label="Etap kampanii"
                  value={phase}
                  onChange={(e) => {
                    const stage = Number(e.target.value);
                    if (stage < phase && !(stage === 0 && post)) {
                      setError("");
                      setNotice("");
                      setBattle({ ...battle, stage });
                    }
                    else if (stage > phase) goTo(stage);
                  }}
                >
                  {STEPS.map((s, i) => (
                    <option
                      key={s}
                      value={i}
                      disabled={(i === 0 && !!post) || (!post && i > 1)}
                    >
                      {i < phase ? "✓ " : ""}
                      {i}. {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div
              className="campaign-progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-valuenow={phase + 1}
              aria-label={`Postęp sekwencji: etap ${phase + 1} z ${STEPS.length}`}
            >
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={i < phase ? "done" : i === phase ? "current" : ""}
                />
              ))}
            </div>
            <p className="campaign-lead">{LEADS[phase]}</p>
            {post && (
              <p className="campaign-status">
                <span>
                  Skarbiec <strong>{post.treasury} zk</strong>
                </span>
                <span>
                  Łupy <strong>{post.loot}</strong>
                </span>
                {post.advances.some((x) => !x.resolved) && (
                  <span className="is-pending">
                    Awanse do wyboru{" "}
                    <strong>{post.advances.filter((x) => !x.resolved).length}</strong>
                  </span>
                )}
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="campaign-error">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="campaign-notice">
              {notice}
            </p>
          )}
          {phase === 0 ? (
            <>
              <PreBattle
                units={unitList}
                setUnits={setUnitList}
                battle={battle}
                setBattle={setBattle}
              />
              {(campaign.futureEffects || [])
                .filter((e) => !e.area || e.area === battle.area)
                .map((e) => (
                  <p className="campaign-card" key={e.id || e.key}>
                    Efekt wcześniejszej potyczki: {e.label}
                  </p>
                ))}
              {!!campaign.companyAdvancements?.length && (
                <details>
                  <summary>
                    Zasady kompanii do przygotowania i rozegrania potyczki
                  </summary>
                  {campaign.companyAdvancements.map((e) => (
                    <p key={e.id}>
                      <strong>{e.name}</strong>: {e.text}
                    </p>
                  ))}
                </details>
              )}
              {fromCampaign && (
                <section className="campaign-card campaign-handoff">
                  <h3>Gra z kampanii</h3>
                  <p>
                    {[
                      battle.scenario,
                      battle.opponent && `vs ${battle.opponent}`,
                      RESULTS[battle.result],
                      `runda ${battle.round}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="campaign-source">
                    Wyłączenia z akcji, pokonani wrogowie i PD zostały przeniesione z
                    ekranu gry. Sprawdź je i rozpocznij sekwencję.
                  </p>
                </section>
              )}
              <Collapsible
                collapsed={fromCampaign}
                title={`Popraw przebieg potyczki (WzA: ${unitList.reduce(
                  (n, u) =>
                    n + (u.battleOutOfActionModels || []).filter(Boolean).length,
                  0,
                )})`}
              >
                <BattleTracker units={unitList} setUnits={setUnitList} />
              </Collapsible>
              <Collapsible collapsed={fromCampaign} title="Popraw dane potyczki">
              {!fromCampaign && <h3>Dane potyczki</h3>}
              <div className="campaign-grid campaign-battle-data">
                <label>
                  Nazwa potyczki
                  <input
                    value={battle.gameName}
                    onChange={(e) =>
                      setBattle({ ...battle, gameName: e.target.value })
                    }
                  />
                </label>
                <label>
                  Przeciwnik
                  <input
                    value={battle.opponent}
                    onChange={(e) =>
                      setBattle({ ...battle, opponent: e.target.value })
                    }
                  />
                </label>
                <label>
                  Wynik
                  <select
                    value={battle.result}
                    onChange={(e) =>
                      setBattle({ ...battle, result: e.target.value })
                    }
                  >
                    <option value="win">Zwycięstwo</option>
                    <option value="loss">Porażka</option>
                    <option value="draw">Remis</option>
                  </select>
                </label>
                <label>
                  Data
                  <input
                    type="date"
                    value={battle.date}
                    onChange={(e) =>
                      setBattle({ ...battle, date: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="campaign-battle-scenario" role="group" aria-label="Scenariusz">
                <span className="campaign-field-label">Scenariusz</span>
                <Suspense fallback={<p className="campaign-source">Wczytywanie scenariuszy…</p>}>
                  <ScenarioField battle={battle} setBattle={setBattle} />
                </Suspense>
              </div>
              <div className="campaign-grid campaign-battle-data">
                <label>
                  Obszar
                  <select
                    value={battle.area}
                    disabled={!!battle.scenarioRecord?.area}
                    title={battle.scenarioRecord?.area ? "Obszar wynika ze scenariusza" : undefined}
                    onChange={(e) =>
                      setBattle({ ...battle, area: e.target.value })
                    }
                  >
                    <option value="inside">Wewnątrz murów</option>
                    <option value="outside">Poza murami</option>
                  </select>
                </label>
              </div>
              <h4 className="campaign-subhead">Do punktów kampanii</h4>
              <div className="campaign-grid campaign-battle-data">
                <label>
                  Runda zakończenia
                  <NumberInput
                    type="number"
                    min="1"
                    value={battle.round}
                    onChange={(e) =>
                      setBattle({
                        ...battle,
                        round: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </label>
                <label>
                  Modele przeciwnika
                  <NumberInput
                    type="number"
                    min="0"
                    value={battle.opponentModels}
                    onChange={(e) =>
                      setBattle({
                        ...battle,
                        opponentModels: Math.max(0, Number(e.target.value)),
                        opponentOut: Math.min(
                          Math.max(0, Number(e.target.value)),
                          battle.opponentOut,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Modele przeciwnika WzA
                  <NumberInput
                    type="number"
                    min="0"
                    max={battle.opponentModels}
                    value={battle.opponentOut}
                    onChange={(e) =>
                      setBattle({
                        ...battle,
                        opponentOut: Math.max(
                          0,
                          Math.min(
                            battle.opponentModels,
                            Number(e.target.value),
                          ),
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Prestiż przeciwnika
                  <NumberInput
                    type="number"
                    min="0"
                    value={battle.opponentPrestige || 0}
                    onChange={(e) =>
                      setBattle({
                        ...battle,
                        opponentPrestige: Math.max(0, Number(e.target.value)),
                      })
                    }
                  />
                </label>
                <p className="campaign-source wide">
                  Prestiż Twojej kompanii: {safePrestige(unitList) ?? "?"}
                  {(() => {
                    const b = R.underdogBonus(
                      safePrestige(unitList),
                      battle.opponentPrestige,
                    );
                    return b
                      ? ` · Żółtodzioby (różnica ${b.diff}): ${b.rules.join(", ")}, +${b.exp} PD, ${b.gold}+${b.dice}K6 zk`
                      : " · bez premii Żółtodziobów (różnica do 50).";
                  })()}
                </p>
              </div>
              <details className="campaign-section">
                <summary>Notatki{battle.notes ? " ✓" : ""}</summary>
              <label>
                Notatki
                <textarea
                  value={battle.notes}
                  onChange={(e) =>
                    setBattle({ ...battle, notes: e.target.value })
                  }
                />
              </label>
              </details>
              </Collapsible>
            </>
          ) : (
            <>
              {phase === 1 && (
                <>
                  <RollAllInjuries post={post} update={update} />
                  {R.injuryTasks(post).length ? (
                    R.injuryTasks(post).map((task) => (
                      <InjuryCard
                        key={task.key}
                        task={task}
                        post={post}
                        update={update}
                      />
                    ))
                  ) : (
                    <p>
                      Żaden uczestniczący model nie został wyłączony z akcji.
                    </p>
                  )}
                  <Succession post={post} update={update} />
                </>
              )}
              {phase === 2 && (
                <>
                  <p className="campaign-muted">
                    +1 PD za przeżycie, bohaterowie +1 za każdego wroga WzA.
                    Dodatkowe PD (scenariusz, zdarzenia) wpisz przy postaci.
                    {post.underdog
                      ? ` Żółtodzioby: +${post.underdog.exp} PD dla każdego uczestnika (bez Najemnych Ostrzy).`
                      : ""}
                  </p>
                  <UnderdogGold post={post} update={update} />
                  <ul className="campaign-xp-list">
                    {post.units.map((u) => {
                      const after = expPreview?.[u.uniqueId];
                      const earns = R.canEarnExperience(u);
                      return (
                        <li key={u.uniqueId}>
                          <div className="campaign-xp-name">
                            <strong>{R.label(u)}</strong>
                            {earns ? (
                              u.battleKills > 0 && (
                                <small>Wrogowie WzA: {u.battleKills}</small>
                              )
                            ) : (
                              <small className="campaign-no-experience">Nie zdobywa PD</small>
                            )}
                          </div>
                          <span className="campaign-xp-value">
                            {after != null && after !== (u.exp || 0) ? (
                              <>
                                {u.exp || 0} → <strong>{after}</strong> PD
                              </>
                            ) : (
                              <>
                                <strong>{u.exp || 0}</strong> PD
                              </>
                            )}
                          </span>
                          {!post.expApplied && earns && (
                            <label className="campaign-xp-extra">
                              <span>Dodatkowe</span>
                              <NumberInput
                                aria-label={`Dodatkowe PD: ${R.label(u)}`}
                                type="number"
                                min="0"
                                value={u.battleExp || 0}
                                onChange={(e) =>
                                  update((p) => {
                                    p.units.find(
                                      (x) => x.uniqueId === u.uniqueId,
                                    ).battleExp = Math.max(
                                      0,
                                      Number(e.target.value),
                                    );
                                  })
                                }
                              />
                            </label>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {post.expApplied && (
                    <p className="campaign-done">✓ Doświadczenie naliczone</p>
                  )}
                  {post.advances.map((a) => (
                    <AdvanceCard
                      key={a.id}
                      advance={a}
                      unit={post.units.find((u) => u.uniqueId === a.unitId)}
                      army={army}
                      post={post}
                      update={update}
                    />
                  ))}
                </>
              )}
              {phase === 3 && (
                <CampaignPoints
                  battle={battle}
                  post={post}
                  update={update}
                  notes={campaignNotes}
                />
              )}
              {phase === 4 && (
                <Exploration
                  battle={battle}
                  post={post}
                  update={update}
                  army={army}
                />
              )}
              {phase === 5 && (
                <LootSale
                  battle={battle}
                  post={post}
                  update={update}
                  setBattle={setBattle}
                />
              )}
              {phase === 6 && (
                <div className="campaign-recruitment-sections">
                  <section className="campaign-card" aria-label="Pula PD rekrutów">
                    <h3>1. Pula PD rekrutów</h3>
                    <RecruitBudget post={post} update={update} />
                  </section>
                  <section className="campaign-card" aria-label="Dołącz rekruta do grupy">
                    <h3>2. Dołącz rekruta do grupy</h3>
                    <ExperiencedRecruits post={post} update={update} army={army} />
                  </section>
                </div>
              )}
              {phase === 7 && <Trade post={post} update={update} army={army} />}
              {phase === 8 && <Drama post={post} update={update} army={army} />}
              {phase === 9 && (
                <>
                  <Wages post={post} update={update} />
                  <ImmortalRecruits post={post} update={update} army={army} />
                  <Recruitment post={post} update={update} army={army} />
                  {post.effects?.strigosDiscount || post.tradeClosed ? (
                    <p className="campaign-source">
                      Handel w tej sekwencji odbył się z taborytami Strigosu i
                      został zamknięty w kroku 7.
                    </p>
                  ) : (
                    <details className="campaign-card">
                      <summary>Kup ekwipunek powszechny (nowi rekruci)</summary>
                      <Trade post={post} update={update} army={army} commonOnly />
                    </details>
                  )}
                  {post.units.some((u) => R.isGroup(u) && R.groupSize(u) > 0) && (
                    <details className="campaign-card">
                      <summary>Podziel lub połącz grupy stronników</summary>
                      <GroupManager post={post} update={update} />
                    </details>
                  )}
                  <Crafting post={post} update={update} />
                </>
              )}
              {phase === 10 && (
                <Inventory post={post} update={update} army={army} />
              )}
              {phase === 11 && (
                <>
                  <p className="campaign-source">
                    {[
                      battle.date,
                      battle.opponent,
                      battle.scenario,
                      RESULTS[battle.result],
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <dl className="campaign-summary">
                    <div>
                      <dt>Skarbiec</dt>
                      <dd>
                        {Number(campaignNotes.skarbiec) || 0} →{" "}
                        <strong>{post.treasury} zk</strong>
                      </dd>
                    </div>
                    <div>
                      <dt>Łupy</dt>
                      <dd>
                        {Number(campaignNotes.kosztownosci) || 0} →{" "}
                        <strong>{post.loot}</strong>
                      </dd>
                    </div>
                    <div>
                      <dt>Prestiż drużyny</dt>
                      <dd>
                        {battle.ownPrestige ?? "?"} →{" "}
                        <strong>{safePrestige(post.units) ?? "?"}</strong>
                      </dd>
                    </div>
                    <div>
                      <dt>Polegli</dt>
                      <dd>
                        {Object.values(post.injuries).filter(
                          (i) => i.status?.dead,
                        ).length || "brak"}
                      </dd>
                    </div>
                    <div>
                      <dt>Awanse</dt>
                      <dd>{post.advances.length}</dd>
                    </div>
                  </dl>
                  <p className="campaign-source">
                    Prestiż bez modeli martwych, pojmanych i pauzujących.
                  </p>
                  <p>
                    Rozliczenie zostanie zapisane raz. W razie błędu zapisu
                    będziesz mógł ponowić próbę.
                  </p>
                </>
              )}
              {phase > 4 &&
                post.advances
                  .filter((a) => !a.resolved)
                  .map((a) => (
                    <AdvanceCard
                      key={a.id}
                      advance={a}
                      unit={post.units.find((u) => u.uniqueId === a.unitId)}
                      army={army}
                      post={post}
                      update={update}
                    />
                  ))}
              {post.expApplied && <SanityTasks post={post} update={update} />}
              <details className="campaign-more campaign-extras">
                <summary>Więcej: zasady, dziennik, narzędzia</summary>
                {PAGES[phase] && <Reference pages={PAGES[phase]} />}
                <details>
                  <summary>Dziennik rozliczenia ({post.journal.length})</summary>
                  <ul className="campaign-journal">
                    {post.journal.map((e) => (
                      <li key={e.id}>{e.text}</li>
                    ))}
                  </ul>
                </details>
                {phase !== 11 && (
                  <details className="campaign-tools">
                    <summary>Narzędzia: testy, żołd, korekty</summary>
                    <RollNotebook post={post} update={update} />
                    <EconomyAdjustment post={post} update={update} />
                    <UnitAdjustments post={post} update={update} />
                    {campaign.settings.mutacje && (
                      <Mutations post={post} update={update} />
                    )}
                  </details>
                )}
              </details>
            </>
          )}
          <div className="campaign-footer">
            <button
              className="button button-secondary"
              disabled={saving}
              onClick={() => {
                if (
                  window.confirm(
                    "Anulować całą bieżącą potyczkę i jej rozliczenie?",
                  )
                )
                  setBattle(null);
              }}
            >
              Anuluj potyczkę
            </button>
            <div className="campaign-footer-main">
              {phase >= FIRST_OPTIONAL && phase < 10 && (
                <button
                  className="button button-ghost"
                  disabled={saving}
                  onClick={() => goTo(11)}
                >
                  Pomiń do podsumowania
                </button>
              )}
              {phase < 11 ? (
                <button className="button" disabled={saving} onClick={next}>
                  {phase === 0
                    ? "Rozpocznij sekwencję po potyczce"
                    : pendingAction(phase, battle, post, campaignNotes, army)
                        ?.label || `Dalej: ${STEPS[phase + 1]}`}
                </button>
              ) : (
                <button className="button" disabled={saving} onClick={finish}>
                  {saving
                    ? "Zapisywanie…"
                    : "Zapisz rozliczenie i zakończ potyczkę"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
      {campaign.history.length > 0 && (
        <details className="campaign-card">
          <summary>Historia kampanii ({campaign.history.length})</summary>
          {[...campaign.history].reverse().map((h) => (
            <details key={h.id}>
              <summary>
                {h.date} · {h.gameName} · {h.opponent}
              </summary>
              <p>
                {[h.scenario, RESULTS[h.result] || h.result, h.notes]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <ul>
                {h.journal.map((e) => (
                  <li key={e.id}>{e.text}</li>
                ))}
              </ul>
            </details>
          ))}
        </details>
      )}
    </section>
  );
}
