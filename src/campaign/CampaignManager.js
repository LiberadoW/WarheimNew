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
import CampaignPoints from "./CampaignPoints";
import LootSale from "./LootSale";
import Exploration from "./Exploration";
import UnitAdjustments from "./UnitAdjustments";
import AdvanceCard from "./Advancement";
import InjuryCard from "./InjuryCard";
import React, { useEffect, useRef, useState } from "react";
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
  const errorRef = useRef(null);
  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView?.({ block: "center", behavior: "instant" });
      errorRef.current?.focus({ preventScroll: true });
    }
  }, [error]);
  const [saving, setSaving] = useState(false);
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
    } catch (e) {
      setError(e.message);
    }
  };
  const next = () => {
    setError("");
    try {
      if (battle.stage === 0 && post) {
        setBattle({ ...battle, stage: 1 });
        return;
      }
      if (battle.stage === 0) {
        if (
          oldWoundUnits(unitList).some((u) => !battle.preBattle?.[u.uniqueId])
        )
          throw Error(
            "Rozstrzygnij testy starych wojennych ran przed potyczką.",
          );
        if (!battle.gameName.trim()) throw Error("Wpisz nazwę potyczki.");
        setBattle(
          R.beginPostBattle(
            { ...battle, ownPrestige: safePrestige(unitList) ?? 0 },
            unitList,
            campaignNotes,
            army,
          ),
        );
        return;
      }
      if (
        battle.stage === 1 &&
        R.injuryTasks(post).some((t) => !post.injuries[t.key])
      )
        throw Error("Rozstrzygnij obrażenia wszystkich modeli WzA.");
      if (battle.stage === 1 && post.dissolved) {
        setBattle({ ...battle, stage: 11 });
        return;
      }
      if (
        battle.stage === 1 &&
        R.leaderSuccession(post)?.dissolves &&
        !post.dissolved
      )
        throw Error("Potwierdź rozpad kompanii nieumarłych.");
      if (
        battle.stage === 1 &&
        R.leaderSuccession(post)?.candidates.length &&
        !post.succession
      )
        throw Error("Wskaż nowego dowódcę kompanii.");
      if (
        battle.stage === 2 &&
        (!post.expApplied ||
          post.advances.some((a) => !a.resolved) ||
          sanityTasks(post).length)
      )
        throw Error("Nalicz PD i rozstrzygnij wszystkie awanse.");
      if (battle.stage === 2 && post.underdog && !post.underdogGoldApplied)
        throw Error("Rzuć na dodatkowe złote korony Żółtodziobów.");
      if (
        battle.stage === 3 &&
        (!post.campaignPointsApplied ||
          companyChoices(post, campaignNotes).some((c) => !c.selected))
      )
        throw Error("Zatwierdź punkty kampanii.");
      if (
        battle.stage === 4 &&
        (!post.explorationApplied || post.advances.some((a) => !a.resolved))
      )
        throw Error("Zatwierdź eksplorację.");
      if (battle.stage === 7 && post.effects?.strigosTheftPending)
        throw Error("Zakończ handel z taborytami i rozstrzygnij kradzież.");
      if (
        battle.stage === 8 &&
        dramaWageUnits(post).some((u) => !post.dramaWages?.[u.uniqueId])
      )
        throw Error("Rozlicz żołd Postaci Dramatu.");
      if (battle.stage === 9 && post.craftQuote && !post.craftQuote.used)
        throw Error("Rozstrzygnij rozpoczętą próbę rzemiosła.");
      if (
        battle.stage === 9 &&
        wageUnits(post).some((u) => !post.wages?.[u.uniqueId])
      )
        throw Error("Wypłać żołd albo odpraw Najemne Ostrza.");
      if (battle.stage === 5 && !post.lootSold)
        throw Error("Zatwierdź sprzedaż lub pozostawienie łupów.");
      setBattle({ ...battle, stage: Math.min(11, battle.stage + 1) });
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      if (sanityTasks(post).length)
        throw Error("Rozstrzygnij choroby psychiczne z nowych progów Obłędu.");
      const result = R.finalizePostBattle(battle, campaignNotes);
      await onFinish(result);
      setUnitList(result.units);
      setCampaignNotes(result.notes);
    } catch (e) {
      setError(
        `Nie zapisano zakończenia: ${e.message}. Wersja robocza pozostaje do ponownej próby.`,
      );
    } finally {
      setSaving(false);
    }
  };
  const phase = battle?.stage || 0;
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
        <p ref={errorRef} tabIndex={-1} role="alert" className="campaign-error">
          {error}
        </p>
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
                  {phase + 1}/{STEPS.length}
                </span>
                <select
                  aria-label="Etap kampanii"
                  value={phase}
                  onChange={(e) => {
                    const stage = Number(e.target.value);
                    if (stage < phase && !(stage === 0 && post))
                      setBattle({ ...battle, stage });
                  }}
                >
                  {STEPS.map((s, i) => (
                    <option
                      key={s}
                      value={i}
                      disabled={i > phase || (i === 0 && !!post)}
                    >
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
              <dl className="campaign-meters">
                <div>
                  <dt>Skarbiec</dt>
                  <dd>{post.treasury} zk</dd>
                </div>
                <div>
                  <dt>Łupy</dt>
                  <dd>{post.loot}</dd>
                </div>
                <div>
                  <dt>Awanse</dt>
                  <dd>
                    {post.advances.filter((x) => !x.resolved).length
                      ? `${post.advances.filter((x) => !x.resolved).length} do wyboru`
                      : "—"}
                  </dd>
                </div>
              </dl>
            )}
          </div>
          <nav className="campaign-nav" aria-label="Sekwencja po potyczce">
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s}
                disabled={i > phase || (i === 0 && !!post)}
                aria-current={i === phase ? "step" : undefined}
                onClick={() => {
                  if (i < phase) setBattle({ ...battle, stage: i });
                }}
              >
                {i}. {s}
              </button>
            ))}
          </nav>
          {error && (
            <p ref={errorRef} tabIndex={-1} role="alert" className="campaign-error">
              {error}
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
              <BattleTracker units={unitList} setUnits={setUnitList} />
              <h3>Dane potyczki</h3>
              <div className="campaign-grid campaign-battle-data">
                <label className="wide">
                  Nazwa potyczki
                  <input
                    value={battle.gameName}
                    onChange={(e) =>
                      setBattle({ ...battle, gameName: e.target.value })
                    }
                  />
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
                <label className="wide">
                  Przeciwnik
                  <input
                    value={battle.opponent}
                    onChange={(e) =>
                      setBattle({ ...battle, opponent: e.target.value })
                    }
                  />
                </label>
                <label className="wide">
                  Scenariusz
                  <input
                    value={battle.scenario}
                    onChange={(e) =>
                      setBattle({ ...battle, scenario: e.target.value })
                    }
                  />
                </label>
                <label>
                  Obszar
                  <select
                    value={battle.area}
                    onChange={(e) =>
                      setBattle({ ...battle, area: e.target.value })
                    }
                  >
                    <option value="inside">Wewnątrz murów</option>
                    <option value="outside">Poza murami</option>
                  </select>
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
              </div>
              <div className="campaign-grid">
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
                <p className="campaign-source">
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
              <label>
                Notatki
                <textarea
                  value={battle.notes}
                  onChange={(e) =>
                    setBattle({ ...battle, notes: e.target.value })
                  }
                />
              </label>
            </>
          ) : (
            <>
              {phase === 1 && (
                <>
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
                  <p>
                    +1 PD za przeżycie; bohaterowie dodatkowo +1 PD za
                    przeciwnika WzA. Dodatkowe PD ze scenariusza są dodawane
                    osobno.
                    {post.underdog
                      ? ` Żółtodzioby: +${post.underdog.exp} PD dla każdego uczestnika.`
                      : ""}
                  </p>
                  <UnderdogGold post={post} update={update} />
                  <table className="campaign-experience">
                    <thead>
                      <tr>
                        <th>Postać</th>
                        <th>{post.expApplied ? "Aktualne PD" : "PD przed"}</th>
                        <th>Przeciwnicy WzA</th>
                        <th>Dodatkowe PD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {post.units.map((u) => (
                        <tr key={u.uniqueId}>
                          <td data-label="Postać">{R.label(u)}{!R.canEarnExperience(u) && <small className="campaign-no-experience">Nie zdobywa PD</small>}</td>
                          <td data-label={post.expApplied ? "Aktualne PD" : "PD przed"}>{u.exp || 0}</td>
                          <td data-label="Przeciwnicy WzA">{u.battleKills || 0}</td>
                          <td data-label="Dodatkowe PD">
                            <NumberInput
                              aria-label={`Dodatkowe PD: ${R.label(u)}`}
                              type="number"
                              min="0"
                              disabled={post.expApplied || !R.canEarnExperience(u)}
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {post.expApplied ? (
                    <p className="campaign-done">✓ Doświadczenie naliczone</p>
                  ) : (
                    <button
                      className="button"
                      onClick={() => update(R.applyExperience)}
                    >
                      Nalicz doświadczenie
                    </button>
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
              {phase === 6 && <RecruitBudget post={post} update={update} />}
              {phase === 6 && (
                <ExperiencedRecruits post={post} update={update} army={army} />
              )}
              {phase === 7 && <Trade post={post} update={update} army={army} />}
              {phase === 8 && <Drama post={post} update={update} army={army} />}
              {phase === 9 && (
                <ImmortalRecruits post={post} update={update} army={army} />
              )}
              {phase === 9 && <Crafting post={post} update={update} />}
              {phase === 9 && <Wages post={post} update={update} />}
              {phase === 9 && (
                <Recruitment post={post} update={update} army={army} />
              )}
              {phase === 9 && <GroupManager post={post} update={update} />}
              {phase === 9 &&
                (post.effects?.strigosDiscount || post.tradeClosed ? (
                  <p className="campaign-source">
                    Handel w tej sekwencji odbył się z taborytami Strigosu i
                    został zamknięty w kroku 7.
                  </p>
                ) : (
                  <details className="campaign-card">
                    <summary>Kup ekwipunek powszechny (nowi rekruci)</summary>
                    <Trade post={post} update={update} army={army} commonOnly />
                  </details>
                ))}
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
              {phase !== 11 && (
                <details className="campaign-tools campaign-more">
                  <summary>Narzędzia: testy, żołd, korekty</summary>
                  <RollNotebook post={post} update={update} />
                  <EconomyAdjustment post={post} update={update} />
                  <UnitAdjustments post={post} update={update} />
                  {campaign.settings.mutacje && (
                    <Mutations post={post} update={update} />
                  )}
                </details>
              )}
              <div className="campaign-more">
                {PAGES[phase] && <Reference pages={PAGES[phase]} />}
                <details>
                  <summary>Dziennik rozliczenia ({post.journal.length})</summary>
                  <ul className="campaign-journal">
                    {post.journal.map((e) => (
                      <li key={e.id}>{e.text}</li>
                    ))}
                  </ul>
                </details>
              </div>
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
            {phase < 11 ? (
              <button className="button" disabled={saving} onClick={next}>
                {phase === 0
                  ? "Rozpocznij sekwencję po potyczce"
                  : `Dalej: ${STEPS[phase + 1]}`}
              </button>
            ) : (
              <button className="button" disabled={saving} onClick={finish}>
                {saving
                  ? "Zapisywanie…"
                  : "Zapisz rozliczenie i zakończ potyczkę"}
              </button>
            )}
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
