import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScenarioPicker, { ScenarioDetails } from "./ScenarioPicker";
import OptionalRulesPicker, { OptionalRuleChips } from "./OptionalRulesPicker";
import { AREAS } from "./scenarios";
import { generatePairings, nextRound, playedPairs } from "./pairings";
import {
  addGame,
  createRound,
  deleteGame,
  recordResult,
  reopenGame,
  updateGame,
} from "./campaignService";

const STATUS = { planned: "Do rozegrania", playing: "W trakcie", done: "Rozegrana", bye: "Pauza" };

const ResultForm = ({ game, names, onSave, onCancel }) => {
  const [winner, setWinner] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <form
      className="hub-result-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ winner, notes: notes.trim() });
      }}
    >
      <label className="hub-field">
        Wynik
        <select value={winner} onChange={(e) => setWinner(e.target.value)}>
          <option value="">Wybierz</option>
          {game.players.map((uid) => (
            <option key={uid} value={uid}>
              Wygrywa {names[uid] || "gracz"}
            </option>
          ))}
          <option value="draw">Remis</option>
        </select>
      </label>
      <label className="hub-field">
        Notatki
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </label>
      <div className="hub-actions">
        <button className="button" disabled={!winner}>
          Zapisz wynik
        </button>
        <button type="button" className="button button-ghost" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </form>
  );
};

const GameCard = ({ campaign, game, names, user, isOrganizer, act }) => {
  const [editing, setEditing] = useState(null); // "scenario" | "rules" | "result"
  const [rules, setRules] = useState(game.optionalRules || []);
  const canEdit = isOrganizer || game.players.includes(user.uid);
  const [a, b] = game.players;

  if (game.bye)
    return (
      <li className="hub-game is-bye">
        <span className="hub-list-name">{names[a] || "Gracz"}</span>
        <span className="hub-muted">pauzuje w tej rundzie</span>
      </li>
    );

  const save = (changes, message) =>
    act(() => updateGame(campaign.id, game.id, changes), message).then((ok) => ok && setEditing(null));

  return (
    <li className={`hub-game${game.players.includes(user.uid) ? " is-mine" : ""}`}>
      <div className="hub-game-head">
        <span className="hub-list-name">
          {names[a] || "Gracz"} <span className="hub-muted">vs</span> {names[b] || "Gracz"}
        </span>
        <span className={`hub-status is-${game.status}`}>{STATUS[game.status]}</span>
      </div>

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
          <span className="hub-muted">nie wybrano</span>
        )}
        {canEdit && game.status !== "done" && editing !== "scenario" && (
          <button type="button" className="button button-secondary button-small" onClick={() => setEditing("scenario")}>
            {game.scenario ? "Zmień" : "Wybierz scenariusz"}
          </button>
        )}
      </div>
      {editing === "scenario" && (
        <ScenarioPicker
          onPick={(scenario) => save({ scenario }, `Scenariusz: ${scenario.name}.`)}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="hub-game-row">
        <span className="hub-game-label">Zasady opcjonalne</span>
        <OptionalRuleChips keys={game.optionalRules} />
        {canEdit && game.status !== "done" && editing !== "rules" && (
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={() => {
              setRules(game.optionalRules || []);
              setEditing("rules");
            }}
          >
            Zmień
          </button>
        )}
      </div>
      {editing === "rules" && (
        <div className="hub-editor">
          <OptionalRulesPicker value={rules} onChange={setRules} />
          <div className="hub-actions">
            <button type="button" className="button" onClick={() => save({ optionalRules: rules }, "Zapisano zasady opcjonalne gry.")}>
              Zapisz zasady
            </button>
            <button type="button" className="button button-ghost" onClick={() => setEditing(null)}>
              Anuluj
            </button>
          </div>
        </div>
      )}

      {game.status === "done" && game.result && (
        <div className="hub-game-row">
          <span className="hub-game-label">Wynik</span>
          <span>
            {game.result.winner === "draw" ? "Remis" : `Wygrywa ${names[game.result.winner] || "gracz"}`}
            {game.result.notes && <span className="hub-muted"> · {game.result.notes}</span>}
          </span>
        </div>
      )}
      {editing === "result" && (
        <ResultForm
          game={game}
          names={names}
          onCancel={() => setEditing(null)}
          onSave={(result) =>
            act(() => recordResult(campaign.id, game.id, result, user), "Zapisano wynik.").then((ok) => ok &&
              setEditing(null),
            )
          }
        />
      )}

      {!editing && (
        <div className="hub-actions">
          <Link to={`/campaigns/${campaign.id}/games/${game.id}`} className="button button-secondary button-small">
            <i className="fa-solid fa-chess-board" aria-hidden="true"></i>{" "}
            {game.status === "done" ? "Przebieg gry" : "Ekran gry"}
          </Link>
          {!canEdit ? null : game.status !== "done" ? (
            <button type="button" className="button button-small" onClick={() => setEditing("result")}>
              Wpisz wynik
            </button>
          ) : (
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={() => {
                if (window.confirm("Cofnąć wynik tej gry?"))
                  act(() => reopenGame(campaign.id, game.id), "Gra wróciła do rozegrania.");
              }}
            >
              Cofnij wynik
            </button>
          )}
          {isOrganizer && (
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={() => {
                if (window.confirm("Usunąć tę grę?")) act(() => deleteGame(campaign.id, game.id), "Usunięto grę.");
              }}
            >
              Usuń grę
            </button>
          )}
        </div>
      )}
    </li>
  );
};

