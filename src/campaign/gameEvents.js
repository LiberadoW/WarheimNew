// Random events recorded in the game (battle.events from a campaign game,
// or "Zdarzenie losowe (NN): Name" lines of the play-mode log).
export const hadEvent = (battle, code, area = "inside") =>
  (battle?.events || []).some((e) => e.area === area && Number(e.code) === code) ||
  (battle?.log || []).some((e) => new RegExp(`^Zdarzenie losowe \\(${code}\\)`).test(e.text || ""));
