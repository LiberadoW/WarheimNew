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
import React, { useState } from "react";
import Reference from "./Reference";
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
  const campaign = {
    ...R.campaignDefaults(),
    ...(campaignNotes.campaign || {}),
  };
  const battle = campaign.activeBattle;
  const post = battle?.post;
  const setCampaign = (next) =>
    setCampaignNotes({ ...campaignNotes, campaign: next });
  const setBattle = (next) => setCampaign({ ...campaign, activeBattle: next });
  const update = (fn) => {
    try {
      const p = R.clone(post);
      fn(p);
      setBattle({ ...battle, post: p });
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  const next = () => {
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
        setBattle(R.beginPostBattle(battle, unitList, campaignNotes, army));
        return;
      }
      if (
        battle.stage === 1 &&
        R.injuryTasks(post).some((t) => !post.injuries[t.key])
      )
        throw Error("Rozstrzygnij obrażenia wszystkich modeli WzA.");
      if (
        battle.stage === 2 &&
        (!post.expApplied ||
          post.advances.some((a) => !a.resolved) ||
          sanityTasks(post).length)
      )
        throw Error("Nalicz PD i rozstrzygnij wszystkie awanse.");
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
  return (
    <section className="campaign" aria-label="Prowadzenie kampanii">
      <h2>Kampania</h2>
      {error && (
        <p role="alert" className="campaign-error">
          {error}
        </p>
      )}
      {!battle ? (
        <>
          <p>
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
          <div className="campaign-row">
            <strong>{battle.gameName || "Nowa potyczka"}</strong>
            <span>{STEPS[phase]}</span>
            {post && (
              <span>
                Skarbiec: {post.treasury} zk · łupy: {post.loot}
              </span>
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
              <div className="campaign-grid">
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
                  Data
                  <input
                    type="date"
                    value={battle.date}
                    onChange={(e) =>
                      setBattle({ ...battle, date: e.target.value })
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
              <label>
                Notatki
                <textarea
                  value={battle.notes}
                  onChange={(e) =>
                    setBattle({ ...battle, notes: e.target.value })
                  }
                />
              </label>
              <p>
                PD za pokonanych przeciwników i WzA zapisuj poniżej, przy
                jednostkach. Przed rozliczeniem zakończ ich uzupełnianie.
              </p>
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
                </>
              )}
              {phase === 2 && (
                <>
                  <p>
                    +1 PD za przeżycie; bohaterowie dodatkowo +1 PD za
                    przeciwnika WzA. Dodatkowe PD ze scenariusza są dodawane
                    osobno.
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th>Postać</th>
                        <th>PD przed</th>
                        <th>Przeciwnicy WzA</th>
                        <th>Dodatkowe PD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {post.units.map((u) => (
                        <tr key={u.uniqueId}>
                          <td>{R.label(u)}</td>
                          <td>{u.exp || 0}</td>
                          <td>{u.battleKills || 0}</td>
                          <td>
                            <NumberInput
                              type="number"
                              min="0"
                              disabled={post.expApplied}
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
                  <button
                    className="button"
                    disabled={post.expApplied}
                    onClick={() => update(R.applyExperience)}
                  >
                    Nalicz doświadczenie
                  </button>
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
              {phase === 10 && (
                <Inventory post={post} update={update} army={army} />
              )}
              {phase === 11 && (
                <>
                  <h3>Podsumowanie: {battle.gameName}</h3>
                  <p>
                    {battle.date} · {battle.opponent} · {battle.scenario}
                  </p>
                  <p>
                    Skarbiec: {post.treasury} zk · łupy: {post.loot}.
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
                <>
                  <RollNotebook post={post} update={update} />
                  <EconomyAdjustment post={post} update={update} />
                  <UnitAdjustments post={post} update={update} />
                  {campaign.settings.mutacje && (
                    <Mutations post={post} update={update} />
                  )}
                </>
              )}
              {PAGES[phase] && <Reference pages={PAGES[phase]} />}
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
          {post && (
            <details>
              <summary>Dziennik rozliczenia ({post.journal.length})</summary>
              <ul className="campaign-journal">
                {post.journal.map((e) => (
                  <li key={e.id}>{e.text}</li>
                ))}
              </ul>
            </details>
          )}
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
                {h.scenario} · {h.result} · {h.notes}
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
