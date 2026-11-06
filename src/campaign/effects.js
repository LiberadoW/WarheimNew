import * as R from "./rules";
import { createUnit } from "../Functions/createUnit";
import armies from "../Data.js/Armies";
import { mercenariesList } from "../Data.js/Mercenaries";

export const livingCount = (unit) =>
  R.modelCount(unit) -
  (unit.campaignModelStatus || []).filter((s) => s.dead).length;
export const livingHeroes = (post) =>
  post.units.filter((u) => R.isHero(u) && livingCount(u) > 0);
export const commander = (post) =>
  livingHeroes(post).find((u) => R.hasRule(u, "Dowódca"));
export function awardExperience(post, unitId, amount, reason) {
  const unit = post.units.find((u) => u.uniqueId === unitId);
  if (!unit || !R.canEarnExperience(unit) || !livingCount(unit)) return;
  R.grantExperience(post, unit, amount, reason);
}
export function findCatalog(name) {
  const alias = {
    Lekki: "Lekki pancerz",
    Średni: "Średni pancerz",
    Ciężki: "Ciężki pancerz",
    "Topór bojowy": "Topór bojowy / nadziak",
    "Młot bojowy": "Buława/maczuga/młot bojowy",
  };
  const search = R.normal(alias[name] || name);
  return (
    R.catalog.find((i) => R.normal(i.name) === search) ||
    R.catalog.find((i) => R.baseName(i.name) === search)
  );
}
export function foundItem(post, name, quantity = 1, metadata = {}) {
  if (quantity <= 0) return;
  const item = findCatalog(name);
  R.storeItem(post, item?.name || name, quantity, {
    ...(item
      ? {
          catalogId: item.id,
          basePrice: Number(item.price.match(/^\d+/)?.[0] || 0),
        }
      : {}),
    ...metadata,
  });
}
export function applyEffects(post, effects, reason, army) {
  for (const effect of effects) {
    const u = effect.unitId
      ? post.units.find((x) => x.uniqueId === effect.unitId)
      : null;
    switch (effect.type) {
      case "dismiss":
        post.units = post.units.filter((x) => x.uniqueId !== effect.unitId);
        break;
      case "obled":
        if (u) u.obled = Math.min(89, (Number(u.obled) || 0) + effect.amount);
        break;
      case "consumeItem": {
        let remaining = effect.quantity;
        for (const stored of post.inventory.filter(
          (i) => R.baseName(i.name) === R.baseName(effect.name),
        )) {
          const n = Math.min(remaining, stored.quantity);
          stored.quantity -= n;
          remaining -= n;
        }
        if (remaining > 0)
          throw Error(
            `Brak w skarbcu: ${effect.name} ×${remaining}. Przenieś opłatę z ekwipunku do skarbca.`,
          );
        post.inventory = post.inventory.filter((i) => i.quantity > 0);
        break;
      }
      case "gold":
        post.treasury += effect.amount;
        break;
      case "loot":
        post.loot += effect.amount;
        break;
      case "xp":
        awardExperience(post, effect.unitId, effect.amount, reason);
        break;
      case "item":
        foundItem(
          post,
          effect.name,
          effect.quantity ?? 1,
          effect.metadata || {},
        );
        break;
      case "rule":
        if (u) {
          R.addRule(u, effect.name);
          if (effect.text)
            u.campaignRuleTexts = {
              ...(u.campaignRuleTexts || {}),
              [effect.name]: effect.text,
            };
        }
        break;
      case "skip":
        if (u) {
          u.campaignModelStatus = Array.from(
            { length: R.modelCount(u) },
            (_, i) => ({
              ...u.campaignModelStatus?.[i],
              skip: Math.max(
                u.campaignModelStatus?.[i]?.skip || 0,
                effect.games,
              ),
            }),
          );
        }
        break;
      case "dead":
        if (u) {
          u.campaignModelStatus = Array.from(
            { length: R.modelCount(u) },
            (_, i) => ({
              ...u.campaignModelStatus?.[i],
              dead:
                effect.index === undefined
                  ? true
                  : i === effect.index || !!u.campaignModelStatus?.[i]?.dead,
            }),
          );
          if (effect.recoverEquipment)
            [
              ...(u.startingEquipment || []),
              ...(u.optionalEquipment || []),
            ].forEach((n) => foundItem(post, n));
        }
        break;
      case "flag":
        post.effects = { ...(post.effects || {}), [effect.key]: effect.value };
        break;
      case "future":
        post.futureEffects = post.futureEffects || [];
        if (!post.futureEffects.some((e) => e.key === effect.key))
          post.futureEffects.push({ ...effect, id: R.uid(), source: reason });
        break;
      case "persistent":
        post.persistentEffects = {
          ...(post.persistentEffects || {}),
          [effect.key]: effect.value,
        };
        break;
      case "skillAccess":
        if (u) {
          u.campaignSkillAccess = [
            ...new Set([...(u.campaignSkillAccess || []), effect.list]),
          ];
        }
        break;
      case "weaponRule":
        if (u) {
          u.weaponEnhancements = {
            ...(u.weaponEnhancements || {}),
            [effect.weapon]: [
              ...new Set([
                ...(u.weaponEnhancements?.[effect.weapon] || []),
                effect.name,
              ]),
            ],
          };
        }
        break;
      case "injury":
        R.applyInjury(
          post,
          {
            unitId: effect.unitId,
            index: effect.index || 0,
            key: `event:${reason}:${effect.unitId}:${effect.index || 0}`,
          },
          effect.result,
          effect.detail || {},
        );
        break;
      case "recruit": {
        const definitions = effect.mercenary
          ? mercenariesList
          : army.heroes?.[effect.name]
            ? army.heroes
            : Object.values(armies).find((a) => a.heroes?.[effect.name])
                ?.heroes;
        if (!definitions?.[effect.name])
          throw Error("Brak profilu rekruta: " + effect.name);
        const fresh = createUnit(definitions, effect.name);
        fresh.campaignNewRecruit = true;
        fresh.pay = definitions[effect.name].pay || 0;
        fresh.prestige = definitions[effect.name].prestige || 0;
        if (effect.freeNextBattle)
          fresh.campaignContract = { recruitmentWaived: true, source: reason };
        post.units.push(fresh);
        break;
      }
      case "groupRecruit": {
        if (!u) throw Error("Nie znaleziono grupy.");
        u.selectedNumber = R.modelCount(u) + 1;
        u.totalCost = u.cost * u.selectedNumber;
        u.campaignModelStatus = [
          ...(u.campaignModelStatus ||
            Array.from({ length: u.selectedNumber - 1 }, () => ({}))),
          {},
        ];
        break;
      }
      default:
        throw Error(`Nieobsługiwany skutek: ${effect.type}`);
    }
  }
  if (post.treasury < 0 || post.loot < 0)
    throw Error("Skutki przekraczają zasoby kompanii.");
  R.log(post, "event", reason, { effects: R.clone(effects) });
}
export const effectText = (e) =>
  e.type === "dismiss"
    ? "Opuszczenie kompanii"
    : e.type === "consumeItem"
      ? `Żołd: ${e.name} ×${e.quantity}`
      : e.type === "obled"
        ? `+${e.amount} Punktów Obłędu`
        : e.type === "gold"
          ? `${e.amount >= 0 ? "+" : ""}${e.amount} zk`
          : e.type === "loot"
            ? `${e.amount >= 0 ? "+" : ""}${e.amount} łupów`
            : e.type === "item"
              ? `${e.name} ×${e.quantity ?? 1}`
              : e.type === "xp"
                ? `+${e.amount} PD`
                : e.type === "skip"
                  ? `Pauza: ${e.games} potyczka/i`
                  : e.type === "rule"
                    ? `Zasada: ${e.name}`
                    : e.type === "weaponRule"
                      ? `${e.weapon}: ${e.name}`
                      : e.type === "dead"
                        ? "Utrata modelu"
                        : e.type === "recruit"
                          ? `Rekrut: ${e.name}`
                          : e.type === "injury"
                            ? `Obrażenia: ${e.result.name}`
                            : e.type === "skillAccess"
                              ? `Dostęp do listy umiejętności ${e.list + 1}`
                              : e.type === "groupRecruit"
                                ? "Dołączenie rekruta do grupy"
                                : e.label || e.key;
