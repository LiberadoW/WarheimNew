import React, {useState} from "react";
import {render,screen,fireEvent,within,cleanup} from "@testing-library/react";
import Trade from "./Trade";
import * as R from "./rules";
const unit = {uniqueId:"h",unitName:"Herszt",type:"Bohater",selectedNumber:1,cost:55,exp:20,rules:[],
  equipmentList:{Miecz:[10,0],Sztylet:[2,0]},startingEquipment:["Sztylet"],optionalEquipment:[],
  stats:{Początkowa:[4,4,4,3,3,2,4,1,8],Maksymalna:[5,6,6,4,4,3,6,4,9]}};
const army={name:"Gang przemytników",heroes:{Herszt:unit}};
const click=name=>fireEvent.click(screen.getByRole("button",{name,exact:true}));
const change=(name,value)=>fireEvent.change(screen.getByLabelText(name),{target:{value}});
function setup(extra={},gold=100,more=[],postExtra={}){
  let snapshot=R.beginPostBattle({...R.newBattle([]),gameName:"Zakupy"},[{...R.clone(unit),...extra},...more],{skarbiec:gold},army).post;
  snapshot={...snapshot,...postExtra};
  const state={};
  function Harness(){const [post,setPost]=useState(snapshot);state.post=post;
    return <Trade post={post} army={army} update={fn=>setPost(p=>{const n=R.clone(p);fn(n);snapshot=n;return n;})} />;}
  let view=render(<Harness/>);
  return {state,resume:()=>{view.unmount();view=render(<Harness/>);}};
}
afterEach(cleanup);
test("a common item needs one purchase confirmation and is charged once",()=>{
  const {state}=setup();change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");
  const buy=screen.getByRole("button",{name:"Kup za 10 zk"});fireEvent.click(buy);fireEvent.click(buy);
  expect(state.post.treasury).toBe(90);expect(state.post.units[0].optionalEquipment).toContain("Miecz");
  expect(screen.getByRole("status").textContent).toMatch(/Zakupiono: Miecz/);
  expect(screen.queryByRole("button",{name:"Kup za 10 zk"})).toBeNull();
});
test("a group purchases a complete set and displays its full cost",()=>{
  const {state}=setup({type:"Stronnik",selectedNumber:3});change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");
  click("Kup za 30 zk");expect(state.post.treasury).toBe(70);
});
test("an unaffordable item explains the missing gold and cannot be purchased",()=>{
  const {state}=setup({},5);change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");
  expect(screen.getByRole("button",{name:"Kup za 10 zk"}).disabled).toBe(true);
  expect(screen.getByText("Brakuje 5 zk do zakupu.")).toBeTruthy();expect(state.post.treasury).toBe(5);
});
test("a rare variable-price item keeps recipient and dice after resume, then consumes one availability result",()=>{
  const {state,resume}=setup();change("Postać","inventory");
  change("Szukaj przedmiotu","Krasnoludzki proch");click("Wybierz: Krasnoludzki proch");
  click("Utwórz pulę (1 bohaterów)");
  for(const i of [1,2])change(`Dostępność: Herszt, kość ${i}`,"6");
  click("Zatwierdź wynik");
  change("Cena: Krasnoludzki proch, kość 1","3");change("Cena: Krasnoludzki proch, kość 2","4");
  expect(screen.getByRole("button",{name:"Kup za 12 zk"}).disabled).toBe(false);
  resume();expect(screen.getByLabelText("Postać").value).toBe("inventory");
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 1").value).toBe("3");
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 1").disabled).toBe(true);
  click("Kup za 12 zk");expect(state.post.treasury).toBe(88);expect(state.post.availability[0].used).toBe(true);
  expect(state.post.inventory.find(i=>i.name==="Krasnoludzki proch").quantity).toBe(1);
});
test("opening an item again cannot generate a different price",()=>{
  const {state}=setup();change("Postać","inventory");change("Szukaj przedmiotu","Krasnoludzki proch");
  click("Wybierz: Krasnoludzki proch");
  const group=within(screen.getByRole("group",{name:"Cena: Krasnoludzki proch · 2K6"}));fireEvent.click(group.getByRole("button",{name:"Rzuć"}));
  const dice=group.getAllByRole("spinbutton").map(i=>i.value);
  click("← Wróć do przedmiotów");change("Szukaj przedmiotu","Miecz");change("Szukaj przedmiotu","Krasnoludzki proch");
  click("Wybierz: Krasnoludzki proch");
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 1").value).toBe(dice[0]);
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 2").value).toBe(dice[1]);
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 1").disabled).toBe(true);
  expect(state.post.treasury).toBe(100);
});
test("the normal catalog hides equipment outside the recipient's list",()=>{
  setup();change("Szukaj przedmiotu","Łuk długi");
  expect(screen.queryByRole("button",{name:"Wybierz: Łuk długi"})).toBeNull();
  fireEvent.click(screen.getByText("Opcje listy i pula dostępności",{selector:"summary"}));fireEvent.click(screen.getByLabelText("Pokaż również niedozwolone dla postaci"));
  click("Wybierz: Łuk długi");expect(screen.queryByRole("button",{name:/Kup za/})).toBeNull();
});

