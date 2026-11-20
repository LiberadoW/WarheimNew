import React,{useState} from "react";
import {render,screen,fireEvent,within} from "@testing-library/react";
import Recruitment from "./Recruitment";
import { cyrkowcy } from "../Data.js/Armies/Cyrkowcy";
import { mercenariesList } from "../Data.js/Mercenaries";
import * as R from "./rules";
import { recruit, recruitAvailability } from "./recruiting";
import { createUnit } from "../Functions/createUnit";
const army={...cyrkowcy,name:"Cyrkowcy z Ligii Ostermarku"};
function setup(extra = {}){
 const state={};
 function Harness(){const [post,setPost]=useState(()=>({...R.beginPostBattle(R.newBattle([]),[],{skarbiec:1000},army).post,
   availability:[{id:"recruit-token",name:"Wynik testowy",dice:[6,6],total:12,locked:true,used:false}], ...extra}));state.post=post;
 return <Recruitment army={army} post={post} update={fn=>setPost(old=>{const p=R.clone(old);fn(p);return p;})}/>;}
 render(<Harness/>);return state;
}
const change=(scope,label,value)=>fireEvent.change(scope.getByLabelText(label),{target:{value}});
test("warband and mercenary recruitment have separate, simultaneously visible selectors",()=>{
 setup();const band=screen.getByRole("region",{name:"Rekrutacja modeli bandy"});
 const merc=screen.getByRole("region",{name:"Rekrutacja Najemnych Ostrzy"});
 const b=within(band).getByLabelText("Model bandy"),m=within(merc).getByLabelText("Najemne Ostrze");
 expect(Array.from(b.options).slice(1).map(o=>o.value)).toEqual(Object.keys(army.heroes));
 expect(Array.from(m.options).slice(1).map(o=>o.value)).toEqual(army.mercenaries.filter(n=>mercenariesList[n]));
 expect(screen.queryByLabelText("Najemne Ostrza dostępne dla kompanii")).toBeNull();
});
test("selecting a mercenary preserves the selected warband model and each form uses its own profile",()=>{
 setup();const band=within(screen.getByRole("region",{name:"Rekrutacja modeli bandy"}));
 const merc=within(screen.getByRole("region",{name:"Rekrutacja Najemnych Ostrzy"}));
 const name=army.mercenaries.find(n=>mercenariesList[n]);
 change(band,"Model bandy","Mecenas");change(merc,"Najemne Ostrze",name);
 expect(band.getByLabelText("Model bandy").value).toBe("Mecenas");
 expect(merc.getByLabelText("Najemne Ostrze").value).toBe(name);
 expect(band.getByRole("button",{name:"Zrekrutuj model bandy"})).toBeTruthy();
 expect(merc.getByRole("button",{name:"Zatrudnij Najemne Ostrze"})).toBeTruthy();
});
test("the warband selector recruits an actual warband model and charges its cost",()=>{
 const state=setup();const band=within(screen.getByRole("region",{name:"Rekrutacja modeli bandy"}));
 change(band,"Model bandy","Mecenas");
 const availability=recruitAvailability(army,"Mecenas");
 if(availability===null){change(band,"Dostępność z opisu rekruta (0 = powszechna)","0");change(band,"Źródło / zasada dostępności","Profil testowy: powszechny");}
 fireEvent.click(band.getByRole("button",{name:"Zrekrutuj model bandy"}));
 expect(state.post.units[0].unitName).toBe("Mecenas");expect(state.post.units[0].type).toBe("Bohater");
 expect(state.post.treasury).toBe(1000-army.heroes.Mecenas.cost);
});
test("the mercenary form hires a mercenary, charges its own cost and preserves the band's selection",()=>{
 const state=setup();const band=within(screen.getByRole("region",{name:"Rekrutacja modeli bandy"}));
 const merc=within(screen.getByRole("region",{name:"Rekrutacja Najemnych Ostrzy"}));
 const name=army.mercenaries.find(n=>mercenariesList[n]);
 change(band,"Model bandy","Mecenas");change(merc,"Najemne Ostrze",name);
 const availability=recruitAvailability(army,name,true);
 if(availability===null){change(merc,"Dostępność z opisu rekruta (0 = powszechna)","0");change(merc,"Źródło / zasada dostępności","Profil testowy: powszechny");}
 if(availability>0)change(merc,"Zużyje wynik puli dostępności","recruit-token");
 fireEvent.click(merc.getByRole("button",{name:"Zatrudnij Najemne Ostrze"}));
 expect(state.post.units[0].unitName).toBe(name);expect(state.post.units[0].type).toBe("Najemne Ostrze");
 expect(state.post.treasury).toBe(1000-mercenariesList[name].cost);
 expect(band.getByLabelText("Model bandy").value).toBe("Mecenas");
});
test("consuming an availability result in one form disables it in the other",()=>{
 const state=setup();const band=within(screen.getByRole("region",{name:"Rekrutacja modeli bandy"}));
 const merc=within(screen.getByRole("region",{name:"Rekrutacja Najemnych Ostrzy"}));
 const bandName=Object.keys(army.heroes).find(n=>recruitAvailability(army,n)>0 && recruitAvailability(army,n)<=12);
 const mercName=army.mercenaries.find(n=>mercenariesList[n] && recruitAvailability(army,n,true)>0 && recruitAvailability(army,n,true)<=12);
 change(band,"Model bandy",bandName);change(merc,"Najemne Ostrze",mercName);
 change(band,"Zużyje wynik puli dostępności","recruit-token");change(merc,"Zużyje wynik puli dostępności","recruit-token");
 expect(band.getByRole("button",{name:"Zrekrutuj model bandy"}).disabled).toBe(false);
 fireEvent.click(merc.getByRole("button",{name:"Zatrudnij Najemne Ostrze"}));
 expect(state.post.availability[0].used).toBe(true);
 expect(band.getByRole("button",{name:"Zrekrutuj model bandy"}).disabled).toBe(true);
 expect(state.post.units).toHaveLength(1);
});

