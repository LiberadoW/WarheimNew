import React, { useState } from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import Reference from "./Reference";
import InjuryResolution from "./InjuryResolution";
import {
  craftsmen,
  reserveCraft,
  recipes,
  craftTargets,
  craftProblem,
  prepareCraft,
  resolveCraft,
} from "./crafting-rules";
export function CraftReservations({ post, update }) {
  const workers = craftsmen(post);
  if (!workers.length) return null;
  return (
    <details className="campaign-card">
      <summary>Przydziel rzemieślników przed eksploracją</summary>
      <p>
        Rzemieślnik tworzący runy lub mechanizmy nie generuje kości eksploracji.
        Przydział zamyka się po rzucie na eksplorację.
      </p>
      {workers.map((u) => (
        <label key={u.uniqueId}>
          {R.label(u)}
          <select
            value={post.craftReservations?.[u.uniqueId] || ""}
            disabled={post.exploration?.locked || post.explorationApplied}
            onChange={(e) =>
              update((p) => reserveCraft(p, u.uniqueId, e.target.value))
            }
          >
            <option value="">Eksploruje</option>
            {R.hasRule(u, "Kowal run") && (
              <option value="rune">Kucie run</option>
            )}
            {R.hasRule(u, "Mistrz inżynier") && (
              <option value="mechanism">Tworzenie mechanizmów</option>
            )}
          </select>
        </label>
      ))}
    </details>
  );
}
export default function Crafting({ post, update }) {
  const [crafter, setCrafter] = useState(""),
    [recipeId, setRecipe] = useState(""),
    [targetId, setTarget] = useState(""),
    [priceDice, setPriceDice] = useState([]),
    [token, setToken] = useState(""),
    [dice, setDice] = useState([]),
    [failure, setFailure] = useState([]),
    [strength, setStrength] = useState([]),
    [outcome, setOutcome] = useState(""),
    [injuryDice, setInjury] = useState([]),
    [detail, setDetail] = useState({});
  const workers = craftsmen(post).filter(
    (u) => post.craftReservations?.[u.uniqueId],
  );
  if (!workers.length) return null;
  const quote =
      post.craftQuote && !post.craftQuote.used ? post.craftQuote : null,
    recipe = recipes.find((r) => r.id === (quote?.recipeId || recipeId)),
    targets = craftTargets(post),
    target = targets.find((t) => t.id === (quote?.targetId || targetId)),
    problem = craftProblem(post, recipe, target, quote?.crafterId || crafter),
    kind = post.craftReservations?.[crafter];
  const accident = R.validDice(dice, 1) && dice[0] <= 4 && failure[0] === 1;
  const worker = post.units.find((u) => u.uniqueId === quote?.crafterId),
    injury =
      worker && R.validDice(injuryDice, R.injuryKind(worker) === "hero" ? 2 : 1)
        ? R.injuryResult(worker, injuryDice)
        : null;
  return (
    <details className="campaign-card">
      <summary>Runy i mechanizmy</summary>
      <p>
        Trzy próby run mniejszych / mechanizmów albo jedna runa mistrzowska.
        Składniki zużywane są przy powodzeniu (5+).
      </p>
      {!quote ? (
        <>
          <label>
            Rzemieślnik
            <select
              value={crafter}
              onChange={(e) => {
                setCrafter(e.target.value);
                setRecipe("");
                setPriceDice([]);
              }}
            >
              <option value="">Wybierz</option>
              {workers.map((u) => (
                <option key={u.uniqueId} value={u.uniqueId}>
                  {R.label(u)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Receptura
            <select
              value={recipeId}
              onChange={(e) => {
                setRecipe(e.target.value);
                setPriceDice([]);
              }}
            >
              <option value="">Wybierz</option>
              {recipes
                .filter((r) => r.kind === kind)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.category}: {r.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Przedmiot bazowy
            <select
              value={targetId}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="">Wybierz</option>
              {targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {R.label(post.units.find((u) => u.uniqueId === t.unitId))}:{" "}
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          {recipe && (
            <>
              <p>{recipe.text}</p>
              <DiceInput
                label="Cena składników"
                count={R.priceDiceCount(recipe.price)}
                value={priceDice}
                onChange={setPriceDice}
              />
              <label>
                Dostępność składników: {recipe.availability}
                <select
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                >
                  <option value="">Wybierz wynik</option>
                  {(post.availability || [])
                    .filter(
                      (t) =>
                        t.locked && !t.used && t.total >= recipe.availability,
                    )
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}: {t.total}
                      </option>
                    ))}
                </select>
              </label>
            </>
          )}
          <p>{problem}</p>
          <button
            className="button"
            disabled={
              !!problem ||
              !recipe ||
              !R.validDice(priceDice, R.priceDiceCount(recipe.price)) ||
              !token
            }
            onClick={() =>
              update((p) =>
                prepareCraft(p, recipeId, targetId, crafter, priceDice, token),
              )
            }
          >
            Zatwierdź recepturę i cenę
          </button>
        </>
      ) : (
        <>
          <p>
            {recipe.name} · {target?.name} · {quote.price} zk
          </p>
          <DiceInput label="Próba rzemiosła" value={dice} onChange={setDice} />
          {dice[0] <= 4 && (
            <>
              <DiceInput
                label="Tabela awarii"
                value={failure}
                onChange={setFailure}
              />
              {failure[0] === 1 && (
                <>
                  <p>
                    Przedmiot zostaje zniszczony. Rzemieślnik otrzymuje
                    trafienie o Sile K6{" "}
                    {recipe.kind === "rune"
                      ? "bez Ochrony Pancerza"
                      : "z Płonącym atakiem"}
                    . Rozstrzygnij trafienie według zasad walki.
                  </p>
                  <DiceInput
                    label="Siła trafienia awarii"
                    value={strength}
                    onChange={setStrength}
                  />
                  <label>
                    Rezultat trafienia
                    <select
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                    >
                      <option value="">Wybierz</option>
                      <option value="safe">Bez WzA</option>
                      <option value="out">Rzemieślnik WzA</option>
                    </select>
                  </label>
                  {outcome === "out" && (
                    <>
                      <DiceInput
                        label="Obrażenia po awarii"
                        count={R.injuryKind(worker) === "hero" ? 2 : 1}
                        value={injuryDice}
                        onChange={setInjury}
                      />
                      {injury && (
                        <>
                          <p>
                            {injury.name}: {injury.text}
                          </p>
                          <InjuryResolution
                            result={injury}
                            value={detail}
                            onChange={setDetail}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          <button
            className="button"
            disabled={
              !R.validDice(dice, 1) ||
              (dice[0] <= 4 && !R.validDice(failure, 1)) ||
              (accident && (!R.validDice(strength, 1) || !outcome))
            }
            onClick={() => {
              update((p) =>
                resolveCraft(
                  p,
                  dice,
                  failure,
                  strength,
                  outcome,
                  injuryDice,
                  detail,
                ),
              );
              setDice([]);
              setFailure([]);
              setStrength([]);
              setOutcome("");
              setInjury([]);
              setDetail({});
            }}
          >
            Rozlicz próbę rzemiosła
          </button>
        </>
      )}
      <Reference pages={[581, 585]} />
    </details>
  );
}