test("resuming a selected purchase keeps the second recipient instead of equipping the first hero",()=>{
  const second={...R.clone(unit),uniqueId:"h2",unitName:"Sieciarz"};
  const {state,resume}=setup({},100,[second]);
  change("Postać","h2");change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");resume();
  expect(screen.getByLabelText("Postać").value).toBe("h2");click("Kup za 10 zk");
  expect(state.post.units[0].optionalEquipment).not.toContain("Miecz");
  expect(state.post.units[1].optionalEquipment).toContain("Miecz");
});

test("Obrotność requires selecting a target before rolling and cannot reset its roll by switching targets",()=>{
  const token=id=>({id,unitId:id,name:id,dice:[6,6],total:12,modifier:0,reason:"",locked:true,used:false});
  const {state}=setup({},100,[],{armyRules:["Obrotność"],availability:[token("a"),token("b")]});
  fireEvent.click(screen.getByText("Opcje listy i pula dostępności",{selector:"summary"}));
  const scope=within(screen.getByRole("group",{name:"Obrotność: nowy wynik dostępności · 2K6"}));
  expect(scope.getByRole("button",{name:"Rzuć"}).disabled).toBe(true);
  change("Wynik do modyfikacji zasadą kompanii","a");
  fireEvent.click(scope.getByRole("button",{name:"Rzuć"}));
  expect(screen.getByLabelText("Wynik do modyfikacji zasadą kompanii").disabled).toBe(true);
  click("Zastosuj przerzut dostępności");expect(state.post.availabilityRerolled).toBe(true);
  expect(screen.queryByLabelText("Obrotność: nowy wynik dostępności, kość 1")).toBeNull();
});

test("the step 9 shop lists only common items", () => {
  const { render: r, screen: sc } = require("@testing-library/react");
  const Trade = require("./Trade").default;
  const { catalog } = require("./rules");
  const unit = { uniqueId: "h", unitName: "Herszt", type: "Bohater", selectedNumber: 1, rules: [],
    startingEquipment: [], optionalEquipment: [], equipmentList: {}, campaignModelStatus: [{}] };
  r(<Trade post={{ units: [unit], treasury: 100, inventory: [], journal: [], availability: null }} update={() => {}}
    army={{ name: "" }} commonOnly />);
  sc.getByLabelText("Pokaż również niedozwolone dla postaci").click();
  const rare = catalog.find((i) => i.availability);
  expect(sc.queryByRole("button", { name: `Wybierz: ${rare.name}` })).toBeNull();
  expect(sc.getByText("Ekwipunek powszechny")).toBeTruthy();
});

