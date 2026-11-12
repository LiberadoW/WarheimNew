import NumberInput from "./NumberInput";
import React, { useState } from "react";
import { companyLevel } from "./company";
import * as R from "./rules";
import { mercenariesList } from "../Data.js/Mercenaries";
import { recruit, recruitAvailability, recruitmentProblem } from "./recruiting";
import { AvailabilityPool } from "./Trade";
function RecruitmentForm({ post, update, army, mercenary }) {
  const [companyFree, setCompanyFree] = useState(false);
  const [name, setName] = useState(""),
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
  // Rare recruits use the smallest pool result that is enough.
  const tokens = availability > 0 ? R.usableAvailability(post, availability) : [];
  const tokenId = tokens.some((t) => t.id === token) ? token : tokens[0]?.id || "";
  return (
    <>
      <p>
        {mercenary
          ? "Najemne Ostrza korzystają z własnego ekwipunku. Wybierz najemnika dostępnego dla tej kompanii."
          : "Nowi rekruci mogą otrzymać ekwipunek powszechny. Przedmioty rzadkie dopiero po następnej potyczce, chyba że są już w skarbcu."}
      </p>
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
        {mercenary ? "Najemne Ostrze" : "Model bandy"}
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
                <NumberInput
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
          {availability > 0 &&
            (tokens.length > 0 ? (
              <label>
                Zużyje wynik puli dostępności
                <select value={tokenId} onChange={(e) => setToken(e.target.value)}>
                  {tokens.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}: {t.total}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="campaign-error">
                Rzadki rekrut ({availability}+): żaden niewykorzystany wynik puli nie wystarcza.
              </p>
            ))}
          <button
            className="button"
            disabled={
              !!problem ||
              (!companyFree && post.treasury < definition.cost) ||
              (availability > 0 && !tokenId) ||
              (imported === null && !reason.trim())
            }
            onClick={() =>
              update((p) =>
                recruit(p, army, name, {
                  mercenary,
                  companyFree: mercenary && companyFree,
                  availability,
                  tokenId,
                  sourceReason: reason,
                }),
              )
            }
          >
            {mercenary ? "Zatrudnij Najemne Ostrze" : "Zrekrutuj model bandy"}
          </button>
        </>
      )}
    </>
  );
}

export default function Recruitment(props) {
  return (
    <div className="campaign-recruitment-sections">
      <section className="campaign-recruit-pool" aria-label="Pula dostępności dla rekrutów">
        <h3>Pula dostępności</h3>
        <p className="campaign-muted">Potrzebna tylko dla rzadkich rekrutów.</p>
        <AvailabilityPool post={props.post} update={props.update} compact />
      </section>
      <section className="campaign-card" aria-label="Rekrutacja modeli bandy">
        <h3>Modele bandy</h3>
        <RecruitmentForm {...props} mercenary={false} />
      </section>
      <section className="campaign-card" aria-label="Rekrutacja Najemnych Ostrzy">
        <h3>Najemne Ostrza</h3>
        <RecruitmentForm {...props} mercenary />
      </section>
    </div>
  );
}
