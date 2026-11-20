import NumberInput from "./NumberInput";
import React, { useState } from "react";
import { companyLevel } from "./company";
import * as R from "./rules";
import { mercenariesList } from "../Data.js/Mercenaries";
import {
  canCommand, commandRoleProblem, groupRecruitQuote, legacyJoins, recruit,
  recruitAvailability, recruitGroups, recruitmentProblem, undoExperiencedJoin, undoLegacyJoin,
} from "./recruiting";
import { createUnit } from "../Functions/createUnit";
import { getShortEquipment } from "../Functions/displayEquipment";
import DiceInput from "./DiceInput";
import { AvailabilityPool } from "./Trade";
function RecruitmentForm({ post, update, army, mercenary }) {
  const [companyFree, setCompanyFree] = useState(false);
  const [name, setName] = useState(""),
    [manual, setManual] = useState(0),
    [reason, setReason] = useState(""),
    [token, setToken] = useState(""),
    [role, setRole] = useState(""),
    [groupId, setGroupId] = useState(""),
    [displayName, setDisplayName] = useState("");
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
  // Promotion to banner bearer / musician (+20 zk) for profiles with the rule.
  const sample = !mercenary && definition ? createUnit(definitions, name) : null;
  const groups = recruitGroups(post, name, sample);
  const group = groups.find((candidate) => candidate.uniqueId === groupId);
  const join = group ? groupRecruitQuote(post, group, sample) : null;
  const roleOptions = !groupId && sample && canCommand(sample) ? ["Chorąży", "Sygnalista"] : [];
  const roleProblem = !groupId && role && sample ? commandRoleProblem(post, sample, role) : null;
  const baseCost = companyFree ? 0 : (definition?.cost || 0) * (sample ? R.modelCount(sample) : 1);
  const cost = join?.cost ?? (baseCost + (!groupId && role ? R.COMMAND_COST : 0));
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
            setRole("");
            setGroupId("");
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
          {(groups.length > 0 || groupId) && (
            <label>
              Przydział stronnika
              <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                <option value="">Utwórz nową grupę</option>
                {groupId && !group && <option value={groupId} disabled>Grupa niedostępna</option>}
                {groups.map((candidate) => (
                  <option key={candidate.uniqueId} value={candidate.uniqueId}>
                    {R.label(candidate)} · {R.groupSize(candidate)}/{R.groupLimit(candidate)} modeli · {candidate.exp || 0} PD
                  </option>
                ))}
              </select>
            </label>
          )}
          <p>
            Koszt: {cost} zk{join && !join.taxReady ? " + podatek" : ""}
            {mercenary ? ` · żołd: ${definition.pay} zk` : ""} · Dostępność:{" "}
            {imported === null
              ? "brak rozpoznanego profilu"
              : availability || "powszechna"}
          </p>
          {join && (
            <>
              <p>
                Ekwipunek grupy: {getShortEquipment(group).join(", ") || "brak"}.<br />
                {join.exp} PD z puli ({post.recruitBudget || 0} PD dostępnych) · dopłata {join.exp * 2} zk.
                {join.role && join.role !== "full" && ` Rekrut dołącza jako ${join.role.toLowerCase()} (+${R.COMMAND_COST} zk).`}
                {join.fromStash.length > 0 && <> Ze skarbca: {join.fromStash.map((item) => item.name).join(", ")}.</>}
              </p>
              {join.taxes.length > 0 && (
                <div className="campaign-join-tax" key={join.taxKey}>
                  <p>Podatek za ekwipunek rekruta{join.taxReady ? `: ${join.tax} zk` : ""}.</p>
                  {join.taxes.map((item) => (
                    <DiceInput key={item.key}
                      label={`Podatek: ${item.name} (cena podstawowa ${item.price} zk)`}
                      count={item.dice} value={join.taxRolls[item.key] || []}
                      onChange={(dice) => update((p) => {
                        p.rollDrafts = {
                          ...p.rollDrafts,
                          [join.taxKey]: { ...p.rollDrafts?.[join.taxKey], [item.key]: dice },
                        };
                      })} />
                  ))}
                </div>
              )}
              {join.problem && <p className="campaign-error">{join.problem}</p>}
            </>
          )}
          {problem && <p className="campaign-error">{problem}</p>}
          {!groupId && (
            <label>
              Imię (opcjonalnie)
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={name} />
            </label>
          )}
          {roleOptions.length > 0 && (
            <label>
              Awans (Chorążowie &amp; sygnaliści, +{R.COMMAND_COST} zk)
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Bez awansu</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r} (+{R.COMMAND_COST} zk)
                  </option>
                ))}
              </select>
            </label>
          )}
          {roleProblem && <p className="campaign-error">{roleProblem}</p>}
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
              !!roleProblem ||
              (!!groupId && (!join || !!join.problem)) ||
              post.treasury < cost ||
              (availability > 0 && !tokenId) ||
              (imported === null && !reason.trim())
            }
            onClick={() => {
              update((p) =>
                recruit(p, army, name, {
                  mercenary,
                  companyFree: mercenary && companyFree,
                  availability,
                  tokenId,
                  sourceReason: reason,
                  commandRole: groupId ? "" : role,
                  displayName: groupId ? "" : displayName,
                  groupId,
                }),
              );
              setDisplayName("");
            }}
          >
            {mercenary ? "Zatrudnij Najemne Ostrze" : groupId ? "Dołącz rekruta" : "Zrekrutuj model bandy"}
          </button>
        </>
      )}
    </>
  );
}

function JoinedRecruits({ post, update }) {
  const joins = [...(post.experiencedJoins || []), ...legacyJoins(post)];
  if (!joins.length) return null;
  return (
    <div className="campaign-joined">
      <p>Dołączeni w tej sekwencji:</p>
      <ul>
        {joins.map((join) => (
          <li key={join.id}>
            {join.name}{join.role ? ` (${join.role.toLowerCase()})` : ""} · {join.cost} zk, {join.exp} PD{" "}
            <button type="button" className="button button-ghost button-small"
              onClick={() => update((p) => (join.legacy ? undoLegacyJoin(p, join.id) : undoExperiencedJoin(p, join.id)))}>
              Cofnij
            </button>
          </li>
        ))}
      </ul>
    </div>
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
        <JoinedRecruits {...props} />
      </section>
      <section className="campaign-card" aria-label="Rekrutacja Najemnych Ostrzy">
        <h3>Najemne Ostrza</h3>
        <RecruitmentForm {...props} mercenary />
      </section>
    </div>
  );
}
