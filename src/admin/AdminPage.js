import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import RosterView from "../campaignHub/RosterView";
import { countModels, plural } from "../campaignHub/roster";
import { normalizeRosterNames } from "../Data.js/RulebookNames";
import { isAdminEmail, loadAllLists } from "./admin";
import "../styles/CampaignHub.css";

const when = (ts) =>
  ts?.toDate ? ts.toDate().toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" }) : "";

// Admin: every player's saved lists as folders, read only.
const AdminPage = () => {
  const { currentUser } = useContext(AuthContext);
  const email = currentUser?.user?.email;
  const [allowed, setAllowed] = useState(null);
  const [players, setPlayers] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    isAdminEmail(email).then(setAllowed);
  }, [email]);
  useEffect(() => {
    if (!allowed) return;
    loadAllLists()
      .then(setPlayers)
      .catch((e) =>
        setError(
          e?.code === "permission-denied"
            ? "Baza odmówiła dostępu: wgraj nowe reguły Firestore (firestore.rules) w konsoli Firebase."
            : `Nie udało się wczytać rozpisek: ${e?.message || e}`,
        ),
      );
  }, [allowed]);

  if (allowed === null) return <div className="hub-page">Wczytywanie…</div>;
  if (!allowed)
    return (
      <div className="hub-page">
        <p className="hub-error" role="alert">Ta strona jest dostępna tylko dla administratora.</p>
        <Link to="/">Wróć</Link>
      </div>
    );
  const q = query.trim().toLowerCase();
  const shown = (players || []).filter(
    (p) =>
      !q ||
      (p.name || "").toLowerCase().includes(q) ||
      p.lists.some((l) => `${l.armyName} ${l.armyType}`.toLowerCase().includes(q)),
  );
  const total = (players || []).reduce((n, p) => n + p.lists.length, 0);

  return (
    <div className="hub-page">
      <h2 className="hub-title">Wszystkie rozpiski</h2>
      {error && (
        <p className="hub-error" role="alert">
          {error} Zalogowano jako: {email}.
        </p>
      )}
      {!players && !error && <p className="hub-muted">Wczytywanie…</p>}
      {players && (
        <>
          <p className="hub-muted">
            {plural(players.length, "gracz", "graczy", "graczy")} · {plural(total, "rozpiska", "rozpiski", "rozpisek")} · tylko do odczytu
          </p>
          <label className="hub-field">
            Szukaj gracza, bandy lub armii
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          {shown.map((p) => (
            <details key={p.uid} className="hub-card admin-folder" open={!!q}>
              <summary>
                <i className="fa-solid fa-folder" aria-hidden="true"></i> {p.name || `Gracz ${p.uid.slice(0, 6)}`}
                <span className="hub-muted"> · {plural(p.lists.length, "rozpiska", "rozpiski", "rozpisek")}</span>
              </summary>
              {p.lists.length === 0 ? (
                <p className="hub-muted">Brak zapisanych rozpisek.</p>
              ) : (
                <ul className="hub-players">
                  {p.lists.map((raw, i) => {
                    const list = normalizeRosterNames(raw);
                    const key = `${p.uid}:${i}`;
                    const history = list.campaignNotes?.campaign?.history || [];
                    return (
                      <li key={key} className="hub-player">
                        <div className="hub-player-row">
                          <div className="hub-player-info">
                            <span className="hub-list-name">{list.armyName || "Bez nazwy"}</span>
                            <span className="hub-muted">
                              {[
                                list.armyType,
                                plural(countModels(list.armyList), "model", "modele", "modeli"),
                                list.totalCost != null && `${list.totalCost} zk`,
                                list.prestige != null && `prestiż ${list.prestige}`,
                                history.length && plural(history.length, "potyczka", "potyczki", "potyczek"),
                                when(list.timestamp),
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="button button-secondary button-small"
                            aria-expanded={open === key}
                            onClick={() => setOpen(open === key ? null : key)}
                          >
                            {open === key ? "Ukryj" : "Pokaż rozpiskę"}
                          </button>
                        </div>
                        {open === key && <RosterView armyList={list.armyList || []} title={list.armyName} />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </details>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminPage;
