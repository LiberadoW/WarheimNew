import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import useHidePrintSheet from "../Functions/useHidePrintSheet";
import RosterView from "./RosterView";
import RoundsSection from "./RoundsSection";
import CampaignSettings from "./CampaignSettings";
import { countModels, plural } from "./roster";
import {
  deleteCampaign,
  describeError,
  getMySavedLists,
  removeMember,
  uploadCampaignList,
  watchCampaign,
  watchCampaignGames,
  watchCampaignLists,
} from "./campaignService";
import "../styles/CampaignHub.css";

const formatDate = (timestamp) =>
  timestamp?.toDate
    ? timestamp.toDate().toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const RESULTS = { win: "wygrana", loss: "porażka", draw: "remis" };

// One finished game in the history, from both players' side.
const gameLine = (game, names) => {
  const [a, b] = game.players || [];
  const winner = game.result?.winner;
  const outcome =
    winner === "draw"
      ? "Remis"
      : winner
        ? `Wygrywa ${names[winner] || "?"}`
        : "Bez wyniku";
  return `${names[a] || "?"} vs ${names[b] || "?"} · ${outcome}`;
};

// The player's own game in the latest round they play: the first thing they
// need on the campaign page.
export const myCurrentGame = (games, uid) =>
  games
    .filter((g) => !g.bye && (g.players || []).includes(uid))
    .sort(
      (a, b) =>
        (b.round || 0) - (a.round || 0) ||
        Number(a.status === "done") - Number(b.status === "done"),
    )[0] || null;

const MyGame = ({ campaignId, game, names, uid }) => {
  if (!game) return null;
  const opponent = (game.players || []).find((p) => p !== uid);
  const done = game.status === "done";
  const settled = !!game.sequenceDone?.[uid];
  return (
    <section className="hub-card hub-my-game">
      <div className="hub-card-head">
        <h3>
          {done ? "Twoja ostatnia gra" : "Twoja gra"} · runda {game.round}
        </h3>
        <span className={`hub-status is-${game.status}`}>
          {settled ? "Rozliczona" : done ? "Rozegrana" : game.status === "playing" ? "W trakcie" : "Do rozegrania"}
        </span>
      </div>
      <p>
        vs <strong>{names[opponent] || "Gracz"}</strong>
        <span className="hub-muted">
          {" · "}
          {game.scenario?.name || "scenariusz nie wybrany"}
          {done && game.result?.winner
            ? ` · ${game.result.winner === "draw" ? "remis" : game.result.winner === uid ? "wygrana" : "porażka"}`
            : ""}
        </span>
      </p>
      <Link to={`/campaigns/${campaignId}/games/${game.id}`} className="button">
        <i className="fa-solid fa-chess-board" aria-hidden="true"></i>{" "}
        {!done ? "Otwórz ekran gry" : settled ? "Przebieg gry" : "Sekwencja po potyczce"}
      </Link>
    </section>
  );
};

const PlayerRow = ({ uid, name, list, isOwner, canRemove, onRemove, isOpen, onToggle }) => (
  <li className="hub-player">
    <div className="hub-player-row">
      <div className="hub-player-info">
        <span className="hub-list-name">
          {name}
          {isOwner && <span className="hub-badge">organizator</span>}
        </span>
        {list ? (
          <span className="hub-muted">
            {list.armyName} · {list.armyType} ·{" "}
            {plural(countModels(list.armyList), "model", "modele", "modeli")}
            {list.totalCost != null && ` · ${list.totalCost} zk`}
            {list.prestige != null && ` · prestiż ${list.prestige}`}
            {list.uploadedAt && ` · wgrano ${formatDate(list.uploadedAt)}`}
          </span>
        ) : (
          <span className="hub-muted">Nie wgrano jeszcze rozpiski.</span>
        )}
      </div>
      <div className="hub-player-actions">
        {list && (
          <button
            type="button"
            className="button button-secondary button-small"
            aria-expanded={isOpen}
            onClick={onToggle}
          >
            {isOpen ? "Ukryj rozpiskę" : "Pokaż rozpiskę"}
          </button>
        )}
        {canRemove && (
          <button
            type="button"
            className="button button-ghost button-small"
            onClick={() => onRemove(uid, name)}
          >
            Usuń
          </button>
        )}
      </div>
    </div>
    {isOpen && list && <RosterView armyList={list.armyList} notes={list.campaignNotes} title={`Rozpiska: ${name}`} />}
  </li>
);

