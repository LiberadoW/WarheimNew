import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import useHidePrintSheet from "../Functions/useHidePrintSheet";
import { describeEquipment, describeRule, equipmentHint, unitEquipmentItems } from "../Functions/unitInfo";
import { normalizeRosterNames } from "../Data.js/RulebookNames";
import RulesModal from "../Components/RulesModal";
import { normalizeSpecialRules } from "../Components/CampaignPoints";
import { getDefaultCampaignNotes } from "../layouts/App";
import { ScenarioDetails } from "./ScenarioPicker";
import RandomEventRoller from "./RandomEventRoller";
import SequenceHistory from "./SequenceHistory";
import WeatherRoller, { weatherHints } from "./WeatherRoller";
import MagicPanel from "../campaign/MagicPanel";
import { OptionalRuleChips } from "./OptionalRulesPicker";
import { AREAS } from "./scenarios";
import { armourAfter, damageableArmour, damagedSave, describeDamage, isDamaged } from "../campaign/armourDamage";
import { STAT_LABELS, groupRoster } from "./roster";
import {
  companyModels,
  isHero,
  modelCount,
  modelLabel,
  modelState,
  parseModelKey,
  pdSummary,
  settlementLine,
  withGameMagic,
  toBattle,
  unitPlay,
} from "./gamePlay";
import {
  updateGame,
  setUnitMagic,
  addLogEntry,
  changeCounter,
  describeError,
  getMySavedLists,
  recordResult,
  recordTakedown,
  removeLogEntry,
  setArmourDamage,
  setModelState,
  setPlayRound,
  watchCampaign,
  watchCampaignLists,
  watchGame,
} from "./campaignService";
import "../styles/CampaignHub.css";

const STATE_LABELS = { in: "W grze", out: "WzA", absent: "Nieobecny" };

const Stepper = ({ label, value, onChange, disabled, hint }) => (
  <div className="game-stepper">
    <span className="game-stepper-label">{label}</span>
    <button type="button" aria-label={`${label}: mniej`} disabled={disabled || value <= 0} onClick={() => onChange(-1)}>
      −
    </button>
    <span className="game-stepper-value">{value}</span>
    <button type="button" aria-label={`${label}: więcej`} disabled={disabled} onClick={() => onChange(1)}>
      +
    </button>
    {hint && <span className="hub-muted">{hint}</span>}
  </div>
);

