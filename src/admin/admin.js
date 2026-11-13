import { collection, getDocs } from "firebase/firestore";
import { db } from "../Database/database";

// The admin is checked by Firestore rules (firestore.rules, isAdmin); the
// app keeps only a SHA-256 of the address, so the bundle does not show it.
const ADMIN_HASHES = ["f43f0a10a5c353ff45cb13bdc36246389c1d2b9ecbbdeef0a5c4cb36277469af"];

export async function isAdminEmail(email) {
  if (!email || !window.crypto?.subtle) return false;
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return ADMIN_HASHES.includes(hex);
}

// Every user's saved lists, with a display name: the one stored with the
// lists, else the name the player uses in a shared campaign.
export async function loadAllLists() {
  const [lists, campaigns] = await Promise.all([
    getDocs(collection(db, "lists")),
    getDocs(collection(db, "campaigns")).catch(() => null),
  ]);
  const names = {};
  campaigns?.docs.forEach((c) => Object.assign(names, c.data().memberNames || {}));
  return lists.docs
    .map((d) => ({
      uid: d.id,
      name: d.data().ownerName || names[d.id] || "",
      lists: d.data().lists || [],
    }))
    .sort((a, b) => (a.name || "~").localeCompare(b.name || "~", "pl"));
}
