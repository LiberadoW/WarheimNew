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
  const {state,resume}=setup();change("Odbiorca zakupów","inventory");
  change("Szukaj przedmiotu","Krasnoludzki proch");click("Wybierz: Krasnoludzki proch");
  click("Utwórz pulę (1 bohaterów)");
  for(const i of [1,2])change(`Dostępność: Herszt, kość ${i}`,"6");
  click("Zatwierdź wynik");
  change("Cena: Krasnoludzki proch, kość 1","3");change("Cena: Krasnoludzki proch, kość 2","4");
  expect(screen.getByRole("button",{name:"Kup za 12 zk"}).disabled).toBe(false);
  resume();expect(screen.getByLabelText("Odbiorca zakupów").value).toBe("inventory");
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 1").value).toBe("3");
  expect(screen.getByLabelText("Cena: Krasnoludzki proch, kość 1").disabled).toBe(true);
  click("Kup za 12 zk");expect(state.post.treasury).toBe(88);expect(state.post.availability[0].used).toBe(true);
  expect(state.post.inventory.find(i=>i.name==="Krasnoludzki proch").quantity).toBe(1);
});
test("opening an item again cannot generate a different price",()=>{
  const {state}=setup();change("Odbiorca zakupów","inventory");change("Szukaj przedmiotu","Krasnoludzki proch");
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
  change("Odbiorca zakupów","h2");change("Szukaj przedmiotu","Miecz");click("Wybierz: Miecz");resume();
  expect(screen.getByLabelText("Odbiorca zakupów").value).toBe("h2");click("Kup za 10 zk");
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