// Loads the campaign, its lists and games live from Firestore.
const CampaignPage = () => {
  useHidePrintSheet();
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const user = currentUser?.user;
  const [campaign, setCampaign] = useState(undefined);
  const [lists, setLists] = useState({});
  const [games, setGames] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fail = (e) => setError(describeError(e));
    const stops = [
      watchCampaign(id, setCampaign, (e) => {
        setCampaign(null);
        fail(e);
      }),
      watchCampaignLists(id, setLists, fail),
      watchCampaignGames(id, setGames, fail),
    ];
    return () => stops.forEach((stop) => stop());
  }, [id]);

  useEffect(() => {
    if (user?.uid) getMySavedLists(user.uid).then(setSavedLists).catch(() => {});
  }, [user?.uid]);

  if (campaign === undefined) return <div className="hub-page">Wczytywanie…</div>;
  if (!campaign || !campaign.members.includes(user.uid))
    return (
      <div className="hub-page">
        <p className="hub-error" role="alert">
          {error || "Nie masz dostępu do tej kampanii."}
        </p>
        <Link to="/campaigns">Wróć do kampanii</Link>
      </div>
    );
  return (
    <CampaignView
      campaign={campaign}
      lists={lists}
      games={games}
      savedLists={savedLists}
      user={user}
      loadError={error}
    />
  );
};