test("joining offers only matching groups and waits for rare equipment from the stash", () => {
  const group = createUnit(army.heroes, "Siłacz");
  group.exp = 3;
  group.optionalEquipment = ["Rapier"];
  group.equipmentList.Rapier = [10, 0];
  group.cost += 10;
  const state = setup({
    units: [group, createUnit(army.heroes, "Cyrkowiec")], recruitBudget: 7, recruitBudgetLocked: true,
    availability: [
      { id: "too-low", name: "Za niski", total: 7, locked: true, used: false },
      { id: "recruit-token", name: "Pasujący", total: 8, locked: true, used: false },
    ],
  });
  const band = within(screen.getByRole("region", { name: "Rekrutacja modeli bandy" }));
  change(band, "Model bandy", "Siłacz");
  const assignment = band.getByLabelText("Przydział stronnika");
  expect(Array.from(assignment.options).map((option) => option.value)).toEqual(["", group.uniqueId]);
  change(band, "Przydział stronnika", group.uniqueId);
  const join = band.getByRole("button", { name: "Dołącz rekruta" });
  expect(band.getByLabelText("Zużyje wynik puli dostępności").value).toBe("recruit-token");
  expect(join.disabled).toBe(true);
  expect(band.getByText(/Brak kompletu rzadkiego ekwipunku w skarbcu: Rapier/)).toBeTruthy();
  const withRapier = { ...R.clone(state.post), inventory: [{ id: "rapier", name: "Rapier", quantity: 1 }] };
  expect(() => recruit(withRapier, army, "Siłacz", { groupId: group.uniqueId, tokenId: "too-low" })).toThrow(/Brak odpowiedniego wyniku dostępności/);
  expect(state.post.treasury).toBe(1000);
});

test("a rare model consumes one result per recruit and undo returns it with the gold, PD and stash item", () => {
  const group = createUnit(army.heroes, "Siłacz");
  group.exp = 3;
  group.optionalEquipment = ["Rapier"];
  group.equipmentList.Rapier = [10, 0];
  group.cost += 10;
  const rapier = { id: "stash-rapier", name: "Rapier", quantity: 2, basePrice: 10 };
  const state = setup({ units: [group], recruitBudget: 7, recruitBudgetLocked: true, inventory: [rapier] });
  const band = within(screen.getByRole("region", { name: "Rekrutacja modeli bandy" }));
  change(band, "Model bandy", "Siłacz");
  change(band, "Przydział stronnika", group.uniqueId);
  const join = band.getByRole("button", { name: "Dołącz rekruta" });
  const rejected = R.clone(state.post);
  expect(() => recruit(rejected, army, "Siłacz", { groupId: group.uniqueId })).toThrow(/Brak odpowiedniego wyniku dostępności/);
  expect(rejected).toEqual(state.post);
  expect(join.disabled).toBe(false);
  fireEvent.click(join);
  expect(state.post.availability[0].used).toBe(true);
  expect(state.post.units).toHaveLength(1);
  expect(state.post.units[0]).toMatchObject({ selectedNumber: 2, exp: 3, optionalEquipment: ["Rapier"], campaignNewRecruit: true });
  expect(state.post.treasury).toBe(1000 - army.heroes.Siłacz.cost - 6);
  expect(state.post.recruitBudget).toBe(4);
  expect(state.post.inventory[0].quantity).toBe(1);
  expect(join.disabled).toBe(true);
  fireEvent.click(band.getByRole("button", { name: "Cofnij" }));
  expect(state.post.units[0].selectedNumber).toBe(1);
  expect(state.post.units[0].campaignNewRecruit).toBeUndefined();
  expect(state.post.treasury).toBe(1000);
  expect(state.post.recruitBudget).toBe(7);
  expect(state.post.inventory).toEqual([rapier]);
  expect(state.post.availability[0].used).toBe(false);
  expect(join.disabled).toBe(false);
});