// One company: every unit with stats, short equipment, rules and the
// per-model status, kills and extra PD for this game.
// USZKODZENIE PANCERZA on the game screen: each model's armour and shield.
const ArmourDamage = ({ unit, owner, play, canEdit, run, ids }) => {
  const { armour, shield } = damageableArmour(unit);
  if (!armour && !shield) return null;
  const p = unitPlay(play, owner, unit.uniqueId);
  const n = modelCount(unit);
  const states = Array.from({ length: n }, (_, i) => modelState(play, owner, unit, i));
  const save = (i, d) =>
    run(async () => {
      await setArmourDamage(ids.c, ids.g, owner, unit.uniqueId, i, d);
      const text = describeDamage(unit, d);
      if (isDamaged(d) && text)
        await addLogEntry(ids.c, ids.g, {
          type: "armour",
          round: play?.round || 1,
          text: `${n > 1 ? modelLabel(unit, i) : unit.unitDisplayName || unit.unitName}: ${text}`,
        });
    });
  return (
    <div className="game-armour" aria-label="Uszkodzenie pancerza">
      {states.map((state, i) => {
        if (state === "unavailable") return null;
        const d = p.armour?.[i] || {};
        const steps = d.steps || 0;
        const armourGone = armour && !armourAfter(armour, steps);
        return (
          <div key={i} className="game-armour-row">
            <span className="game-armour-state">
              {n > 1 ? `${modelLabel(unit, i)}: ` : "Pancerz: "}
              {isDamaged(d) ? describeDamage(unit, d) : "cały"} · OP {damagedSave(unit, d)}
            </span>
            {canEdit && (
              <span className="game-armour-actions">
                {armour && !armourGone && (
                  <button type="button" className="button button-secondary button-small" onClick={() => save(i, { ...d, steps: steps + 1 })}>
                    Uszkodź pancerz
                  </button>
                )}
                {shield && !d.shield && (
                  <button type="button" className="button button-secondary button-small" onClick={() => save(i, { ...d, shield: true })}>
                    Zniszcz tarczę
                  </button>
                )}
                {isDamaged(d) && (
                  <button type="button" className="button button-ghost button-small" onClick={() => save(i, null)}>
                    Cofnij
                  </button>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CompanyPanel = ({ owner, name, list, play, canEdit, run, ids, onRule, armourRule }) => {
  if (!list) return <p className="hub-muted">{name} nie wgrał(a) jeszcze rozpiski.</p>;
  const units = Object.fromEntries((list.armyList || []).map((u) => [u.uniqueId, u]));
  return (
    <div className="game-company">
      {groupRoster(list.armyList).map((group) => (
        <section key={group.type} className="game-group">
          <h4 className="roster-group-title">{group.title}</h4>
          {group.units.map((summary) => {
            const unit = units[summary.id];
            const p = unitPlay(play, owner, unit.uniqueId);
            return (
              <article key={summary.id} className="roster-unit game-unit">
                <div className="roster-unit-header">
                  <span className="roster-unit-name">
                    {summary.name}
                    {summary.name !== summary.profile && <span className="roster-unit-profile">{summary.profile}</span>}
                  </span>
                  <span className="roster-unit-meta">{summary.exp} PD</span>
                </div>
                <div className="roster-stats-scroll">
                  <table className="roster-stats">
                    <thead>
                      <tr>
                        {STAT_LABELS.map((l) => (
                          <th key={l} scope="col">
                            {l}
                          </th>
                        ))}
                        <th scope="col">OP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {STAT_LABELS.map((l, i) => (
                          <td key={l}>{summary.stats[i] ?? "-"}</td>
                        ))}
                        <td>
                          {armourRule && modelCount(unit) === 1 && isDamaged(p.armour?.[0]) ? (
                            <span title={`Przed uszkodzeniem: ${summary.armour}`}>{damagedSave(unit, p.armour[0])}</span>
                          ) : (
                            summary.armour
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Every item and rule opens its full text: weapon profile and rules too. */}
                {unitEquipmentItems(unit).length > 0 && (
                  <div className="roster-unit-rules game-unit-gear" aria-label="Ekwipunek">
                    {unitEquipmentItems(unit).map((item, k) => (
                      <button type="button" key={`${item}-${k}`} className="roster-rule is-gear" onClick={() => onRule(describeEquipment(unit, item))}>
                        {item}
                        {equipmentHint(item) && <small>{equipmentHint(item)}</small>}
                      </button>
                    ))}
                  </div>
                )}
                {summary.rules.length > 0 && (
                  <div className="roster-unit-rules" aria-label="Zasady specjalne">
                    {summary.rules.map((rule, k) => (
                      <button type="button" key={`${rule}-${k}`} className="roster-rule" onClick={() => onRule(describeRule(unit, rule))}>
                        {rule}
                      </button>
                    ))}
                  </div>
                )}
                {summary.injuries.length > 0 && (
                  <p className="hub-muted game-unit-injuries">Rany: {summary.injuries.join(", ")}</p>
                )}
                <div className="game-models">
                  {Array.from({ length: modelCount(unit) }, (_, i) => {
                    const state = modelState(play, owner, unit, i);
                    return (
                      <div key={i} className={`game-model is-${state}`}>
                        <span className="game-model-name">{modelCount(unit) > 1 ? modelLabel(unit, i) : "Stan"}</span>
                        {state === "unavailable" ? (
                          <span className="hub-muted">
                            {unit.campaignModelStatus?.[i]?.captured ? "pojmany" : "pauzuje po ranach"}
                          </span>
                        ) : (
                          <div className="game-model-states" role="group" aria-label={`Stan: ${modelLabel(unit, i)}`}>
                            {Object.entries(STATE_LABELS).map(([key, text]) => (
                              <button
                                type="button"
                                key={key}
                                aria-pressed={state === key}
                                className={state === key ? "is-active" : ""}
                                disabled={!canEdit}
                                onClick={() => run(() => setModelState(ids.c, ids.g, owner, unit.uniqueId, i, key))}
                              >
                                {text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {armourRule && <ArmourDamage unit={unit} owner={owner} play={play} canEdit={canEdit} run={run} ids={ids} />}
                <div className="game-counters">
                  {isHero(unit) && (
                    <Stepper
                      label="Wrogowie WzA"
                      value={Number(p.kills) || 0}
                      disabled={!canEdit}
                      onChange={(d) => run(() => changeCounter(ids.c, ids.g, owner, unit.uniqueId, "kills", d))}
                    />
                  )}
                  <Stepper
                    label="Dodatkowe PD"
                    value={Number(p.extraPd) || 0}
                    disabled={!canEdit}
                    onChange={(d) => run(() => changeCounter(ids.c, ids.g, owner, unit.uniqueId, "extraPd", d))}
                  />
                  <Stepper
                    label="Kosztowności"
                    value={Number(p.treasure) || 0}
                    disabled={!canEdit}
                    onChange={(d) => run(() => changeCounter(ids.c, ids.g, owner, unit.uniqueId, "treasure", d))}
                  />
                </div>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
};

// "Who took out whom": the victim goes out of action, a hero killer gets +1 PD.
const TakedownForm = ({ sides, play, round, run, ids }) => {
  const [victim, setVictim] = useState("");
  const [killer, setKiller] = useState("");
  const all = sides.flatMap((s) => companyModels(s.list?.armyList, s.owner).map((m) => ({ ...m, side: s })));
  const victims = all.filter((m) => modelState(play, m.owner, m.unit, m.index) === "in");
  const v = victims.find((m) => m.key === victim);
  const killers = all.filter((m) => v && m.owner !== v.owner && !["absent", "unavailable"].includes(modelState(play, m.owner, m.unit, m.index)));
  const k = killers.find((m) => m.key === killer);

  return (
    <form
      className="game-takedown"
      onSubmit={(e) => {
        e.preventDefault();
        const vk = parseModelKey(victim);
        const kk = k ? parseModelKey(killer) : null;
        run(() =>
          recordTakedown(ids.c, ids.g, {
            round,
            victim: vk,
            killer: kk && { ...kk, counts: isHero(k.unit) },
            text: k
              ? `${k.label} (${k.side.name}) wyłącza z akcji: ${v.label} (${v.side.name})`
              : `${v.label} (${v.side.name}) zostaje wyłączony z akcji`,
          }),
        ).then((ok) => {
          if (ok) {
            setVictim("");
            setKiller("");
          }
        });
      }}
    >
      <label className="hub-field">
        Wyłączony z akcji
        <select value={victim} onChange={(e) => { setVictim(e.target.value); setKiller(""); }}>
          <option value="">Wybierz model</option>
          {sides.map((s) => (
            <optgroup key={s.owner} label={s.name}>
              {victims.filter((m) => m.owner === s.owner).map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="hub-field">
        Przez
        <select value={killer} onChange={(e) => setKiller(e.target.value)} disabled={!v}>
          <option value="">Bez sprawcy (upadek, zdarzenie…)</option>
          {killers.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
              {isHero(m.unit) ? " · +1 PD" : ""}
            </option>
          ))}
        </select>
      </label>
      <button className="button" disabled={!v}>
        Zapisz
      </button>
    </form>
  );
};

// Zdarzenia losowe on the shared game screen: saved in the game's log.
const RandomEvents = ({ game, round, canEdit, run, ids, hints, limit, weatherFrom }) => (
  <RandomEventRoller
    limit={limit}
    weatherFrom={weatherFrom}
    fixedArea={game.scenario?.area || ""}
    canSave={canEdit}
    occurred={(game.play?.log || []).some((e) => e.type === "event")}
    weather={game.weather}
    weatherHints={hints}
    onWeather={(weather, roll = 6) =>
      run(async () => {
        await updateGame(ids.c, ids.g, { weather });
        await addLogEntry(ids.c, ids.g, { type: "weather", round, text: `Zmiana pogody (K6: ${roll}): ${weather.name} (${weather.total})` });
      })
    }
    onSave={(event) =>
      run(() =>
        addLogEntry(ids.c, ids.g, {
          type: "event",
          round,
          area: event.area,
          code: event.code,
          name: event.name,
          text: `Zdarzenie losowe (${event.code}): ${event.name}`,
        }),
      )
    }
  />
);

// Loads the campaign, the game and both rosters live from Firestore.
const GamePage = (props) => {
  useHidePrintSheet();
  const { id, gameId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [lists, setLists] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fail = (e) => setError(describeError(e));
    const stops = [
      watchCampaign(id, setCampaign, fail),
      watchGame(id, gameId, setGame, fail),
      watchCampaignLists(id, setLists, fail),
    ];
    return () => stops.forEach((s) => s());
  }, [id, gameId]);

  if (campaign === undefined || game === undefined) return <div className="hub-page">Wczytywanie…</div>;
  if (!campaign || !game || game.bye)
    return (
      <div className="hub-page">
        <p className="hub-error" role="alert">{error || "Nie znaleziono gry."}</p>
        <Link to={`/campaigns/${id}`}>Wróć do kampanii</Link>
      </div>
    );
  return (
    <GameScreen
      {...props}
      campaign={campaign}
      game={game}
      lists={lists}
      user={currentUser?.user}
      loadError={error}
    />
  );
};

// The game screen for loaded data; writes go through campaignService.
export const GameScreen = ({
  campaign,
  game,
  lists,
  user,
  loadError,
  setUnitList,
  setArmy,
  setArmyName,
  setCampaignNotes,
  campaignNotes,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rule, setRule] = useState(null);
  const [view, setView] = useState(0);
  const [result, setResult] = useState({ winner: "", notes: "" });
  const [note, setNote] = useState("");
  const names = useMemo(() => campaign.memberNames || {}, [campaign.memberNames]);
  const sides = useMemo(
    () =>
      game.players.map((owner) => ({
        owner,
        name: names[owner] || "Gracz",
        list: lists[owner],
      })),
    [game.players, names, lists],
  );
  const id = campaign.id;
  const gameId = game.id;
  const ids = { c: id, g: gameId };
  const armourRule = (game.optionalRules || []).includes("USZKODZENIE PANCERZA");
  const play = game.play || {};
  const round = play.round || 1;
  const isPlayer = game.players.includes(user.uid);
  const canEdit = (isPlayer || campaign.ownerId === user.uid) && game.status !== "done";
  const done = game.status === "done";

  const run = async (action, message) => {
    setError("");
    setNotice("");
    try {
      await action();
      if (message) setNotice(message);
      return true;
    } catch (e) {
      setError(describeError(e));
      return false;
    }
  };

  // This player's sequence for this game: saved already, or open in play mode.
  const settled = game.sequenceDone?.[user.uid];
  const openHere = campaignNotes?.campaign?.activeBattle?.campaignGame?.gameId === game.id;

  const handOff = async () => {
    if (settled) return;
    // Coming back to an unfinished sequence of this game keeps its progress.
    if (openHere) {
      navigate("/play");
      return;
    }
    const mine = sides.find((s) => s.owner === user.uid);
    const opponent = sides.find((s) => s.owner !== user.uid);
    const saved = (await getMySavedLists(user.uid)).find(
      (l) => l.armyName === mine.list?.armyName && normalizeRosterNames(l).armyType === mine.list?.armyType,
    );
    if (!saved) {
      setError("Nie znaleziono tej kompanii w „Moje rozpiski”. Zapisz ją na koncie pod tą samą nazwą.");
      return;
    }
    const list = normalizeRosterNames(saved);
    const history = list.campaignNotes?.campaign?.history || [];
    if (history.some((h) => h.campaignGame?.gameId === game.id)) {
      setError("Sekwencja po tej grze została już rozliczona dla tej kompanii.");
      return;
    }
    // Sequences saved before games were tracked carry only their name.
    const expectedName = [campaign.name, game.round && `runda ${game.round}`].filter(Boolean).join(" · ");
    const earlier = history.find((h) => !h.campaignGame && h.gameName === expectedName);
    if (
      earlier &&
      !window.confirm(
        `Kompania ma już rozliczenie „${earlier.gameName}” z ${earlier.date}. Jeśli to była ta gra, wybierz Anuluj. Rozliczyć ją ponownie?`,
      )
    )
      return;
    if (
      list.campaignNotes?.campaign?.activeBattle &&
      !window.confirm("Ta kompania ma już rozpoczętą potyczkę w trybie gry. Zastąpić ją tą grą?")
    )
      return;
    const { units, battle } = toBattle({
      savedList: list,
      play,
      owner: user.uid,
      game,
      opponentName: opponent?.name,
      opponentList: opponent?.list,
      campaignName: campaign.name,
    });
    setUnitList(units);
    setArmy(list.armyType);
    setArmyName(list.armyName);
    // Same defaults as opening a list from "Moje rozpiski", plus this game.
    const notes = { ...getDefaultCampaignNotes(), ...(list.campaignNotes || {}) };
    setCampaignNotes({
      ...notes,
      specialRules: normalizeSpecialRules(notes.specialRules),
      campaign: { ...(notes.campaign || {}), activeBattle: battle },
    });
    navigate("/play");
  };

  const log = [...(play.log || [])].reverse();

  return (
    <div className="hub-page game-page">
      <Link to={`/campaigns/${id}`} className="hub-back">
        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> {campaign.name}
      </Link>
      <div className="game-head">
        <h2 className="hub-title">
          {sides[0]?.name} <span className="hub-muted">vs</span> {sides[1]?.name}
        </h2>
        <div className="game-round">
          <Stepper
            label="Runda"
            value={round}
            disabled={!canEdit}
            onChange={(d) => run(() => setPlayRound(id, gameId, round + d))}
          />
        </div>
      </div>
      {(error || loadError) && <p className="hub-error" role="alert">{error || loadError}</p>}
      {notice && <p className="hub-notice" role="status">{notice}</p>}
      {!canEdit && !done && <p className="hub-notice">Podgląd: zapisywać mogą gracze tej gry i organizator.</p>}

      {done && isPlayer && (
        <section className="hub-card hub-handoff">
          <h3>
            {game.result?.winner === "draw"
              ? "Remis"
              : `Wygrywa ${names[game.result?.winner] || "gracz"}`}
            {game.result?.rounds ? <span className="hub-muted"> · {game.result.rounds} rund</span> : null}
          </h3>
          <p className="hub-muted">Sekwencja po potyczce: {settlementLine(game, names)}</p>
          {settled ? (
            <p className="hub-notice">✓ Sekwencja po potyczce Twojej kompanii jest już rozliczona.</p>
          ) : (
            <>
              <p className="hub-muted">
                {openHere
                  ? "Sekwencja po tej grze jest rozpoczęta w trybie gry. Wróć do niej, postęp jest zapisany."
                  : "Wyłączenia z akcji, nieobecni, pokonani wrogowie i PD z tej gry trafią do sekwencji po potyczce. Po jej zapisaniu rozpiska w kampanii zaktualizuje się sama."}
              </p>
              <button type="button" className="button" onClick={handOff}>
                <i className="fa-solid fa-forward" aria-hidden="true"></i>{" "}
                {openHere ? "Wróć do sekwencji po potyczce" : "Sekwencja po potyczce mojej kompanii"}
              </button>
            </>
          )}
        </section>
      )}

      <section className="hub-card game-info">
        <div className="hub-game-row">
          <span className="hub-game-label">Scenariusz</span>
          {game.scenario ? (
            <details className="hub-game-scenario">
              <summary>
                {game.scenario.name}
                {game.scenario.area && ` · ${AREAS[game.scenario.area]}`}
              </summary>
              <ScenarioDetails scenario={game.scenario} />
            </details>
          ) : (
            <span className="hub-muted">nie wybrano (ustaw na stronie kampanii)</span>
          )}
        </div>
        <div className="hub-game-row">
          <span className="hub-game-label">Zasady opcjonalne</span>
          <OptionalRuleChips keys={game.optionalRules} />
        </div>
      </section>

      <WeatherRoller
        value={game.weather}
        canEdit={canEdit}
        hints={weatherHints(
          sides.find((s) => s.owner === user.uid)?.list?.armyList,
          sides.find((s) => s.owner === user.uid)?.list?.campaignNotes?.specialRules,
        )}
        onSave={(weather) =>
          run(async () => {
            await updateGame(id, gameId, { weather });
            await addLogEntry(id, gameId, { type: "weather", round, text: `Pogoda: ${weather.name} (${weather.total})` });
          })
        }
      />

      {canEdit && (
        <section className="hub-card">
          <h3>Wyłączenie z akcji</h3>
          <TakedownForm sides={sides} play={play} round={round} run={run} ids={ids} />
        </section>
      )}

      {done && isPlayer && (game.optionalRules || []).includes("ZDARZENIA LOSOWE") && (
        <RandomEventRoller
          afterGame
          title="Dopisz zapomniane zdarzenie losowe"
          fixedArea={game.scenario?.area || ""}
          onSave={(event) =>
            run(() =>
              addLogEntry(id, gameId, {
                type: "event",
                round: game.play?.round || 1,
                area: event.area,
                code: event.code,
                name: event.name,
                text: `Zdarzenie losowe (${event.code}): ${event.name}`,
              }),
            )
          }
        />
      )}

      {(game.optionalRules || []).includes("ZDARZENIA LOSOWE") && !done && (
        <RandomEvents
          limit={campaign.settings?.oneEventLimit === true}
          weatherFrom={campaign.settings?.weatherOnlyOn6 === true ? 6 : 5}
          game={game}
          round={round}
          canEdit={canEdit}
          run={run}
          ids={ids}
          hints={weatherHints(
            sides.find((s) => s.owner === user.uid)?.list?.armyList,
            sides.find((s) => s.owner === user.uid)?.list?.campaignNotes?.specialRules,
          )}
        />
      )}

      <div className="game-switch hub-segmented" role="tablist" aria-label="Kompania">
        {sides.map((s, i) => (
          <button type="button" role="tab" key={s.owner} aria-selected={view === i} className={view === i ? "is-active" : ""} onClick={() => setView(i)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="game-companies">
        {sides.map((s, i) => (
          <section key={s.owner} className={`hub-card game-side${view === i ? " is-shown" : ""}`}>
            {s.list && (
              <MagicPanel
                units={withGameMagic(s.list.armyList, play, s.owner)}
                isActive={(u) =>
                  Array.from({ length: modelCount(u) }, (_, k) => modelState(play, s.owner, u, k)).some((st) => st === "in")
                }
                storageKey={`${gameId}:${s.owner}`}
                onAssign={
                  canEdit && s.owner === user.uid
                    ? (unitId, patch) => run(() => setUnitMagic(id, gameId, s.owner, unitId, patch))
                    : undefined
                }
              />
            )}
            <h3>
              {s.name}
              {s.list && <span className="hub-muted"> · {s.list.armyName}</span>}
            </h3>
            <CompanyPanel owner={s.owner} name={s.name} list={s.list} play={play} canEdit={canEdit} run={run} ids={ids} onRule={setRule} armourRule={armourRule} />
          </section>
        ))}
      </div>

      {done && <SequenceHistory game={game} sides={sides} />}

      <section className="hub-card">
        <h3>Przebieg</h3>
        {canEdit && (
          <form
            className="game-note"
            onSubmit={(e) => {
              e.preventDefault();
              run(() => addLogEntry(id, gameId, { type: "note", round, text: note.trim() })).then((ok) => ok && setNote(""));
            }}
          >
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notatka, np. zdobyty znacznik kosztowności" aria-label="Notatka" />
            <button className="button button-secondary" disabled={!note.trim()}>
              Dodaj
            </button>
          </form>
        )}
        {log.length === 0 ? (
          <p className="hub-muted">Nic jeszcze nie zapisano.</p>
        ) : (
          <ul className="game-log">
            {log.map((entry) => (
              <li key={entry.id}>
                <span className="game-log-round">R{entry.round}</span>
                <span>{entry.text}</span>
                {canEdit && (
                  <button type="button" className="game-log-remove" aria-label="Usuń wpis" onClick={() => run(() => removeLogEntry(id, gameId, entry))}>
                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="hub-card hub-details">
        <summary>PD z potyczki</summary>
        <p className="hub-muted">
          Bez +1 za przeżycie i PD za znaczniki kosztowności: to nalicza sekwencja po potyczce. +1 za zwycięstwo dla DOWÓDCY zwycięzcy
          liczy się po wpisaniu wyniku (scenariusze z podręcznika).
        </p>
        <div className="game-pd">
          {sides.map((s) => {
            const rows = pdSummary(s.list?.armyList, play, s.owner, game);
            return (
              <div key={s.owner}>
                <h4>{s.name}</h4>
                {rows.length === 0 ? (
                  <p className="hub-muted">Brak dodatkowych PD.</p>
                ) : (
                  <table className="game-pd-table">
                    <thead>
                      <tr>
                        <th scope="col">Postać</th>
                        <th scope="col">Wrogowie</th>
                        <th scope="col">Dodatkowe</th>
                        <th scope="col">Zasady opc.</th>
                        <th scope="col">Zwycięstwo</th>
                        <th scope="col">Razem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.unitId}>
                          <th scope="row">{r.label}</th>
                          <td data-label="Wrogowie">{r.kills}</td>
                          <td data-label="Dodatkowe">{r.extra}</td>
                          <td data-label="Zasady opc.">{r.rules}</td>
                          <td data-label="Zwycięstwo">{r.win}</td>
                          <td data-label="Razem" className="game-pd-total">{r.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      </details>

      {/* A player of a finished game sees the result in the card at the top. */}
      {!(done && isPlayer) && (
      <section className="hub-card">
        <h3>{done ? "Wynik" : "Zakończenie gry"}</h3>
        {done ? (
          <p>
            {game.result?.winner === "draw" ? "Remis" : `Wygrywa ${names[game.result?.winner] || "gracz"}`}
            {game.result?.rounds ? ` · ${game.result.rounds} rund` : ""}
            {game.result?.notes && <span className="hub-muted"> · {game.result.notes}</span>}
          </p>
        ) : null}
        {done ? (
          <p className="hub-muted">Sekwencja po potyczce: {settlementLine(game, names)}</p>
        ) : canEdit ? (
          <form
            className="hub-result-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () => recordResult(id, gameId, { winner: result.winner, notes: result.notes.trim(), rounds: round }, user),
                "Zapisano wynik gry.",
              );
            }}
          >
            <label className="hub-field">
              Wynik
              <select value={result.winner} onChange={(e) => setResult({ ...result, winner: e.target.value })}>
                <option value="">Wybierz</option>
                {sides.map((s) => (
                  <option key={s.owner} value={s.owner}>Wygrywa {s.name}</option>
                ))}
                <option value="draw">Remis</option>
              </select>
            </label>
            <label className="hub-field">
              Notatki
              <textarea rows={2} value={result.notes} onChange={(e) => setResult({ ...result, notes: e.target.value })} />
            </label>
            <button className="button" disabled={!result.winner}>
              Zakończ grę (runda {round})
            </button>
          </form>
        ) : (
          <p className="hub-muted">Gra w toku.</p>
        )}
      </section>
      )}

      {rule && <RulesModal title={rule.title} sections={rule.sections} onClose={() => setRule(null)} />}
    </div>
  );
};

export default GamePage;