// The campaign page for loaded data; writes go through campaignService.
export const CampaignView = ({ campaign, lists, games, savedLists, user, loadError = "" }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [openRoster, setOpenRoster] = useState(null);
  const [historyFilter, setHistoryFilter] = useState("");
  const [actionError, setError] = useState("");
  const error = actionError || loadError;
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const isOrganizer = campaign.ownerId === user.uid;
  const names = campaign.memberNames || {};
  const inviteLink = `${window.location.origin}/campaigns/join/${campaign.inviteCode}`;
  const finished = games
    .filter((g) => g.status === "done")
    .filter((g) => !historyFilter || (g.players || []).includes(historyFilter))
    .sort((a, b) => (b.playedAt?.seconds || 0) - (a.playedAt?.seconds || 0));
  const members = [...campaign.members].sort((a, b) =>
    a === campaign.ownerId ? -1 : b === campaign.ownerId ? 1 : (names[a] || "").localeCompare(names[b] || "", "pl"),
  );

  const act = async (action, message) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      if (message) setNotice(message);
      return true;
    } catch (e) {
      setError(describeError(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = (uid, name) => {
    if (window.confirm(`Usunąć gracza ${name} z kampanii? Jego wgrana rozpiska zostanie usunięta.`))
      act(() => removeMember(campaign.id, uid), `${name} nie należy już do kampanii.`);
  };

  // Until the player uploads a company it is the first thing to do; later it
  // only needs changing occasionally.
  const rosterCard = (
    <section className="hub-card">
      <h3>Twoja rozpiska w kampanii</h3>
      {lists[user.uid] ? (
        <p>
          {lists[user.uid].armyName}
          <span className="hub-muted">
            {" · "}
            {lists[user.uid].armyType}
            {lists[user.uid].uploadedAt && ` · wgrano ${formatDate(lists[user.uid].uploadedAt)}`}
          </span>
        </p>
      ) : (
        <p className="hub-muted">Nie wgrano jeszcze rozpiski.</p>
      )}
      <p className="hub-muted">
        Po sekwencji po potyczce rozpiska w kampanii aktualizuje się sama.
      </p>
      <details className="hub-details" open={!lists[user.uid]}>
        <summary>{lists[user.uid] ? "Zmień rozpiskę" : "Wgraj rozpiskę"}</summary>
        {savedLists.length === 0 ? (
          <p className="hub-muted">
            Nie masz jeszcze zapisanych rozpisek. Stwórz bandę: po zapisaniu trafi od razu do tej
            kampanii.
          </p>
        ) : (
          <div className="hub-upload">
            <label className="hub-field">
              Rozpiska z „Moje rozpiski”
              <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Wybierz rozpiskę</option>
                {savedLists.map((list, i) => (
                  <option key={`${list.armyName}-${i}`} value={i}>
                    {list.armyName} · {list.armyType}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="button"
              disabled={busy || selected === ""}
              onClick={() =>
                act(
                  () => uploadCampaignList(campaign.id, user, savedLists[Number(selected)]),
                  "Rozpiska wgrana do kampanii.",
                )
              }
            >
              {lists[user.uid] ? "Zastąp wgraną rozpiskę" : "Wgraj rozpiskę"}
            </button>
          </div>
        )}
        <div className="hub-actions">
          <button
            type="button"
            className={savedLists.length ? "button button-secondary" : "button"}
            onClick={() =>
              navigate("/", { state: { newForCampaign: { id: campaign.id, name: campaign.name } } })
            }
          >
            <i className="fa-solid fa-plus" aria-hidden="true"></i> Stwórz nową bandę
          </button>
        </div>
      </details>
    </section>
  );

  return (
    <div className="hub-page">
      <Link to="/campaigns" className="hub-back">
        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Kampanie
      </Link>
      <h2 className="hub-title">{campaign.name}</h2>
      {error && (
        <p className="hub-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="hub-notice" role="status">
          {notice}
        </p>
      )}

      {!lists[user.uid] && rosterCard}

      <MyGame campaignId={campaign.id} game={myCurrentGame(games, user.uid)} names={names} uid={user.uid} />

      <RoundsSection
        campaign={campaign}
        games={games}
        names={names}
        user={user}
        isOrganizer={isOrganizer}
        act={act}
      />

      <section className="hub-card">
        <div className="hub-card-head">
          <h3>Gracze ({campaign.members.length})</h3>
          <div className="hub-invite-code" title="Gracze dołączają kodem albo linkiem (muszą być zalogowani).">
            <span className="hub-muted">Kod</span>
            <span className="hub-code">{campaign.inviteCode}</span>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() =>
                navigator.clipboard
                  ?.writeText(inviteLink)
                  .then(() => setNotice("Skopiowano link zaproszenia."))
              }
            >
              <i className="fa-solid fa-link" aria-hidden="true"></i> Kopiuj zaproszenie
            </button>
          </div>
        </div>
        <ul className="hub-players">
          {members.map((uid) => (
            <PlayerRow
              key={uid}
              uid={uid}
              name={names[uid] || "Gracz"}
              list={lists[uid]}
              isOwner={uid === campaign.ownerId}
              canRemove={isOrganizer && uid !== user.uid}
              onRemove={handleRemove}
              isOpen={openRoster === uid}
              onToggle={() => setOpenRoster(openRoster === uid ? null : uid)}
            />
          ))}
        </ul>
      </section>

      {lists[user.uid] && rosterCard}

      <CampaignSettings campaign={campaign} isOrganizer={isOrganizer} act={act} />

      <section className="hub-card">
        <div className="hub-card-head">
          <h3>Historia meczów</h3>
          <label className="hub-field hub-field-inline">
            Gracz
            <select value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)}>
              <option value="">Wszyscy</option>
              {members.map((uid) => (
                <option key={uid} value={uid}>
                  {names[uid] || "Gracz"}
                </option>
              ))}
            </select>
          </label>
        </div>
        {finished.length === 0 ? (
          <p className="hub-muted">Brak rozegranych meczów.</p>
        ) : (
          <ul className="hub-history">
            {finished.map((game) => (
              <li key={game.id}>
                <Link className="hub-list-name" to={`/campaigns/${campaign.id}/games/${game.id}`}>
                  {gameLine(game, names)}
                </Link>
                <span className="hub-muted">
                  {[
                    game.round && `Runda ${game.round}`,
                    game.scenario?.name,
                    formatDate(game.playedAt),
                    historyFilter &&
                      game.result?.winner &&
                      game.result.winner !== "draw" &&
                      (game.result.winner === historyFilter
                        ? RESULTS.win
                        : RESULTS.loss),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="hub-danger">
        {isOrganizer ? (
          <button
            type="button"
            className="button button-ghost"
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  `Usunąć kampanię „${campaign.name}”? Rozpiski i historia meczów kampanii zostaną usunięte.`,
                )
              )
                act(async () => {
                  await deleteCampaign(campaign);
                  navigate("/campaigns");
                });
            }}
          >
            Usuń kampanię
          </button>
        ) : (
          <button
            type="button"
            className="button button-ghost"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Opuścić kampanię? Twoja wgrana rozpiska zostanie usunięta."))
                act(async () => {
                  await removeMember(campaign.id, user.uid);
                  navigate("/campaigns");
                });
            }}
          >
            Opuść kampanię
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignPage;
