// Keeping a post-battle sequence safe outside this device's draft.
//
// sequenceDraft (on the saved list): the sequence under way, so it survives
// opening another company or another device; cleared when it finishes.
// campaign.lastSequence (in the company's notes): the finished sequence as it
// was just before saving, so it can be reopened and changed until the next
// skirmish starts. Both are JSON text: Firestore takes no nested arrays.

export const unpack = (text) => {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

export const packDraft = (unitList, battle) => JSON.stringify({ unitList, battle });

// The notes before finishing, without the history (kept once, on the notes).
export const packLastSequence = (unitList, notes) => {
  const { campaign = {}, ...rest } = notes || {};
  const { history, lastSequence, activeBattle, ...camp } = campaign;
  return JSON.stringify({ unitList, battle: activeBattle, notes: { ...rest, campaign: camp } });
};

// The last finished sequence can be reopened while it is the newest one and
// no other skirmish has started.
export const canReopen = (notes) => {
  const c = notes?.campaign || {};
  if (c.activeBattle) return false;
  const last = unpack(c.lastSequence);
  const history = c.history || [];
  return !!last?.battle && history.length > 0 && history[history.length - 1].id === last.battle.id;
};

// The company and notes to continue the reopened sequence from (its summary
// step); finishing again replaces the entry it saved before.
export const reopenSequence = (notes) => {
  const c = notes.campaign;
  const last = unpack(c.lastSequence);
  return {
    unitList: last.unitList,
    notes: {
      ...last.notes,
      campaign: {
        ...last.notes.campaign,
        history: (c.history || []).filter((h) => h.id !== last.battle.id),
        activeBattle: { ...last.battle, reopened: true },
        lastSequence: null,
      },
    },
  };
};
