import { useEffect, useState, useCallback } from "react";
const empty = (owner) => ({
  owner,
  unitList: [],
  army: "Cyrkowcy z Ligii Ostermarku",
  armyName: "",
  campaignNotes: {},
});
const read = (owner) => {
  try {
    const value = JSON.parse(localStorage.getItem(`warheim:draft:${owner}`));
    return value?.owner === owner ? value : empty(owner);
  } catch {
    return empty(owner);
  }
};
export default function useCampaignDraft(owner) {
  const [draft, setDraft] = useState(() => read(owner));
  const [storageError, setStorageError] = useState("");
  useEffect(() => {
    setDraft(read(owner));
  }, [owner]);
  useEffect(() => {
    if (draft.owner !== owner) return;
    try {
      localStorage.setItem(`warheim:draft:${owner}`, JSON.stringify(draft));
      setStorageError("");
    } catch {
      setStorageError(
        "Nie udało się zapisać wersji roboczej na tym urządzeniu. Zapisz armię na koncie.",
      );
    }
  }, [draft, owner]);
  const setField = useCallback(
    (field, value) =>
      setDraft((prev) => ({
        ...prev,
        [field]: typeof value === "function" ? value(prev[field]) : value,
      })),
    [],
  );
  return [draft, setField, storageError];
}
