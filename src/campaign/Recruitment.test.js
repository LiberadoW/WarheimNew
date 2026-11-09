import React,{useState} from "react";
import {render,screen,fireEvent,within} from "@testing-library/react";
import Recruitment from "./Recruitment";
import { cyrkowcy } from "../Data.js/Armies/Cyrkowcy";
import { mercenariesList } from "../Data.js/Mercenaries";
import * as R from "./rules";
import { recruitAvailability } from "./recruiting";
const army={...cyrkowcy,name:"Cyrkowcy z Ligii Ostermarku"};
function setup(){
 const state={};
 function Harness(){const [post,setPost]=useState(()=>({...R.beginPostBattle(R.newBattle([]),[],{skarbiec:1000},army).post,
   availability:[{id:"recruit-token",name:"Wynik testowy",dice:[6,6],total:12,locked:true,used:false}]}));state.post=post;
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
 if(availability>0)change(merc,"Wynik puli dostępności","recruit-token");
 fireEvent.click(merc.getByRole("button",{name:"Zatrudnij Najemne Ostrze"}));
 expect(state.post.units[0].unitName).toBe(name);expect(state.post.units[0].type).toBe("Najemne Ostrze");
 expect(state.post.treasury).toBe(1000-mercenariesList[name].cost);
 expect(band.getByLabelText("Model bandy").value).toBe("Mecenas");
});
