import useRollDraft from "./useRollDraft";
import React, { useState } from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import Reference from "./Reference";
import {
  sanityTasks,
  mental,
  resolveSanity,
  mutationResult,
  applyMutation,
} from "./sanity";
export function SanityTasks({ post, update }) {
  return (
    <>
      {sanityTasks(post).map((task) => (
        <Illness key={task.key} task={task} post={post} update={update} />
      ))}
    </>
  );
}
function Illness({ task, post, update }) {
  const draft = post.sanityDrafts?.[task.key] || { dice: [], note: "" },
    entry = R.validDice(draft.dice, 2)
      ? mental.find((e) => e.code === R.k66(draft.dice))
      : null;
  const patch = (changes) =>
    update((p) => {
      p.sanityDrafts = {
        ...(p.sanityDrafts || {}),
        [task.key]: { ...draft, ...changes },
      };
    });
  return (
    <article className="campaign-card">
      <h3>
        {R.label(post.units.find((u) => u.uniqueId === task.unitId))}:{" "}
        {task.threshold} PO — choroba psychiczna
      </h3>
      <DiceInput
        label={`Choroba psychiczna: ${task.threshold} PO`}
        count={2}
        value={draft.dice}
        onChange={(dice) => patch({ dice })}
      />
      {entry && (
        <>
          <p>
            {entry.name}: {entry.text}
          </p>
          <label>
            Rozliczenie dodatkowych efektów (np. utrata umiejętności przy
            amnezji)
            <textarea
              value={draft.note}
              onChange={(e) => patch({ note: e.target.value })}
            />
          </label>
          <button
            className="button"
            disabled={entry.code === 15 && !draft.note.trim()}
            onClick={() =>
              update((p) => resolveSanity(p, task, draft.dice, draft.note))
            }
          >
            Zastosuj chorobę psychiczną
          </button>
        </>
      )}
    </article>
  );
}
export function Mutations({ post, update }) {
  const [unitId, setId] = useRollDraft(post, update, "mutation-unitId", ""),
    [god, setGod] = useRollDraft(post, update, "mutation-god", "Niepodzielony"),
    [dice, setDice] = useRollDraft(post, update, "mutation-dice", []),
    [test, setTest] = useRollDraft(post, update, "mutation-test", []),
    [secondary, setSecondary] = useRollDraft(post, update, "mutation-secondary", []),
    [mentalDice, setMental] = useRollDraft(post, update, "mutation-mentalDice", []),
    [reason, setReason] = useState(""),
    [note, setNote] = useState("");
  const unit = post.units.find((u) => u.uniqueId === unitId),
    entry = mutationResult(god, dice),
    limit = unit?.mutationLimit ?? R.currentStats(unit || {})[4],
    needsTest = unit && (unit.mutations || []).length + 1 > limit;
  return (
    <details className="campaign-card">
      <summary>Stygmaty Chaosu — tabela K66</summary>
      <label>
        Model
        <select
          value={unitId}
          onChange={(e) => {
            setId(e.target.value);
            setDice([]);
          }}
        >
          <option value="">Wybierz</option>
          {post.units
            .filter((u) => !u.campaignModelStatus?.every((s) => s.dead))
            .map((u) => (
              <option key={u.uniqueId} value={u.uniqueId}>
                {R.label(u)}
              </option>
            ))}
        </select>
      </label>
      <label>
        Znak Chaosu
        <select
          disabled={R.validDice(dice, 2)}
          value={god}
          onChange={(e) => {
            setGod(e.target.value);
            setDice([]);
          }}
        >
          {["Niepodzielony", "Khorne", "Nurgle", "Slaanesh", "Tzeentch"].map(
            (g) => (
              <option key={g}>{g}</option>
            ),
          )}
        </select>
      </label>
      <label>
        Źródło prawa do mutacji (zasada, awans lub zdarzenie)
        <input value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <DiceInput
        label="Stygmat Chaosu"
        count={2}
        value={dice}
        onChange={setDice}
      />
      {entry && (
        <>
          <p>
            {entry.name}: {entry.text}
          </p>
          {needsTest && (
            <DiceInput
              label={`Test WT po przekroczeniu limitu ${limit} mutacji`}
              value={test}
              onChange={setTest}
            />
          )}{" "}
          {entry.name === "Atrofia" && (
            <DiceInput
              label="Efekt atrofii"
              value={secondary}
              onChange={setSecondary}
            />
          )}{" "}
          {entry.name === "Szaleństwo" && (
            <DiceInput
              label="Choroba z mutacji"
              count={2}
              value={mentalDice}
              onChange={setMental}
            />
          )}
          <label>
            Notatka o dodatkowych lub warunkowych efektach
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button
            className="button"
            disabled={
              !unit || !reason.trim() || (needsTest && !R.validDice(test, 1))
            }
            onClick={() => {
              update((p) =>
                applyMutation(p, unitId, god, dice, {
                  testDice: test,
                  secondary,
                  mentalDice,
                  note,
                  reason,
                }),
              );
              setDice([]);
              setTest([]);
              setSecondary([]);
              setMental([]);
            }}
          >
            Zastosuj stygmat
          </button>
        </>
      )}
      <Reference pages={[542]} />
    </details>
  );
}
