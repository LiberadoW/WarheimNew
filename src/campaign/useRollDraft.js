// Dice awaiting confirmation belong to the saved battle draft, not a mounted
// screen: returning to a step or reloading must keep the original result.
export default function useRollDraft(post, update, key, initial = []) {
  return [post.rollDrafts?.[key] ?? initial, (value) => update((p) => {
    p.rollDrafts = { ...p.rollDrafts, [key]: value };
  })];
}
