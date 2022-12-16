import { items } from "../Data.js/Items";

export const getItemText = (item, unit) => {
  if (item === "Włócznia") {
    const text =
      Object.keys(unit.stats).length === 3
        ? "Premia +1 do SIŁY w czasie szarży, drzewcowa, uderza jako pierwszy."
        : "Drzewcowa, uderza jako pierwszy";
    return text;
  }

  return items[item];
};
