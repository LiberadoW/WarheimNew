import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import useHidePrintSheet from "../Functions/useHidePrintSheet";
import {
  createCampaign,
  describeError,
  getMyCampaigns,
  joinCampaignByCode,
  normalizeInviteCode,
} from "./campaignService";
import { plural } from "./roster";
import "../styles/CampaignHub.css";

// "Kampanie": the player's campaigns, plus creating one or joining by code.
// /campaigns/join/:code pre-fills the code from an invite link.
const CampaignsPage = () => {
  useHidePrintSheet();
  const { currentUser } = useContext(AuthContext);
  const user = currentUser?.user;
  const { code: linkCode } = useParams();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState(() =>
    normalizeInviteCode(linkCode || sessionStorage.getItem("pendingInvite")),
  );
  useEffect(() => sessionStorage.removeItem("pendingInvite"), []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    getMyCampaigns(user.uid)
      .then((list) =>
        setCampaigns(list.sort((a, b) => a.name.localeCompare(b.name, "pl"))),
      )
      .catch((e) => {
        setCampaigns([]);
        setError(describeError(e));
      });
  }, [user?.uid]);

  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      navigate(`/campaigns/${await action()}`);
    } catch (e) {
      setError(describeError(e));
      setBusy(false);
    }
  };

  return (
    <div className="hub-page">
      <h2 className="hub-title">Kampanie</h2>
      {error && (
        <p className="hub-error" role="alert">
          {error}
        </p>
      )}

      <section className="hub-card">
        <h3>Twoje kampanie</h3>
        {campaigns === null ? (
          <p className="hub-muted">Wczytywanie…</p>
        ) : campaigns.length === 0 ? (
          <p className="hub-muted">Nie należysz jeszcze do żadnej kampanii.</p>
        ) : (
          <ul className="hub-list">
            {campaigns.map((c) => (
              <li key={c.id}>
                <Link to={`/campaigns/${c.id}`} className="hub-list-link">
                  <span className="hub-list-name">{c.name}</span>
                  <span className="hub-muted">
                    {plural(c.members.length, "gracz", "gracze", "graczy")}
                    {c.ownerId === user.uid && " · organizator"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="hub-columns">
        <form
          className="hub-card"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => joinCampaignByCode(code, user));
          }}
        >
          <h3>Dołącz do kampanii</h3>
          <label className="hub-field">
            Kod zaproszenia
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(normalizeInviteCode(e.target.value))}
              placeholder="np. K7W3QX"
              maxLength={6}
              autoCapitalize="characters"
              spellCheck={false}
            />
          </label>
          <button className="button" disabled={busy || code.length !== 6}>
            Dołącz
          </button>
        </form>

        <form
          className="hub-card"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => createCampaign(name, user));
          }}
        >
          <h3>Nowa kampania</h3>
          <label className="hub-field">
            Nazwa kampanii
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Mordheim jesień 2026"
              maxLength={80}
            />
          </label>
          <button className="button" disabled={busy || !name.trim()}>
            Utwórz kampanię
          </button>
          <p className="hub-muted">Zostaniesz organizatorem: ustalasz pary i ustawienia.</p>
        </form>
      </div>
    </div>
  );
};

export default CampaignsPage;