// Organizer: generate a round's pairings (preview first) or add a pair by hand.
const RoundTools = ({ campaign, games, names, act }) => {
  const [preview, setPreview] = useState(null);
  const [manual, setManual] = useState({ a: "", b: "" });
  const round = nextRound(games);
  const lastRound = round - 1;
  const played = playedPairs(games);
  const label = (uid) => names[uid] || "Gracz";

  return (
    <div className="hub-round-tools">
      <div className="hub-actions">
        <button
          type="button"
          className="button"
          disabled={campaign.members.length < 2}
          onClick={() => setPreview(generatePairings(campaign.members, games))}
        >
          <i className="fa-solid fa-shuffle" aria-hidden="true"></i>{" "}
          {preview ? "Losuj pary ponownie" : `Generuj pary: runda ${round}`}
        </button>
      </div>
      {preview && (
        <div className="hub-editor">
          <ul className="hub-preview">
            {preview.pairs.map(([x, y]) => (
              <li key={`${x}-${y}`}>
                {label(x)} vs {label(y)}
                {played.get([x, y].sort().join("|")) ? (
                  <span className="hub-muted"> · grali już ze sobą</span>
                ) : null}
              </li>
            ))}
            {preview.bye && <li className="hub-muted">{label(preview.bye)} pauzuje</li>}
          </ul>
          <div className="hub-actions">
            <button
              type="button"
              className="button"
              onClick={() =>
                act(() => createRound(campaign, round, preview.pairs, preview.bye), `Utworzono rundę ${round}.`).then((ok) => ok &&
                  setPreview(null),
                )
              }
            >
              Zapisz rundę {round}
            </button>
            <button type="button" className="button button-ghost" onClick={() => setPreview(null)}>
              Anuluj
            </button>
          </div>
        </div>
      )}
      <form
        className="hub-manual-pair"
        onSubmit={(e) => {
          e.preventDefault();
          const target = Math.max(lastRound, 1);
          act(() => addGame(campaign, target, [manual.a, manual.b]), `Dodano parę do rundy ${target}.`).then((ok) => ok &&
            setManual({ a: "", b: "" }),
          );
        }}
      >
        <span className="hub-muted">Para ręcznie (runda {Math.max(lastRound, 1)}):</span>
        {["a", "b"].map((side) => (
          <select
            key={side}
            aria-label={side === "a" ? "Pierwszy gracz" : "Drugi gracz"}
            value={manual[side]}
            onChange={(e) => setManual({ ...manual, [side]: e.target.value })}
          >
            <option value="">Gracz</option>
            {campaign.members.map((uid) => (
              <option key={uid} value={uid}>
                {label(uid)}
              </option>
            ))}
          </select>
        ))}
        <button className="button button-secondary" disabled={!manual.a || !manual.b || manual.a === manual.b}>
          Dodaj parę
        </button>
      </form>
    </div>
  );
};

const RoundsSection = ({ campaign, games, names, user, isOrganizer, act }) => {
  const rounds = [...new Set(games.map((g) => g.round))].sort((x, y) => y - x);
  const roundOpen = games.some((g) => g.round === rounds[0] && !g.bye && g.status !== "done");
  return (
    <section className="hub-card">
      <h3>Rundy i pary</h3>
      {isOrganizer &&
        (roundOpen ? (
          // While the round is played the organizer's tools stay folded.
          <details className="hub-details hub-round-tools">
            <summary>Nowa runda lub para</summary>
            <RoundTools campaign={campaign} games={games} names={names} act={act} />
          </details>
        ) : (
          <RoundTools campaign={campaign} games={games} names={names} act={act} />
        ))}
      {rounds.length === 0 ? (
        <p className="hub-muted">
          {isOrganizer ? "Wygeneruj pary pierwszej rundy albo dodaj parę ręcznie." : "Organizator nie ustalił jeszcze par."}
        </p>
      ) : (
        rounds.map((round, i) => {
          const roundGames = games.filter((g) => g.round === round);
          const list = (
            <ul className="hub-games">
              {roundGames
                .sort((x, y) => Number(!!x.bye) - Number(!!y.bye))
                .map((game) => (
                  <GameCard
                    key={game.id}
                    campaign={campaign}
                    game={game}
                    names={names}
                    user={user}
                    isOrganizer={isOrganizer}
                    act={act}
                  />
                ))}
            </ul>
          );
          // Only the latest round is open; finished ones are also in the history.
          return i === 0 ? (
            <div key={round} className="hub-round">
              <h4>Runda {round}</h4>
              {list}
            </div>
          ) : (
            <details key={round} className="hub-round hub-details">
              <summary>
                Runda {round}
                <span className="hub-muted">
                  {" · "}
                  {roundGames.filter((g) => g.status === "done").length}/
                  {roundGames.filter((g) => !g.bye).length} rozegranych
                </span>
              </summary>
              {list}
            </details>
          );
        })
      )}
    </section>
  );
};

export default RoundsSection;
