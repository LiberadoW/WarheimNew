// Temporary preview-only fixture; removed before merging.
import React,{useEffect,useRef,useState} from "react";
import Trade from "./Trade";
import Recruitment from "./Recruitment";
import * as R from "./rules";
import { cyrkowcy } from "../Data.js/Armies/Cyrkowcy";
import { createUnit } from "../Functions/createUnit";
import "./Campaign.css";
const army={...cyrkowcy,name:"Cyrkowcy z Ligii Ostermarku"};
const storageKey="warheim:qa:group-tax";
const initial=()=>{
 try {const p=JSON.parse(localStorage.getItem(storageKey));if(p?.units)return p;}catch{}
 const unit=createUnit(army.heroes,"Cyrkowiec");unit.unitName="Hobgoblin";unit.selectedNumber=5;
 unit.equipmentList={...unit.equipmentList,"Topór bojowy":[5,0],Miecz:[10,0]};
 const p=R.beginPostBattle(R.newBattle([unit]),[unit],{skarbiec:1000},army).post;
 p.armyRules=["Podatek"];p.availability=[{id:"a",name:"Bohater",dice:[6,6],total:12,locked:true,used:false}];return p;
};
export default function GroupTaxQA(){
 const [post,setPost]=useState(initial),[tab,setTab]=useState("trade"),[error,setError]=useState("");
 const ref=useRef(post);ref.current=post;
 useEffect(()=>localStorage.setItem(storageKey,JSON.stringify(post)),[post]);
 const update=fn=>{try{const p=R.clone(ref.current);fn(p);ref.current=p;setPost(p);setError("");}catch(e){setError(e.message);}};
 return <section className="campaign"><h2>Kontrola podatku i rekrutacji</h2>
 <div className="campaign-row"><button className="button" onClick={()=>setTab("trade")}>Test handlu</button><button className="button" onClick={()=>setTab("recruit")}>Test rekrutacji</button></div>
 {error&&<p role="alert">{error}</p>}
 {tab==="trade"?<Trade post={post} update={update} army={army}/>:<Recruitment post={post} update={update} army={army}/>}
 </section>;
}
