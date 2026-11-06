import React, { useState } from "react";
import { companyLevel } from "./company";
import * as R from "./rules";
import { mercenariesList } from "../Data.js/Mercenaries";
import { recruit, recruitAvailability, recruitmentProblem } from "./recruiting";
export default function Recruitment({ post, update, army }) {
  const [companyFree, setCompanyFree] = useState(false);
  const [name, setName] = useState(""),
    [mercenary, setMercenary] = useState(false),
    [manual, setManual] = useState(0),
    [reason, setReason] = useState(""),
    [token, setToken] = useState("");
  const definitions = mercenary
    ? Object.fromEntries(
        (army.mercenaries || [])
          .filter((n) => mercenariesList[n])
          .map((n) => [n, mercenariesList[n]]),
      )
    : army.heroes || {};
  const definition = definitions[name],
    imported =
      companyFree && mercenary ? 0 : recruitAvailability(army, name, mercenary),
    availability = imported ?? manual;
  const problem = name ? recruitmentProblem(post, army, name, mercenary) : null;
  return (
    <>
      <p>
        Nowi rekruci mogą otrzymać ekwipunek powszechny. Przedmioty rzadkie
        dopiero po następnej potyczce, chyba że są już w skarbcu. Najemne Ostrza
        korzystają z własnego ekwipunku.
      </p>
      <label className="campaign-check">
        <input
          type="checkbox"
          checked={mercenary}
          onChange={(e) => {
            setMercenary(e.target.checked);
            setCompanyFree(false);
            setName("");
            setToken("");
          }}
        />
        Najemne Ostrza dostępne dla kompanii
      </label>
      {mercenary && companyLevel(post, "Kompania najemników") > 0 && (
        <label className="campaign-check">
          <input
            type="checkbox"
            checked={companyFree}
            disabled={post.companyMercRecruited}
            onChange={(e) => setCompanyFree(e.target.checked)}
          />
          Kompania najemników: jeden rekrut bez kosztu i testu dostępności
        </label>
      )}
      <label>
        Nowy rekrut
        <select
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setToken("");
            setReason("");
          }}
        >
          <option value="">Wybierz</option>
          {Object.keys(definitions).map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      {definition && (
        <>
          <p>
            Koszt:{" "}
            {companyFree
              ? 0
              : definition.cost *
                R.modelCount({
                  selectedNumber: [
                    "Duże Dźgacze",
                    "Drużyna ciężkich broni",
                  ].includes(name)
                    ? 2
                    : 1,
                })}{" "}
            zk{mercenary ? ` · żołd: ${definition.pay} zk` : ""} · Dostępność:{" "}
            {imported === null
              ? "brak rozpoznanego profilu"
              : availability || "powszechna"}
          </p>
          {problem && <p>{problem}</p>}
          {imported === null && (
            <>
              <label>
                Dostępność z opisu rekruta (0 = powszechna)
                <input
                  type="number"
                  min="0"
                  value={manual}
                  onChange={(e) =>
                    setManual(Math.max(0, Math.trunc(Number(e.target.value))))
                  }
                />
              </label>
              <label>
                Źródło / zasada dostępności
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
            </>
          )}
          {availability > 0 && (
            <label>
              Wynik puli dostępności
              <select value={token} onChange={(e) => setToken(e.target.value)}>
                <option value="">Wybierz</option>
                {(post.availability || [])
                  .filter((t) => t.locked && !t.used && t.total >= availability)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}: {t.total}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <button
            className="button"
            disabled={
              !!problem ||
              (!companyFree && post.treasury < definition.cost) ||
              (availability > 0 && !token) ||
              (imported === null && !reason.trim())
            }
            onClick={() =>
              update((p) =>
                recruit(p, army, name, {
                  mercenary,
                  companyFree: mercenary && companyFree,
                  availability,
                  tokenId: token,
                  sourceReason: reason,
                }),
              )
            }
          >
            Zrekrutuj
          </button>
        </>
      )}
    </>
  );
}
