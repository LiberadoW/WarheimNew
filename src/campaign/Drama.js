import React, { useState } from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import EncounterResolution from "./EncounterResolution";
import {
  profiles,
  dramaForArmy,
  dramaSearchProblem,
  searchDrama,
  hireDrama,
  dramaWageUnits,
  dramaWagePlan,
  settleDrama,
} from "./drama-rules";
export default function Drama({ post, update, army }) {
  const [dice, setDice] = useState([]),
    [name, setName] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [note, setNote] = useState("");
  const profile = profiles.find((p) => p.name === name),
    problem = dramaSearchProblem(post);
  return (
    <>
      <h3>Postacie Dramatu</h3>
      <p>
        Poszukiwania: jeden test CP dowódcy na 2K6 w sekwencji, przy wolnym
        miejscu dla bohatera. Postać nie eksploruje i nie zajmuje limitu modeli
        kompanii.
      </p>
      {post.dramaSearch?.locked ? (
        <p>
          {post.dramaSearch.success
            ? "Poszukiwania zakończone powodzeniem."
            : "Nieudane poszukiwania. Kolejna próba po następnej potyczce."}
        </p>
      ) : (
        <>
          <p>{problem}</p>
          <DiceInput
            label="Poszukiwanie Postaci Dramatu"
            count={2}
            value={dice}
            onChange={setDice}
            disabled={!!problem}
          />
          <button
            className="button"
            disabled={!!problem || !R.validDice(dice, 2)}
            onClick={() => update((p) => searchDrama(p, dice))}
          >
            Zatwierdź poszukiwanie
          </button>
        </>
      )}
      {post.dramaSearch?.success && !post.dramaSearch.hired && (
        <>
          <label>
            Postać dostępna dla kompanii
            <select
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setConfirmed(false);
                setNote("");
              }}
            >
              <option value="">Wybierz</option>
              {profiles
                .filter((p) => dramaForArmy(p, army))
                .map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
            </select>
          </label>
          {profile && (
            <>
              <p>
                Koszt:{" "}
                {profile.cost === null
                  ? "warunki szczególne"
                  : `${profile.cost} zk`}{" "}
                · początkowo 12 PD · prestiż +{profile.prestige}
              </p>
              <p>{profile.requirements}</p>
              <details>
                <summary>Pełny profil i ekwipunek</summary>
                <p>{profile.text}</p>
              </details>
              <label className="campaign-check">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                Spełniono wymagania szczególne profilu
              </label>
              <label>
                Wymagany przedmiot, towarzysze lub inne warunki (oraz ich
                rozliczenie)
                <input value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <button
                className="button"
                disabled={
                  !confirmed ||
                  !note.trim() ||
                  post.treasury < (profile.cost || 0)
                }
                onClick={() => update((p) => hireDrama(p, army, name, note))}
              >
                Zatrudnij Postać Dramatu
              </button>
            </>
          )}
        </>
      )}
      <h3>Żołd Postaci Dramatu za potyczkę</h3>
      {dramaWageUnits(post).length ? (
        dramaWageUnits(post).map((u) => (
          <DramaWage
            key={u.uniqueId}
            unit={u}
            post={post}
            update={update}
            army={army}
          />
        ))
      ) : (
        <p>Brak Postaci Dramatu wymagających rozliczenia.</p>
      )}
    </>
  );
}
function DramaWage({ unit, post, update, army }) {
  const [dismissal, setDismissal] = useState("");
  const answers = post.dramaWageDrafts?.[unit.uniqueId] || {},
    profile = profiles.find((p) => p.name === (unit.dramaId || unit.unitName));
  const plan = dramaWagePlan(unit, answers, post),
    done = post.dramaWages?.[unit.uniqueId];
  return (
    <div className="campaign-card">
      {done ? (
        <p>{R.label(unit)} — żołd rozliczony.</p>
      ) : (
        <>
          <EncounterResolution
            event={{
              key: "Żołd",
              name: R.label(unit),
              page: "497–521",
              text: profile?.wageText || unit.dramaProfileText,
            }}
            plan={plan}
            answers={answers}
            post={post}
            army={army}
            onChange={(value) =>
              update((p) => {
                p.dramaWageDrafts = {
                  ...(p.dramaWageDrafts || {}),
                  [unit.uniqueId]: value,
                };
              })
            }
          />
          <button
            className="button"
            disabled={!plan.ready}
            onClick={() =>
              update((p) => settleDrama(p, unit.uniqueId, answers, army))
            }
          >
            Rozlicz żołd: {R.label(unit)}
          </button>
          <details>
            <summary>Rezygnacja z usług Postaci Dramatu</summary>
            <p>
              Sprawdź opis żołdu powyżej i rozlicz wskazane w nim dodatkowe
              skutki odejścia / odmowy.
            </p>
            <label>
              Rozliczone konsekwencje
              <input
                value={dismissal}
                onChange={(e) => setDismissal(e.target.value)}
              />
            </label>
            <button
              className="button button-secondary"
              disabled={!dismissal.trim()}
              onClick={() =>
                update((p) => {
                  p.units = p.units.filter((u) => u.uniqueId !== unit.uniqueId);
                  p.dramaWages = {
                    ...(p.dramaWages || {}),
                    [unit.uniqueId]: { dismissed: true, note: dismissal },
                  };
                  R.log(
                    p,
                    "drama-dismissal",
                    `${R.label(unit)} opuszcza kompanię z ekwipunkiem. ${dismissal}`,
                  );
                })
              }
            >
              Zakończ kontrakt: {R.label(unit)}
            </button>
          </details>
        </>
      )}
    </div>
  );
}
