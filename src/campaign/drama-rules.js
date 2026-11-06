import profiles from "./drama.json";
import * as R from "./rules";
import { commander, livingCount, applyEffects } from "./effects";
import { createUnit } from "../Functions/createUnit";
export { profiles };
const clean = (s) =>
  R.normal(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");
export function dramaForArmy(profile, army) {
  const text = clean(
    profile.requirements.split("Aby zatrudnić")[0].split("który osiągn")[0],
  );
  const name = clean(army.name);
  if (text.includes(name)) return true;
  // Inflected names in the source still identify the same company by its distinctive stem.
  const stems = {
    "lowcy czarownic": "czarownic",
    "muszkieterzy z nuln": "nuln",
    "siostry sigmara": "sigmara",
    "zbrojna kompania z ostlandu": "ostlandu",
    "zolnierze z reiklandu": "reiklandu",
  };
  return !!stems[name] && text.includes(stems[name]);
}
export function dramaSearchProblem(post) {
  const leader = commander(post);
  if (!leader) return "Brak dowódcy zdolnego do poszukiwań.";
  if (!R.activeModel(leader, 0) || leader.battleOutOfActionModels?.[0])
    return "Dowódca nie może szukać Postaci Dramatu po poważnych obrażeniach lub nieobecności.";
  if (post.units.filter((u) => R.isHero(u) && livingCount(u) > 0).length >= 6)
    return "Brak wolnego miejsca dla bohatera.";
  if (post.dramaSearch?.locked)
    return "Poszukiwanie w tej sekwencji już rozliczono.";
  return null;
}
export function searchDrama(post, dice) {
  const problem = dramaSearchProblem(post);
  if (problem) throw Error(problem);
  if (!R.validDice(dice, 2)) throw Error("Wykonaj test CP na 2K6.");
  const cp = R.currentStats(commander(post))[8];
  post.dramaSearch = { locked: true, dice, cp, success: R.sum(dice) <= cp };
  R.log(
    post,
    "drama-search",
    `Poszukiwania Postaci Dramatu: ${dice.join("+")} ≤ CP ${cp}: ${post.dramaSearch.success ? "powodzenie" : "niepowodzenie"}.`,
  );
}
export function hireDrama(post, army, name, conditions) {
  const profile = profiles.find((p) => p.name === name);
  if (!profile || !dramaForArmy(profile, army))
    throw Error("Postać niedostępna dla tej kompanii.");
  if (!post.dramaSearch?.success || post.dramaSearch.hired)
    throw Error("Brak udanego, niewykorzystanego poszukiwania.");
  if (post.units.filter((u) => R.isHero(u) && livingCount(u) > 0).length >= 6)
    throw Error("Brak miejsca dla bohatera.");
  if (
    post.units.some((u) => u.dramaId === name && livingCount(u) > 0) ||
    (post.deadDrama || []).includes(name)
  )
    throw Error("Postać już służy lub poległa w tej kampanii.");
  if (!conditions?.trim())
    throw Error("Potwierdź warunki szczególne z profilu.");
  const cost = profile.cost || 0;
  if (post.treasury < cost) throw Error("Za mało złota.");
  const personalList = Object.assign(
    {},
    ...Object.values(army.heroes || {}).map((u) => u.equipmentList || {}),
  );
  const u = createUnit(
    {
      [name]: {
        ...profile,
        id: `drama:${profile.name}`,
        type: "Postać Dramatu",
        exp: 12,
        number: 1,
        startingEquipment: [],
        equipmentList: personalList,
      },
    },
    name,
  );
  u.dramaId = name;
  u.prestige = profile.prestige;
  u.campaignNewRecruit = true;
  u.customEquipment = [
    {
      id: R.uid(),
      name: "Ekwipunek własny — " + profile.name,
      text: profile.gearText,
      price: 0,
      personal: true,
    },
  ];
  u.campaignRuleTexts = {};
  u.dramaProfileText = profile.text;
  u.dramaRequirements = conditions;
  post.units.push(u);
  post.treasury -= cost;
  post.dramaSearch.hired = name;
  R.log(post, "drama-hire", `${name}: ${cost} zk. Warunki: ${conditions}`);
  return u;
}
const common = {
  Abdul: [2, 5, "K3"],
  Albrecht: [1, 5, "50gold"],
  Ärgera: [2, 4, "Zwój Rozproszenia"],
  Barney: [1, 1, "0"],
  Błędny: [2, 5, "K2"],
  Brokk: [1, 5, "Piwo Bugmana"],
  Caradryan: [2, 4, "K6"],
  Durgaluk: [2, 4, "K3"],
  Hans: [2, 4, "K6"],
  Kayanora: [1, 5, "K3"],
  Khalida: [2, 5, "K3"],
  Klaus: [1, 5, "Kislevska wódka"],
  Książę: [2, 5, "K3"],
  Lisaart: [2, 5, "K3"],
  Ludwig: [2, 4, "K6"],
  Ostrze: [1, 5, "K6"],
  Ramhotep: [1, 5, "50gold"],
  Ruben: [1, 4, "K6"],
  Rycerz: [2, 5, "K3"],
  Sarutori: [2, 4, "K6"],
  Silevran: [3, 5, "K6"],
  Tehenhuain: [1, 4, "K3"],
  "Tiktaq’to": [1, 5, "K3"],
  Truagg: [1, 4, "Eliksir witalności"],
  Ulther: [2, 5, "K3X15gold"],
  Wilhelm: [2, 5, "K2powder"],
  Xǔ: [1, 5, "K3"],
  Yavandir: [2, 4, "K3"],
  Zhatan: [2, 5, "K3"],
};
export const dramaWageUnits = (post) =>
  post.units.filter(
    (u) =>
      u.type === "Postać Dramatu" &&
      livingCount(u) > 0 &&
      !u.campaignNewRecruit &&
      !u.battleAbsentModels?.[0],
  );
export function dramaWagePlan(unit, answers, post) {
  const inputs = [],
    effects = [],
    pending = {};
  let ready = true,
    error = "";
  const profile = profiles.find(
    (p) => p.name === (unit.dramaId || unit.unitName),
  );
  const ask = (id, label, type, extra = {}) => {
    inputs.push({ id, label, type, ...extra });
    const v = answers[id];
    if (
      type === "dice"
        ? !R.validDice(v, extra.count)
        : !extra.options.some((o) => o.value === v)
    ) {
      ready = false;
      throw pending;
    }
    return v;
  };
  const roll = (id, expr, label = id) =>
    R.priceRoll(
      expr,
      ask(id, `${label} (${expr})`, "dice", { count: R.priceDiceCount(expr) }),
    ).price;
  const choice = (id, label, options) =>
    ask(id, label, "choice", {
      options: options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
    });
  const dismiss = () =>
    effects.push({ type: "dismiss", unitId: unit.uniqueId });
  const consume = (name, n) =>
    effects.push({ type: "consumeItem", name, quantity: n });
  const sacrifice = (id, predicate, label = "Model na ofiarę") => {
    const models = post.units
      .filter(
        (u) =>
          u.uniqueId !== unit.uniqueId && livingCount(u) > 0 && predicate(u),
      )
      .flatMap((u) =>
        Array.from({ length: R.modelCount(u) }, (_, i) =>
          !u.campaignModelStatus?.[i]?.dead &&
          !effects.some(
            (e) =>
              e.type === "dead" && e.unitId === u.uniqueId && e.index === i,
          )
            ? { value: `${u.uniqueId}:${i}`, label: `${R.label(u)} #${i + 1}` }
            : null,
        ).filter(Boolean),
      );
    if (!models.length)
      throw Error("Brak modelu spełniającego warunki ofiary.");
    const key = choice(id, label, models),
      model = models.find((m) => m.value === key);
    const split = model.value.lastIndexOf(":");
    effects.push({
      type: "dead",
      unitId: key.slice(0, split),
      index: Number(key.slice(split + 1)),
    });
  };
  const ordinary = (u) =>
    u.type === "Stronnik" &&
    ![
      "Demon",
      "Istota eteryczna",
      "Leśny duch",
      "Machina wojenna",
      "Nieumarły",
      "Opętany",
    ].some((r) => R.hasRule(u, r));
  const randomModel = (id, filter, count = 1) => {
    for (let i = 0; i < count; i++)
      sacrifice(id + i, filter, "Model wylosowany zgodnie z opisem postaci");
  };
  const pay = (expr) => {
    if (expr === "0") return;
    if (expr === "K2powder")
      consume("Krasnoludzki proch", roll("payRoll", "K2", "Porcje prochu"));
    else if (expr.endsWith("gold")) {
      const value = expr.replace("gold", "");
      effects.push({
        type: "gold",
        amount: -(R.priceDiceCount(value)
          ? roll("payRoll", value, "Żołd")
          : Number(value)),
      });
    } else if (R.priceDiceCount(expr))
      effects.push({
        type: "loot",
        amount: -roll("payRoll", expr, "Żołd w łupach"),
      });
    else consume(expr, 1);
  };
  try {
    if (!profile) throw Error("Brak źródłowego profilu postaci.");
    if (profile.name.startsWith("Monstrum")) {
      if (
        choice("feed", "Utrzymanie Monstrum", [
          "Poświęć Zombie",
          "Nie karm",
        ]) === "Poświęć Zombie"
      )
        sacrifice("zombie", (u) => R.normal(u.unitName) === "zombie");
      else if (roll("wage", "K6", "Monstrum bez pożywienia") >= 2) dismiss();
    } else if (profile.name.startsWith("Solveig")) {
      if (
        choice("feed", "Utrzymanie Solveig", [
          "Poświęć żywego stronnika",
          "Nie karm",
        ]) === "Poświęć żywego stronnika"
      )
        sacrifice("victim", ordinary);
      else if (roll("wage", "K6", "Solveig bez pożywienia") >= 5) dismiss();
      else {
        const candidates = post.units.filter(
          (u) =>
            R.isHero(u) &&
            u.uniqueId !== unit.uniqueId &&
            livingCount(u) > 0 &&
            !["Nieumarły", "Istota eteryczna", "Leśny duch", "Demon"].some(
              (r) => R.hasRule(u, r),
            ),
        );
        const id = choice(
          "madHero",
          "Wylosowany żywy bohater",
          candidates.map((u) => ({ value: u.uniqueId, label: R.label(u) })),
        );
        effects.push({
          type: "obled",
          unitId: id,
          amount: roll("madness", "K3", "Punkty Obłędu"),
        });
      }
    } else {
      const n = roll("wage", "K6", "Żołd Postaci Dramatu");
      const key = Object.keys(common).find((k) => profile.name.startsWith(k));
      if (key) {
        const [leave, payMax, cost] = common[key];
        if (n <= leave) {
          dismiss();
          if (key === "Kayanora")
            randomModel("spirit", (u) => R.hasRule(u, "Leśny duch"));
          if (["Albrecht", "Barney", "Ramhotep"].includes(key))
            choice(
              "companion",
              "Potwierdź usunięcie wskazanego w profilu towarzysza / pojazdu",
              ["Usunięto w korektach / ekwipunku"],
            );
        } else if (n <= payMax) pay(cost);
      } else if (profile.name.startsWith("Arca")) {
        if (n === 1) dismiss();
        else if (n <= 4) {
          pay("K3");
          sacrifice("victim", ordinary);
        } else pay("K2");
      } else if (profile.name.startsWith("Festus")) {
        if (n === 1) dismiss();
        else if (n <= 4)
          randomModel("victim", (u) => u.type === "Stronnik" || R.isHero(u));
      } else if (profile.name.startsWith("Grukk")) {
        if (n === 1) dismiss();
        else if (n <= 5)
          randomModel(
            "goblin",
            (u) => /goblin/i.test(u.unitName),
            roll("number", "K3", "Liczba Goblinów"),
          );
      } else if (profile.name.startsWith("Hash-ashin")) {
        if (n <= 2) dismiss();
        else if (n <= 4) consume("Gwiezdny pył", 1);
        else if (n === 5) pay("K3");
      } else if (profile.name.startsWith("Johann")) {
        if (n === 1) dismiss();
        else if (n <= 5) {
          const pigs = post.units
            .filter((u) => R.normal(u.unitName).includes("wybuchowa świnia"))
            .reduce(
              (n, u) =>
                n + (u.battleOutOfActionModels || []).filter(Boolean).length,
              0,
            );
          consume("Krasnoludzki proch", pigs);
        }
      } else if (profile.name.startsWith("Kheelk")) {
        if (n <= 2) {
          dismiss();
          effects.push(
            { type: "gold", amount: -post.treasury },
            { type: "loot", amount: -post.loot },
          );
        } else if (n <= 5) {
          pay("K2");
          if (n <= 4) sacrifice("victim", ordinary);
        }
      } else if (
        ["Luxuria", "Meduza", "Podarge"].some((k) => profile.name.startsWith(k))
      ) {
        if (n === 1) {
          dismiss();
          if (profile.name.startsWith("Luxuria"))
            effects.push(
              { type: "gold", amount: -post.treasury },
              { type: "loot", amount: -post.loot },
            );
          else
            randomModel(
              "followers",
              (u) =>
                R.normal(u.unitName).includes(
                  profile.name.startsWith("Meduza") ? "gorgon" : "harpi",
                ),
              roll("number", "K3", "Liczba towarzyszy"),
            );
        } else if (n <= 4) sacrifice("victim", (u) => u.type === "Stronnik");
      } else if (profile.name.startsWith("O-sayumi")) {
        if (n === 1) {
          dismiss();
          randomModel(
            "kabuki",
            (u) => /kabuki/i.test(u.unitName),
            roll("number", "K3", "Liczba Kabuki"),
          );
        } else if (n <= 3) pay("K3");
      } else if (profile.name.startsWith("Relikwiarz")) {
        if (n <= 2) dismiss();
        else pay(n <= 5 ? "K6" : "K3");
      } else if (profile.name.startsWith("Vilitch")) {
        if (n === 1) dismiss();
        else pay("K6");
      } else if (profile.name.startsWith("Victor")) {
        if (n === 1) dismiss();
        else if (n <= 5) {
          const heroes = post.units.filter(
            (u) =>
              R.isHero(u) &&
              livingCount(u) > 0 &&
              (u.mentalIllnesses?.length ||
                u.injuries?.some((i) => R.normal(i).includes("chorob"))),
          );
          const id = choice(
            "madHero",
            "Wylosowany bohater z chorobą psychiczną",
            heroes.map((u) => ({ value: u.uniqueId, label: R.label(u) })),
          );
          effects.push({
            type: "obled",
            unitId: id,
            amount: roll("madness", "K3", "Punkty Obłędu"),
          });
        }
      } else if (profile.name.startsWith("Wulfryk")) {
        if (n <= 3) {
          choice(
            "charge",
            "Rzut na inicjatywę pojedynku (rozstrzygnij walkę według profilu)",
            ["Wulfryk szarżuje", "Przeciwnik szarżuje"],
          );
          if (
            choice("duel", "Wynik pojedynku", [
              "Wulfryk przegrał",
              "Sprzymierzony bohater przegrał",
            ]) === "Wulfryk przegrał"
          )
            dismiss();
          else if (roll("mercy", "K6", "Los pokonanego bohatera") <= 2)
            choice(
              "injury",
              "Rozstrzygnij Wielokrotne obrażenia bohatera i zapisz je w korektach",
              ["Rozstrzygnięto obrażenia"],
            );
        }
      } else throw Error("Brak procedury żołdu dla postaci.");
    }
    // Explicit refusal is supported because the source may prescribe an additional consequence.
    if (
      effects.some(
        (e) =>
          ((e.type === "gold" || e.type === "loot") && e.amount < 0) ||
          e.type === "consumeItem",
      )
    ) {
      const decision = choice("payment", "Rozliczenie żądania", [
        "Zapłać",
        "Odmów i rozstrzygnij konsekwencje z opisu",
      ]);
      if (decision.startsWith("Odmów")) {
        effects.splice(0, effects.length);
        if (
          choice("refusalOutcome", "Rezultat odmowy zgodnie z opisem postaci", [
            "Postać odchodzi",
            "Postać pozostaje",
          ]) === "Postać odchodzi"
        )
          dismiss();
        choice(
          "refusal",
          "Potwierdź zapisanie dodatkowych konsekwencji odmowy w korektach",
          ["Konsekwencje rozstrzygnięto"],
        );
      }
    }
  } catch (e) {
    if (e !== pending) {
      ready = false;
      error = e.message;
    }
  }
  return { inputs, effects, ready, error };
}
export function settleDrama(post, unitId, answers, army) {
  if (post.dramaWages?.[unitId]) throw Error("Żołd już rozliczono.");
  const u = dramaWageUnits(post).find((u) => u.uniqueId === unitId);
  if (!u) throw Error("Ta postać nie wymaga żołdu.");
  const plan = dramaWagePlan(u, answers, post);
  if (!plan.ready) throw Error(plan.error || "Uzupełnij rzuty i decyzje.");
  applyEffects(post, plan.effects, `Żołd: ${R.label(u)}`, army);
  post.dramaWages = {
    ...(post.dramaWages || {}),
    [unitId]: { answers, effects: plan.effects },
  };
}
