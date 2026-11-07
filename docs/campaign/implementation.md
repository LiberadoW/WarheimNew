# Campaign play

Source: the owner's Warheim FS rulebook AD2026.04.15. The PDF itself is not committed. Unit/equipment dialogs and the initial campaign workflow were merged to master in PRs #7 and #8.

## Campaign workflow

- Battles record date, opponent, scenario, area, result, attendance, model casualties, kills and additional scenario PD. Old war wound tests are available before play. Obłęd and up to three Mroczne Pakty per company can be recorded during play.
- During play, the first campaign step lists every unit with kills, scenario PD and per-model WzA/absence toggles (the same fields as each unit's "Bitwa" tab).
- Żółtodzioby (p. 414): the opponent's prestige is entered before the sequence; the difference grants the table's PD to each participating hero/group, the gold roll (required before leaving the experience step) and the listed company rules for that sequence only. The summary shows prestige before and after (excluding dead, captured and resting models).
- If the leader dies, step 1 requires naming the successor: highest CP, then PD; a full tie is settled by a die roll (undead companies list their eligible casters). The successor gains DOWÓDCA.
- Step 9 has a common-items shop for new recruits (rare items stay in step 7; skipped after a Strigos caravan trade).
- The eleven post-battle phases follow chapter 13. The live roster stays separate from a scoped local draft until finalization. Failed cloud saves retain that draft. Firestore finalization checks the battle ID and newer campaign history to avoid duplicate or stale writes.
- Injury tables support K66 heroes/Drama and the appropriate K6 creature/henchman/mercenary tables, with follow-up rolls. Death removes individual models at finalization. Ordinary casualties return equipment to storage; mercenary/Drama casualties lose it. Dead Drama cannot be rehired in the campaign.
- PD, caps, advancement thresholds, two-roll hero choices, single-roll mercenary choices, henchman stat restrictions, promotion, general/faction/personal character skill lists and spells are supported. Mercenaries use 2/5/9/14 PD thresholds, the hero development table and no duplicate characteristic advance. Late exploration/injury PD creates additional advancement tasks.
- All 51 company advancement choices from page 417 are selectable at newly crossed thresholds. Choices persist with their source descriptions. Connected effects include Horda, Zbrojny po zemby, Chciwość, Pazerność, Konsyliarze, Rządcy, Samowystarczalni, Weteran, availability/chemical bonuses, Obrotność, Kompania najemników and eligible Nieśmiertelni replacements. Other scenario/tabletop effects remain visible as rules to apply during play.
- Both exploration tables contain 30 encounters. Deterministic recipes request the dice, decisions, model selections and PD allocations before applying resource changes. The greatest repeated group is mandatory; the higher face breaks ties. Original dice, rerolls and decisions are retained. Extra dice/discards and external modifiers require a named source. Applicable future effects carry into the matching subsequent battle; area-specific effects wait for that area.
- Loot sale uses the income/supply table once per sequence, excluding hired characters from maintenance. Recruitment uses source availability when matched, actual model limits and the company's mercenary list. Unmatched profiles require an explicit source for their availability. Existing henchman groups can accept experienced recruits using the PD budget and full equipment cost.
- The chapter 14 catalog has 505 items/variants with categories, prices, availability and descriptions. Variable prices and discount dice are locked in quotes. Rare items consume an available result. Personal equipment lists and supported exceptions filter purchases. Contacts and chemical bonuses can be assigned to one availability result; Obrotność rerolls one result. Strigos trade applies its discount and requires the concluding theft roll before leaving that phase.
- All 45 Drama profiles are imported. Hiring requires one successful CP search by an eligible commander, a free hero slot, payment and confirmation of the profile's special prerequisites. Wage recipes cover every character and K6 branch. Required items, loot, sacrifices and departures update the draft. Particular tabletop consequences have explicit outcome/confirmation fields; terminating a contract also requires recording those consequences.
- Runic/mechanical crafting has 96 imported recipes, with costs, availability and descriptions. Craftsmen must be assigned before exploration and forfeit their die. The app checks eligible bases, attempt/item limits and combinations, then resolves creation and failure tables. A physical hit from an accident is resolved on the tabletop and its outcome/injury is entered. Upgrades persist through stash transfers and are shown with the equipment description.
- Optional Chaos mutation support includes all five K66 tables (120 entries), repeat prevention, mutation limits/WT tests, direct characteristic changes and the source Chaos Spawn profile. Conditional combat effects remain in the rule description. Obłęd thresholds create required mental illness rolls; all 36 illness descriptions are available.
- Stash transfer, item consumption, justified characteristic/rule adjustments, loss of rules, capture/absence adjustments, contract termination and an audited resource adjustment are available for conditional effects.

Numeric fields allow an empty editing draft while retaining the last valid campaign value. Leaving a field empty restores that value; existing minimum/maximum constraints remain in force.

## Rules requiring player resolution

This is a campaign assistant, not a complete simulator of all rulebook interactions.

- A player's physical battle actions, random model selection, model bases and positions, linked companions/vehicles, special hiring items/conditions and bespoke combats cannot all be inferred from existing saved rosters. The relevant source is displayed; the player enters outcomes and confirms special consequences. Sacrifice eligibility still needs the source's base/size restrictions checked by the player.
- Conditional skill, weapon, rune, mechanical and illness effects are recorded as readable rules. They are not universally folded into the displayed characteristics. Chronic mental illness progression/recovery, amnesia's random losses and some unusual mutation interactions require the justified adjustment controls.
- Undead dissolution, inheritance of a caster's duties, scenario rewards, Chaos Gifts, unusual recruitment exceptions, and splitting/merging existing henchman groups still require manual resolution. This change does not claim to automate every exception in the full rulebook.
- Equipment permission checks remain conservative. Prose restrictions and interactions need player review. Identically named weapon instances in legacy rosters have no distinct item IDs, so upgrades are associated with the owner's base-item name.
- The source overlaps wage result 2 for Festus and Ruben. The owner explicitly chose the payment/sacrifice interpretation: departure on 1, payment/sacrifice on 2–4. This is a recorded campaign interpretation, not an unannounced correction to the PDF.

## Validation

672 automated tests pass. Automated coverage includes the end-to-end campaign finalization/failure retry flow, all 60 exploration recipe entry paths, all 270 Drama character/K6 wage branches, advancement rules, company choices, crafting success/failure and stash transfer, recruitment, discounts/theft, optional tables and persistence boundaries. Run `CI=true npm test -- --watchAll=false --runInBand` and `npm run build`.

The production build has existing lint/bundle-size warnings. Authenticated Firestore integration was not exercised against live user data. The deployed Netlify preview was exercised in a cloud browser as a guest: weapon descriptions, battle creation, PD, exploration, loot sale, a rare variable-price purchase, a Drama search, finalization and history creation worked. That check revealed an overflowing campaign panel, corrected with an explicit responsive width and wrapping phase navigation. Follow-up browser verification used the real app in a 390 px iframe viewport: clearing/retyping numeric values, mobile XP cards, compact stage selection, stat adjustments, scroll/focus after Next, and the locked exploration roll after page reload were checked. Pending local-only dice (prices, searches, crafting, wage refusal and mutations) now live in the persisted battle draft. Each app roll locks both its button and dice inputs; rules-based rerolls use separate single-use inputs. Desktop layout retains the table and phase navigation. This is a browser viewport check, not a test on physical Android hardware.

## Storage

No Firestore migration is required. Campaign state is under `campaignNotes.campaign`; legacy saved lists and `gameHistory` remain loadable. Local drafts use `warheim:draft:<uid|guest>` and are not a server backup. Firestore's per-document size limit remains; long histories should eventually move to subcollections.

## Rebuild source data

Requires PyMuPDF and the owner's PDF:

```
python scripts/import-campaign-rulebook.py /path/to/rulebook.pdf
python scripts/import-company-advances.py /path/to/rulebook.pdf
python scripts/import-campaign-characters.py /path/to/rulebook.pdf
python scripts/import-campaign-extras.py /path/to/rulebook.pdf
```

Review imported text against the same edition before changing source counts or exception handling.


Follow-up sequence and shop QA: [2026-11-07 report](qa-2026-11-07.md). Purchases now use a compact catalog and a single-item transaction panel; availability, pending price rolls, selected recipient and item survive resume. Common items are bought with one confirmation, with totals calculated for the whole group.