test("five henchmen each pay a separate tax, with partial rolls preserved after resume",()=>{
  const {state,resume}=setup({type:"Stronnik",selectedNumber:5},100,[],{armyRules:["Podatek"]});
  change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");
  const label=i=>`Podatek — sztuka ${i} z 5 (cena podstawowa 10 zk): +1K6, kość 1`;
  expect(screen.getAllByRole("spinbutton")).toHaveLength(5);
  change(label(1),"1");change(label(2),"2");
  expect(screen.getByRole("button",{name:"Kup przedmiot"}).disabled).toBe(true);
  resume();expect(screen.getByLabelText(label(1)).value).toBe("1");
  expect(screen.getByLabelText(label(1)).disabled).toBe(true);
  for(const i of [3,4,5])change(label(i),String(i));
  click("Kup za 65 zk");expect(state.post.treasury).toBe(35);
  const quote=Object.values(state.post.quotes)[0];
  expect(quote.unitPrices).toEqual([11,12,13,14,15]);
  expect(quote.taxRolls).toEqual([[1],[2],[3],[4],[5]]);
  expect(state.post.journal.find(x=>x.type==="purchase").total).toBe(65);
});
test("each member rolls both tax dice for a base price over 20 gold",()=>{
  const {state}=setup({type:"Stronnik",selectedNumber:3,equipmentList:{Kusza:[25,1]}},100,[],{armyRules:["Podatek"]});
  change("Szukaj przedmiotu","Kusza");click("Wybierz: Kusza");
  expect(screen.getAllByRole("spinbutton")).toHaveLength(6);
  for(let i=1;i<=3;i++)for(let j=1;j<=2;j++)change(`Podatek — sztuka ${i} z 3 (cena podstawowa 25 zk): +2K6, kość ${j}`,String((i-1)*2+j));
  click("Kup za 96 zk");expect(state.post.treasury).toBe(4);
  expect(Object.values(state.post.quotes)[0].unitPrices).toEqual([28,32,36]);
});
test("the group tax and purchase cover living models only",()=>{
  const {state}=setup({type:"Stronnik",selectedNumber:5,campaignModelStatus:[{dead:true},{},{},{dead:true},{}]},100,[],{armyRules:["Podatek"]});
  change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");
  expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
  for(let i=1;i<=3;i++)change(`Podatek — sztuka ${i} z 3 (cena podstawowa 10 zk): +1K6, kość 1`,String(i));
  click("Kup za 36 zk");expect(state.post.treasury).toBe(64);
});
test("an older shared group tax becomes the first item's roll, without duplicating or discarding it",()=>{
  const item=R.catalog.find(i=>i.name==="Miecz");
  const key=`${item.id}:h`;
  const old={id:"old",itemId:item.id,price:16,dice:[],discountRoll:[],taxRoll:[6],basePrice:10,used:false};
  const {state}=setup({type:"Stronnik",selectedNumber:3},100,[],{armyRules:["Podatek"],quotes:{[key]:old}});
  change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");
  const label=i=>`Podatek — sztuka ${i} z 3 (cena podstawowa 10 zk): +1K6, kość 1`;
  expect(screen.getByLabelText(label(1)).value).toBe("6");expect(screen.getByLabelText(label(1)).disabled).toBe(true);
  expect(screen.getByRole("button",{name:"Kup przedmiot"}).disabled).toBe(true);
  change(label(2),"1");change(label(3),"2");click("Kup za 39 zk");
  expect(state.post.treasury).toBe(61);expect(state.post.quotes[key].unitPrices).toEqual([16,11,12]);
});
test("the purchase rule rejects an obsolete shared tax quote before charging the group",()=>{
  const {state}=setup({type:"Stronnik",selectedNumber:3},100,[],{armyRules:["Podatek"]});
  const item=R.catalog.find(i=>i.name==="Miecz");
  expect(()=>R.buyItem(state.post,"h",item,{id:"old",itemId:item.id,price:16,taxRoll:[6]},army.name)).toThrow(/osobny rzut/);
  expect(state.post.treasury).toBe(100);
});
