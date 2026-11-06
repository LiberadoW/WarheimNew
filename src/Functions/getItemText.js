import { items } from "../Data.js/Items";

export const getItemText = (item, unit) => {
  // PDF ch. 14 has two Włócznia profiles: piechota and kawaleria (also
  // monster riders and chariot crews). A third stats row means the model has
  // a mount or vehicle.
  if (item === "Włócznia") {
    const mounted = unit && unit.stats && Object.keys(unit.stats).length === 3;
    return mounted
      ? "Premia +1 do SIŁY w czasie szarży, drzewcowa, uderza jako pierwszy, zasięgowa."
      : "Drzewcowa, uderza jako pierwszy, zasięgowa.";
  }

  return items[item];
};
