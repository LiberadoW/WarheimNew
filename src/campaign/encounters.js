import * as R from "./rules";
import { campaignModelLimit } from "./company";
import { livingCount, livingHeroes, commander } from "./effects";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import { mercenariesList } from "../Data.js/Mercenaries";

// Each encounter is a deterministic recipe. Missing inputs are returned to the UI;
// no dice are rolled and no roster is changed while computing a preview.
export function encounterPlan(event, answers = {}, post, army) {
  const inputs = [],
    effects = [];
  let ready = true,
    error = "";
  const pending = { pending: true };
  const ask = (id, label, type, options = {}) => {
    const value = answers[id];
    const descriptor = { id, label, type, ...options };
    inputs.push(descriptor);
    let valid =
      type === "dice"
        ? R.validDice(value, options.count)
        : type === "allocation"
          ? value &&
            Object.values(value).every((n) => Number.isInteger(n) && n >= 0) &&
            Object.values(value).reduce((a, b) => a + b, 0) === options.total
          : type === "number"
            ? Number.isInteger(value) &&
              value >= options.min &&
              value <= options.max
            : options.options?.some((o) => o.value === value);
    if (!valid) {
      ready = false;
      throw pending;
    }
    return value;
  };
  const dice = (id, expression, label = id) => {
    const count = R.priceDiceCount(expression);
    const values = ask(id, `${label} (${expression})`, "dice", { count });
    return R.priceRoll(expression, values).price;
  };
  const choice = (id, label, options) =>
    ask(id, label, "choice", {
      options: options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o,
      ),
    });
  const heroes = livingHeroes(post),
    eligible = R.eligibleHeroes(post.units);
  const chooseHero = (id, label = "Wybierz bohatera", list = eligible) => {
    if (!list.length)
      throw Error("Brak uprawnionego bohatera do tej czynności.");
    const idValue = choice(
      id,
      label,
      list.map((u) => ({ value: u.uniqueId, label: R.label(u) })),
    );
    return post.units.find((u) => u.uniqueId === idValue);
  };
  const amount = (type, n, extra = {}) => {
    if (n) effects.push({ type, amount: n, ...extra });
  };
  const item = (name, quantity = 1, metadata = {}) =>
    effects.push({ type: "item", name, quantity, metadata });
  const flag = (key, value, label) =>
    effects.push({ type: "flag", key, value, label });
  const future = (key, label, extra = {}) =>
    effects.push({ type: "future", key, label, ...extra });
  const persistent = (key, value, label) =>
    effects.push({ type: "persistent", key, value, label });
  const xp = (u, n) => {
    if (u) amount("xp", n, { unitId: u.uniqueId });
  };
  const distribute = (id, n) => {
    const candidates = heroes.filter(
      (u) => R.canEarnExperience(u) && Number(u.exp) < 90,
    );
    const pool = Math.min(
      n,
      candidates.reduce((total, u) => total + 90 - (Number(u.exp) || 0), 0),
    );
    if (!pool) return;
    const allocation = ask(
      id,
      `Rozdziel ${pool} PD pomiędzy bohaterów`,
      "allocation",
      {
        total: pool,
        options: candidates.map((u) => ({
          value: u.uniqueId,
          label: R.label(u),
          max: 90 - (Number(u.exp) || 0),
        })),
      },
    );
    Object.entries(allocation).forEach(([unitId, n]) => {
      if (
        !candidates.some((u) => u.uniqueId === unitId) ||
        n >
          90 - (Number(post.units.find((u) => u.uniqueId === unitId)?.exp) || 0)
      )
        throw Error("Nieprawidłowy przydział PD.");
      if (n) amount("xp", n, { unitId });
    });
  };
  const test = (id, u, index, label = R.STATS[index]) => {
    // CP is tested on 2K6: equal to or below the characteristic passes.
    if (index === 8)
      return (
        dice(id, "2K6", `${R.label(u)}: test ${label} (CP ${R.currentStats(u)[8]})`) <=
        R.currentStats(u)[8]
      );
    const n = dice(id, "K6", `${R.label(u)}: test ${label}`);
    return n === 1 || (n !== 6 && n <= R.currentStats(u)[index]);
  };
  const holy =
    [
      "Bractwo Rycerskie",
      "Łowcy czarownic",
      "Siostry Sigmara",
      "Rycerze Graala",
    ].some((n) => R.normal(n) === R.normal(army.name)) ||
    post.units.some((u) => R.hasRule(u, "Duchowny") && livingCount(u));
  const nature = R.normal(army.nature),
    evil = /zła|chaotyczna/.test(nature),
    neutral = /neutralna/.test(nature);
  const undead = /nieumarł|eteryczn/.test(R.normal(army.name));
  const chooseWeapon = (id, u) =>
    choice(
      id,
      "Broń bohatera",
      [...(u.startingEquipment || []), ...(u.optionalEquipment || [])].filter(
        (n, i, a) =>
          a.indexOf(n) === i &&
          (!getEquipmentStats(n) ||
            getEquipmentStats(n).range === "Walka wręcz"),
      ),
    );
  const injuryDetail = (id, u, result) => {
    const detail = {};
    const code = result.min || result.code;
    if ([16, 23, 25, 35, 56].includes(code))
      detail.secondary = ask(
        id + "secondary",
        "Dodatkowy rzut obrażeń",
        "dice",
        { count: 1 },
      );
    if (code === 16) {
      detail.children = Array.from(
        { length: Math.ceil(detail.secondary[0] / 2) },
        (_, i) => {
          const rolls = ask(id + "child" + i, "Dodatkowa rana K66", "dice", {
            count: 2,
          });
          const r = R.multipleInjury(rolls);
          return { ...injuryDetail(id + "sub" + i, u, r), dice: rolls };
        },
      );
    }
    if (code === 24)
      detail.mental = ask(id + "mental", "Choroba psychiczna K66", "dice", {
        count: 2,
      });
    if (code === 65) {
      detail.arena = choice(id + "arena", "Wynik rozegranej walki na arenie", [
        { value: "win", label: "Zwycięstwo" },
        { value: "loss", label: "Porażka" },
      ]);
      if (detail.arena === "loss") {
        detail.secondary = ask(id + "arenaLoss", "Następstwa porażki", "dice", {
          count: 1,
        });
        if (detail.secondary[0] <= 2) {
          const rolls = ask(id + "arenaWound", "Dodatkowa rana K66", "dice", {
            count: 2,
          });
          detail.children = [
            {
              dice: rolls,
              ...injuryDetail(id + "arenaSub", u, R.multipleInjury(rolls)),
            },
          ];
        }
      }
    }
    return detail;
  };
  const injury = (id, u, index = 0) => {
    const count = R.injuryKind(u) === "hero" ? 2 : 1;
    const rolls = ask(id, "Obrażenia: " + R.label(u), "dice", { count });
    const result = R.injuryResult(u, rolls);
    effects.push({
      type: "injury",
      unitId: u.uniqueId,
      index,
      result,
      detail: injuryDetail(id, u, result),
    });
  };
  const fightEach = (threshold) => {
    for (const u of post.units.filter((u) => livingCount(u) > 0))
      for (let i = 0; i < R.modelCount(u); i++)
        if (
          !u.campaignModelStatus?.[i]?.dead &&
          dice(
            `fight-${u.uniqueId}-${i}`,
            "K6",
            `Starcie: ${R.label(u)} #${i + 1}`,
          ) >= threshold
        )
          injury(`wound-${u.uniqueId}-${i}`, u, i);
  };
  const captives = (id, insideSingle = false) => {
    const choices = [];
    if (evil) choices.push("Sprzedaj", "Ofiara");
    if (undead) choices.push("Ożyw jako Zombie");
    if (!evil && !undead) choices.push("Pomóż");
    choices.push("Odejdź");
    const c = choice(id, "Postępowanie z napotkanymi", choices);
    if (c === "Sprzedaj")
      amount(
        "gold",
        dice(
          "captivesGold",
          insideSingle ? "2K6" : event.key === "33" ? "K6X5" : "3K6",
          "Uzyskane złoto",
        ),
      );
    if (c === "Ofiara") {
      if (insideSingle) xp(commander(post), 1);
      else distribute("captivePD", dice("captivePDroll", "K3", "Uzyskane PD"));
    }
    if (c === "Ożyw jako Zombie") {
      const n = insideSingle ? 1 : dice("zombies", "K3", "Liczba Zombie");
      for (let i = 0; i < n; i++)
        effects.push({ type: "recruit", name: "Zombie" });
    }
    if (c === "Pomóż") {
      if (event.key === "44") {
        future(
          "extraExplorationDropLowest",
          "Następna eksploracja: +1 kość, odrzuć najniższą.",
          { extraDice: 1, discardLowest: 1 },
        );
      } else if (event.key === "22") {
        if (dice("madman", "K6", "Wskazówki szaleńca") >= 4)
          future(
            "scoutOutside",
            "Następna potyczka poza murami: do 3 zwiadowców, do 4 cali od siebie.",
            { area: "outside" },
          );
      } else {
        const gold = dice("reward", "2K6", "Nagroda");
        amount("gold", gold);
        if (event.key === "33" && R.sum(answers.reward || []) === 12)
          amount("loot", dice("orphanLoot", "K3", "Ukryty skarb"));
        if (event.key === "333") freeRecruit("prisoner", false);
      }
    }
  };
  const freeRecruit = (id, allowMercenary = true, assassin = false) => {
    const groups = post.units.filter(
      (u) =>
        u.type === "Stronnik" &&
        post.units
          .filter((v) => !["Najemne Ostrze", "Postać Dramatu"].includes(v.type))
          .reduce((n, v) => n + livingCount(v), 0) <
          campaignModelLimit(army, post) &&
        livingCount(u) > 0 &&
        livingCount(u) < Math.min(u.number || 5, 5) &&
        R.joiningRole(u) !== "full" &&
        !["Wielkolud", "Potwór", "Kawalerzysta", "Machina wojenna"].some((r) =>
          R.hasRule(u, r),
        ),
    );
    const mercs = (assassin ? ["Skrytobójca"] : army.mercenaries || []).filter(
      (n) =>
        mercenariesList[n] &&
        !post.units.some((u) => u.unitName === n && livingCount(u) > 0),
    );
    const options = [
      { value: "leave", label: "Nie przyjmuj rekruta" },
      ...groups.map((u) => ({
        value: "group:" + u.uniqueId,
        label:
          "Do grupy: " +
          R.label(u) +
          (R.joiningRole(u) ? ` (jako ${R.joiningRole(u).toLowerCase()}, +${R.COMMAND_COST} zk)` : ""),
      })),
      ...(allowMercenary
        ? mercs.map((n) => ({ value: "merc:" + n, label: n }))
        : []),
    ];
    const selected = choice(id, "Wybierz rekruta", options);
    if (selected === "leave") return;
    if (selected.startsWith("merc:"))
      effects.push({
        type: "recruit",
        name: selected.slice(5),
        mercenary: true,
        freeNextBattle: !assassin,
      });
    else {
      const u = groups.find((u) => u.uniqueId === selected.slice(6));
      const cost = [
        ...(u.startingEquipment || []),
        ...(u.optionalEquipment || []),
      ].reduce((n, name) => n + (u.equipmentList?.[name]?.[0] || 0), 0) +
        // Joining a banner bearer's group the recruit becomes his musician
        // (or the other way round): +20 zk.
        (R.joiningRole(u) ? R.COMMAND_COST : 0);
      if (post.treasury < cost)
        throw Error("Za mało złota na wyposażenie rekruta.");
      amount("gold", -cost);
      effects.push({ type: "groupRecruit", unitId: u.uniqueId });
    }
  };
  try {
    const id = event.area + ":" + event.key;
    switch (id) {
      case "inside:11": {
        const u = chooseHero("wellHero");
        if (test("wellTest", u, 4)) {
          amount("loot", 1);
          xp(u, 1);
        } else effects.push({ type: "skip", unitId: u.uniqueId, games: 1 });
        break;
      }
      case "inside:22": {
        const n = dice("stall", "K6", "Znalezisko");
        if (n === 1) item("Psia Łapka");
        else amount("gold", n);
        break;
      }
      case "inside:33": {
        const n = dice("corpse", "K6", "Przeszukanie zwłok");
        if (n <= 2) amount("gold", dice("corpseGold", "K6", "Złoto"));
        else
          item({ 3: "Sztylet", 4: "Topór bojowy", 5: "Miecz", 6: "Średni" }[n]);
        break;
      }
      case "inside:44":
      case "outside:22":
        captives("madmanChoice", true);
        break;
      case "inside:55":
      case "outside:44": {
        const n = dice("wagon", "K6", "Zawartość powozu");
        if (n <= 2) item(event.area === "inside" ? "Mapy" : "Lina & hak");
        else if (n <= 4) amount("gold", dice("wagonGold", "2K6", "Złoto"));
        else if (event.area === "inside") {
          item("Rapier");
          item("Sztylet");
          item("Średni");
        } else
          item("Krasnoludzki proch", dice("powder", "K3", "Liczba porcji"));
        break;
      }
      case "inside:66":
      case "outside:11":
      case "outside:55":
        amount("gold", dice("foundGold", "K6", "Znalezione złoto"));
        break;
      case "outside:33":
      case "inside:333":
        captives("captives");
        break;
      case "outside:66": {
        for (const u of eligible.filter((u) =>
          [...(u.startingEquipment || []), ...(u.optionalEquipment || [])].some(
            (n) =>
              getEquipmentStats(n)?.range &&
              getEquipmentStats(n).range !== "Walka wręcz",
          ),
        )) {
          const n = dice(
            "hunt" + u.uniqueId,
            "K6",
            `Strzał ${R.label(u)} (-1 do trafienia)`,
          );
          if (n >= Math.max(2, 8 - (R.currentStats(u)[2] || 0))) xp(u, 1);
        }
        flag(
          "incomeLevel",
          -1,
          "Zaopatrzenie: poziom liczebności -1 przy sprzedaży łupów.",
        );
        break;
      }
      case "inside:111": {
        const u = commander(post) || chooseHero("leader", "Dowódca");
        if (
          [
            "bractwo rycerskie",
            "łowcy czarownic",
            "siostry sigmara",
            "rycerze graala",
          ].includes(R.normal(army.name)) ||
          undead ||
          test("innCP", u, 8)
        )
          amount("gold", dice("innGold", "4K6", "Sprzedaż alkoholu"));
        else future("drunken", "Uczta w piwnicy gospody — bez przychodu.");
        break;
      }
      case "inside:222": {
        const n = dice("smith", "K6", "Znalezisko u kowala");
        if (n === 6)
          amount("gold", dice("smithGold", "2K6", "Ruda i stopy żelaza"));
        else
          item(
            {
              1: "Miecz",
              2: "Broń wielka",
              3: "Cep bojowy",
              4: "Halabarda",
              5: "Kopia",
            }[n],
            n === 4 ? dice("smithCount", "K3", "Liczba halabard") : 1,
          );
        break;
      }
      case "inside:444": {
        const n = dice("bows", "K6", "Znalezisko u łucznika");
        item(
          n <= 2
            ? "Łuk krótki"
            : n === 3
              ? "Łuk"
              : n === 4
                ? "Łuk długi"
                : n === 5
                  ? "Łuk elfów"
                  : "Kusza",
          n === 5 ? 1 : dice("bowCount", "K3", "Liczba sztuk"),
        );
        break;
      }
      case "inside:555":
        amount("gold", dice("market", "2K6", "Złoto na targowisku"));
        break;
      case "inside:666":
      case "outside:666":
        freeRecruit("debt");
        break;
      case "outside:111":
        if (
          choice("tradeStrigos", "Handel z taborytami", [
            "Handluj",
            "Odejdź",
          ]) === "Handluj"
        ) {
          flag("strigosDiscount", true, "Tabor Strigosu: 50% zniżki.");
          flag(
            "strigosTheftPending",
            true,
            "Po handlu obowiązkowy rzut na kradzież (5+).",
          );
        }
        break;
      case "outside:222": {
        if (
          !neutral &&
          choice("farm", "Postępowanie", ["Zrabuj", "Odejdź"]) === "Zrabuj"
        )
          amount("gold", dice("farmGold", "2K6", "Złoto"));
        flag("incomeLevel", -1, "Zaopatrzenie: poziom liczebności -1.");
        break;
      }
      case "outside:333":
        if (neutral)
          future("chooseEdge", "Następna potyczka: wybór krawędzi stołu.");
        else if (
          choice("pilgrims", "Postępowanie", ["Zaatakuj", "Odejdź"]) ===
          "Zaatakuj"
        ) {
          amount("gold", dice("pilgrimGold", "K6", "Złoto"));
          item("Święta relikwia");
        }
        break;
      case "outside:444": {
        const greens = /ork|goblin|kapr/.test(R.normal(army.name));
        amount(
          "gold",
          dice("orcCamp", "2K6", "Złoto w obozie") * (greens ? 3 : 1),
        );
        break;
      }
      case "outside:555":
        if (neutral)
          flag(
            "allDiscountDice",
            2,
            "Polecenie milicji: -2K6 zk od każdego zakupu.",
          );
        else {
          amount("gold", dice("militiaGold", "K6", "Złoto"));
          for (const name of ["Halabarda", "Miecz", "Pistolet"])
            item(name, dice("militia" + name, "K3", "Liczba: " + name));
          distribute("militiaXP", dice("militiaXPDice", "K6", "Pula PD"));
          fightEach(5);
        }
        break;
      case "inside:1111": {
        const n = dice("gunsmith", "K6", "Znalezisko u rusznikarza");
        const names = [
          "Garłacz",
          "Pistolet",
          "Pistolet pojedynkowy",
          "Muszkiet",
          "Krasnoludzki proch",
          "Muszkiet hochlandzki",
        ];
        item(
          names[n - 1],
          n === 2 || n === 3
            ? dice("gunCount", "K2", "Liczba sztuk")
            : n === 4 || n === 5
              ? dice("gunCount", "K3", "Liczba sztuk")
              : 1,
        );
        break;
      }
      case "inside:2222": {
        const c = choice(
          "chapel",
          "Kapliczka",
          holy
            ? [
                "Ocal relikwie",
                ...(neutral || evil || undead ? ["Ograb"] : []),
                "Odejdź",
              ]
            : ["Ograb", "Odejdź"],
        );
        if (c !== "Odejdź") amount("gold", dice("chapelGold", "3K6", "Złoto"));
        if (c === "Ocal relikwie") {
          const u = chooseHero("chapelHero");
          const weapon = chooseWeapon("chapelWeapon", u);
          effects.push({
            type: "weaponRule",
            unitId: u.uniqueId,
            weapon,
            name: "Święty oręż",
          });
        }
        break;
      }
      case "inside:3333":
        amount("gold", dice("manorGold", "3K6", "Złoto w posiadłości"));
        break;
      case "inside:4444": {
        const n = dice("armourer", "K6", "Znalezisko u płatnerza");
        let name = {
          2: "Hełm",
          3: "Lekki",
          4: "Średni",
          5: "Ciężki",
          6: "Pancerz z Gromrilu",
        }[n];
        if (n === 1) name = choice("shield", "Wybierz", ["Tarcza", "Puklerz"]);
        item(
          name,
          n === 6
            ? 1
            : dice(
                "armourCount",
                n === 3 ? "K6" : n === 5 ? "K2" : "K3",
                "Liczba sztuk",
              ),
        );
        break;
      }
      case "inside:5555":
      case "outside:222222": {
        const c = choice(
          "graves",
          "Postępowanie",
          holy ? ["Zapieczętuj", "Odejdź"] : ["Ograb", "Odejdź"],
        );
        if (c === "Ograb") {
          amount(
            "gold",
            dice(
              "graveGold",
              event.key === "5555" ? "K6X10" : "2K6X10",
              "Kosztowności",
            ),
          );
          future(
            "morrMark",
            "Piętno Morra: nienawiść wskazanych przeciwników.",
            { opponents: ["Łowcy czarownic", "Siostry Sigmara", "Duchowny"] },
          );
        } else if (c === "Zapieczętuj") {
          distribute("graveXP", dice("graveXPDice", "K6", "Pula PD"));
          if (event.area === "outside") {
            const u = chooseHero("graveHero");
            effects.push({
              type: "weaponRule",
              unitId: u.uniqueId,
              weapon: chooseWeapon("graveWeapon", u),
              name: "Druzgoczący",
            });
          }
        }
        break;
      }
      case "inside:6666":
        future(
          "scoutInside",
          "Następna potyczka wewnątrz murów: do 3 modeli z zasadą Zwiadowca.",
          { area: "inside" },
        );
        break;
      case "outside:1111":
        amount("gold", dice("wagonGold", "K6X10", "Złoto w powozie"));
        break;
      case "outside:2222": {
        const c = choice(
          "herdstone",
          "Postępowanie",
          /chaotyczna/.test(nature)
            ? ["Złóż ofiarę", "Odejdź"]
            : ["Zniszcz", "Odejdź"],
        );
        if (c === "Złóż ofiarę") {
          const sacrifices = post.units.filter(
            (u) => u.type === "Stronnik" && livingCount(u) > 0,
          );
          const target = chooseHero(
            "sacrifice",
            "Stronnik na ofiarę",
            sacrifices,
          );
          effects.push({
            type: "dead",
            unitId: target.uniqueId,
            index: target.campaignModelStatus?.findIndex((s) => !s.dead) ?? 0,
            recoverEquipment: true,
          });
          const u = chooseHero("giftHero");
          const gift = dice("chaosGift", "2K6", "Dary Chaosu");
          effects.push({
            type: "rule",
            unitId: u.uniqueId,
            name: `Dar Chaosu (${gift})`,
            text: "Trwała nagroda z tabeli Dary Chaosu, Oko Chaosu.",
          });
        } else if (c === "Zniszcz") {
          amount("loot", dice("herdLoot", "K3", "Łupy"));
          xp(commander(post), 1);
        }
        break;
      }
      case "outside:3333":
        flag("animalDiscountDice", 2, "Bydłokrad: ceny zwierząt -2K6 zk.");
        break;
      case "outside:4444":
        for (const u of eligible.filter((u) =>
          [...(u.startingEquipment || []), ...(u.optionalEquipment || [])].some(
            (n) => getEquipmentStats(n)?.range === "Walka wręcz",
          ),
        ))
          if (test("ginger" + u.uniqueId, u, 3)) xp(u, 1);
        flag("incomeLevel", -2, "Magiczne ciasto: poziom liczebności -2.");
        flag(
          "wageHalf",
          true,
          "Magiczne ciasto: połowa żołdu Najemnych Ostrzy.",
        );
        break;
      case "outside:5555":
        if (choice("wounded", "Postępowanie", ["Pomóż", "Dobij"]) === "Pomóż") {
          amount("gold", dice("woundedGold", "2K6", "Nagroda"));
          amount("loot", dice("woundedLoot", "K3", "Łupy"));
        } else {
          amount("gold", dice("woundedGold", "K6", "Zrabowane złoto"));
          distribute("woundedXP", dice("woundedXPDice", "K6", "Pula PD"));
        }
        break;
      case "outside:6666":
        if (
          post.units.some(
            (u) => R.hasRule(u, "Mag") || R.hasRule(u, "Duchowny"),
          ) &&
          choice("circle", "Odczytaj przyszłość", ["Tak", "Nie"]) === "Tak"
        ) {
          const n = dice("circleRoll", "K6", "Przepowiednia");
          future(
            "futureControl",
            n >= 2
              ? "Następna potyczka: wybierasz scenariusz, krawędź i pierwszą turę."
              : "Następna potyczka: przeciwnik wybiera scenariusz, krawędź i pierwszą turę.",
            { beneficiary: n >= 2 ? "self" : "opponent" },
          );
        }
        break;
      case "inside:11111":
        amount("gold", dice("merchantGold", "K6X10", "Złoto"));
        break;
      case "inside:22222":
        amount("gold", dice("alchemistGold", "3K6", "Złoto"));
        {
          const u = chooseHero("alchemistHero", "Czytelnik dziennika");
          effects.push({ type: "skillAccess", unitId: u.uniqueId, list: 2 });
        }
        break;
      case "inside:33333": {
        const n = dice("jeweller", "K6", "Kosztowności");
        const value =
          n <= 2
            ? dice("jewelValue", "K6X5", "Wartość")
            : n <= 4
              ? 20
              : n === 5
                ? 50
                : dice("jewelValue", "K6X15", "Wartość");
        if (
          choice("jewels", "Kosztowności", ["Sprzedaj", "Zachowaj"]) ===
          "Sprzedaj"
        )
          amount("gold", value);
        else
          item("Kosztowności jubilera", 1, {
            saleValue: value,
            availabilityBonus: 1,
          });
        break;
      }
      case "inside:44444":
        amount("gold", dice("merchantHouse", "2K6X5", "Kosztowności"));
        if (new Set(answers.merchantHouse).size === 1)
          item("Sygnet Bractwa Wolnego Handlu", 1, { grantedRule: "Handlarz" });
        break;
      case "inside:55555": {
        amount("loot", dice("burntLoot", "K3", "Łupy"));
        const u = commander(post) || chooseHero("dogLeader");
        if (test("dogTest", u, 8)) item("Pies bojowy");
        break;
      }
      case "inside:66666":
        persistent(
          "insideExplorationReroll",
          1,
          "Gildia szczurołapów: stały przerzut 1 kości wewnątrz murów.",
        );
        break;
      case "outside:11111":
        if (neutral)
          flag(
            "allDiscountDice",
            2,
            "Polecenie farmerów: -2K6 zk od każdego zakupu.",
          );
        else if (
          choice("farmLarge", "Postępowanie", ["Zrabuj", "Odejdź"]) === "Zrabuj"
        ) {
          amount("gold", dice("farmGold", "2K6", "Złoto"));
          distribute("farmXP", dice("farmXPDice", "K3", "PD"));
          fightEach(6);
        }
        flag("incomeLevel", -2, "Zaopatrzenie: poziom liczebności -2.");
        break;
      case "outside:22222":
        if (!neutral) {
          amount("gold", dice("scoutsGold", "K6", "Złoto"));
          item("Łuk krótki", dice("shortBows", "K6", "Łuki krótkie"));
          item("Sztylet", dice("scoutDaggers", "K6", "Sztylety"));
          distribute("scoutXP", dice("scoutXPDice", "K3", "PD"));
          fightEach(6);
        }
        item("Żelazne racje");
        flag("incomeLevel", -2, "Żelazne racje: poziom liczebności -2.");
        break;
      case "outside:33333":
        if (
          choice("assassinCage", "Postępowanie", ["Uwolnij", "Pozostaw"]) ===
          "Uwolnij"
        )
          freeRecruit("assassin", true, true);
        else {
          amount("gold", dice("assassinGold", "K6", "Złoto"));
          item("Psia Łapka");
        }
        break;
      case "outside:44444":
        amount("gold", dice("seerGold", "2K6", "Złoto"));
        item("Karty tarota");
        item("Luneta");
        break;
      case "outside:55555":
        if (neutral)
          future(
            "injuryRerollAll",
            "Następna sekwencja: przerzuty poważnych ran bohaterów i stronników.",
            { injuryReroll: true },
          );
        else if (
          choice("grove", "Postępowanie", ["Zbezcześć", "Odejdź"]) ===
          "Zbezcześć"
        )
          distribute("groveXP", dice("groveXPDice", "K6", "PD"));
        break;
      case "outside:66666":
        item("Miecz", dice("deadSwords", "K3", "Miecze"));
        item("Włócznia", dice("deadSpears", "K3", "Włócznie"));
        item("Tarcza", dice("deadShields", "K6", "Tarcze"));
        amount("gold", dice("deadGold", "2K6", "Złoto"));
        item("Średni");
        if (dice("deadLoot", "K6", "Dodatkowy łup") >= 5) amount("loot", 1);
        break;
      case "inside:111111":
        if (
          choice("crater", "Wysłać bohatera na zwiad?", ["Tak", "Nie"]) ===
          "Tak"
        ) {
          const u = chooseHero("craterHero");
          if (dice("craterRoll", "K6", "Zwiad") === 1)
            effects.push({ type: "dead", unitId: u.uniqueId });
          else {
            amount("loot", dice("craterLoot", "2K3", "Łupy"));
            xp(u, 1);
          }
        }
        break;
      case "inside:222222":
        amount("gold", dice("treasureGold", "5K6X5", "Złoto"));
        if (dice("gemsSaved", "K6", "Klejnoty: 3+") >= 3)
          amount("gold", dice("gemsValue", "K3X10", "Wartość klejnotów"));
        if (dice("treasureSaved", "K6", "Łupy: 3+") >= 3)
          amount("loot", dice("treasureLoot", "K3", "Liczba łupów"));
        break;
      case "inside:333333": {
        const n = dice("dwarfSmith", "K6", "Znalezisko");
        item(
          n <= 2 ? "Broń wielka" : n <= 5 ? "Ciężki" : "Pancerz z Gromrilu",
          n === 6 ? 1 : dice("dwarfCount", "K3", "Liczba sztuk"),
        );
        break;
      }
      case "inside:444444":
        amount("gold", dice("companyGold", "3K6X5", "Złoto"));
        for (const [key, name, threshold] of [
          ["light", "Lekki", 3],
          ["halberds", "Halabarda", 4],
          ["heavy", "Ciężki", 4],
        ])
          if (
            dice(key + "Survived", "K6", name + ": " + threshold + "+") >=
            threshold
          )
            item(
              name,
              key === "heavy"
                ? 1
                : dice(key + "Count", "K3", "Liczba: " + name),
            );
        break;
      case "inside:555555":
        if (
          choice("treatise", "Traktat szermierczy", [
            "Sprzedaj za 100 zk",
            "Przekaż bohaterowi",
          ]) === "Sprzedaj za 100 zk"
        )
          amount("gold", 100);
        else {
          const u = chooseHero("treatiseHero");
          effects.push({ type: "skillAccess", unitId: u.uniqueId, list: 0 });
          item("Traktat szermierczy", 1, {
            statBonus: { index: 1, amount: 1, max: 10 },
            ownerId: u.uniqueId,
            saleValue: 100,
          });
        }
        break;
      case "inside:666666":
        amount("gold", dice("mansionGold", "5K6X10", "Złoto"));
        amount("gold", dice("mansionGems", "K6X10", "Klejnoty"));
        amount("loot", dice("mansionLoot", "K6", "Łupy"));
        break;
      case "outside:111111": {
        const height = dice("nestHeight", "2K3", "Wysokość gniazda w calach"),
          eggs = dice("eggs", "K6", "Jaja");
        const u = chooseHero("nestHero", "Bohater podejmujący wspinaczkę");
        let taken = 0;
        for (let i = 0; i < eggs; i++) {
          if (
            choice("eggTry" + i, `Próba kradzieży jaja ${i + 1}`, [
              "Spróbuj",
              "Zakończ",
            ]) === "Zakończ"
          )
            break;
          const n = dice("climb" + i, "K6", "Test wspinaczki (I)");
          if (n === 6) {
            if (
              choice(
                "fallOutcome",
                "Rozstrzygnięcie upadku z " + height + " cali",
                ["Ocalał", "Wyłączony z akcji"],
              ) === "Wyłączony z akcji"
            )
              injury("nestInjury", u);
            break;
          }
          if (n === 1 || n <= R.currentStats(u)[6]) {
            taken++;
            amount("gold", dice("eggPrice" + i, "50+3K6", "Cena jaja"));
          } else if (
            choice(
              "fallOutcome" + i,
              "Rozstrzygnięcie nieudanego testu wspinaczki",
              ["Ocalał", "Wyłączony z akcji"],
            ) === "Wyłączony z akcji"
          ) {
            injury("nestFail" + i, u);
            break;
          }
        }
        flag("eggsTaken", taken, `Wykradziono ${taken} jaj.`);
        break;
      }
      case "outside:333333":
        amount("gold", dice("coachGold", "5K6X5", "Złoto"));
        amount("gold", dice("coachGems", "K3X10", "Klejnoty"));
        amount("loot", dice("coachLoot", "K3", "Łupy"));
        break;
      case "outside:444444":
        persistent(
          "outsideExplorationReroll",
          1,
          "Faktoria: stały przerzut 1 kości poza murami.",
        );
        break;
      case "outside:555555":
        if (dice("lodge", "K6", "Znalezisko") <= 4)
          item("Łuk długi", dice("lodgeBows", "K6", "Liczba łuków"));
        else {
          item("Muszkiet hochlandzki");
          item(
            "Krasnoludzki proch",
            dice("lodgePowder", "K3", "Porcje prochu"),
          );
        }
        break;
      case "outside:666666":
        for (const n of [
          "Pancerz z Gromrilu",
          "Kopia",
          "Tarcza",
          "Siodło & uprząż",
          "Kropierz",
        ])
          item(n);
        amount("loot", dice("dragonLoot", "K6", "Łupy"));
        break;
      default:
        throw Error("Nieopisane zdarzenie: " + id);
    }
  } catch (e) {
    if (!e.pending) {
      error = e.message;
      ready = false;
    }
  }
  return { inputs, effects, ready, error };
}
