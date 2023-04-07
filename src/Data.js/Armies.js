import { łowcyCzarownic } from "./Armies/Łowcy Czarownic";
import { cyrkowcy } from "./Armies/Cyrkowcy";
import { muszkieterzyNuln } from "./Armies/MuszkieterzyNuln";
import { marienburg } from "./Armies/Marienburg";
import { averland } from "./Armies/Averland";
import { ostland } from "./Armies/Ostland";
import { middenheim } from "./Armies/Middenheim";
import { gladiatorzy } from "./Armies/Gladiatorzy";
import { siostry } from "./Armies/SiostrySigmara";
import { leśne } from "./Armies/LeśneElfy";
import { wysokie } from "./Armies/WysokieElfy";
import { khazadzi } from "./Armies/KhazadziZGór";
import { vonCarstein } from "./Armies/vonCarstein";
import { graal } from "./Armies/RycerzeGraala";
import { kislev } from "./Armies/Kislev";
import { piraci } from "./Armies/Piraci";
import { psyWojny } from "./Armies/PsyWojny";
import { raubritterzy } from "./Armies/Raubritterzy";
import { arabia } from "./Armies/Arabia";
import { amazonki } from "./Armies/Amazonki";
import { nizolki } from "./Armies/Nizolki";
import { pogromcy } from "./Armies/Pogromcy";
import { piwowarzy } from "./Armies/Piwowarzy";
import { szkutnicy } from "./Armies/Szkutnicy";
import { krasnoludyChaosu } from "./Armies/KrasnoludyChaosu";
import { jeźdzcyWilków } from "./Armies/JeźdzcyWilków";
import { ogry } from "./Armies/Ogry";
import { duchChaosu } from "./Armies/DuchChaosu";
import { karmazynowaCzaszka } from "./Armies/KarmazynowaCzaszka";
import { dzieciZagłady } from "./Armies/DzieciZagłady";
import { purpurowaDłoń } from "./Armies/PurpurowaDłoń";
import { grasanciChaosu } from "./Armies/Grasanci";
import { karnawałChaosu } from "./Armies/Karnawał";
import { zwierzoludzie } from "./Armies/Zwierzoludzie";
import { lahmia } from "./Armies/Lahmia";
import { krwaweSmoki } from "./Armies/krwaweSmoki";
import { nekrarcha } from "./Armies/Nekrarcha";
import { strigos } from "./Armies/Strigos";
import { mroczne } from "./Armies/MroczneElfy";
import { eshin } from "./Armies/Eshin";
import { moulder } from "./Armies/Moulder";
import { pestilens } from "./Armies/Pestilens";
import { skryre } from "./Armies/Skryre";
import { nehekhara } from "./Armies/Nehekhara";
import { mors } from "./Armies/Mors";
import { dzikieOrki } from "./Armies/DzikieOrki";
import { leśneGobliny } from "./Armies/LeśneGobliny";
import { orki } from "./Armies/Orkowie";
import { kapry } from "./Armies/Kapry";
import { jaszczuroludzie } from "./Armies/Jaszczuroludzie";
import { liczmistrz } from "./Armies/Liczmistrz";
import {reikland} from "./Armies/Reikland"

const armies = {
  "Łowcy Czarownic": łowcyCzarownic,
  "Cyrkowcy z Ligii Ostermarku": cyrkowcy,
  "Muszkieterzy z Nuln": muszkieterzyNuln,
  "Piechota Morska z Marienburga": marienburg,
  "Strażnicy dróg z Averlandu": averland,
  "Zbrojna kompania z Ostlandu": ostland,
  "Zbrojni z Middenheim": middenheim,
  "Rycerze Graala": graal,
  "Zbrojna chorągiew z Kisleva": kislev,
  "Piraci z Sartosy": piraci,
  "Psy Wojny": psyWojny,
  "Raubritterzy z Księstw Granicznych": raubritterzy,
  "Kupiecka karawana z Arabii": arabia,
  "Amazonki z Lustrii": amazonki,
  "Gladiatorzy z Jałowej Krainy": gladiatorzy,
  "Siostry Sigmara": siostry,
  "Niziołki z Krainy Zgromadzenia": nizolki,
  "Leśni Elfowie z Athel Loren": leśne,
  "Elfowie Wysokiego Rodu z Ulthuan": wysokie,
  "Mroczni Elfowie z Naggaroth": mroczne,
  "Khazadzi z Gór Krańca Świata": khazadzi,
  "Kompania Krasnoludzkich Piwowarów": piwowarzy,
  "Kult Pogromców z Karak Kadrin": pogromcy,
  "Szkutnicy z Barak Varr": szkutnicy,
  "Krasnoludowie Chaosu z Zorn Uzkul": krasnoludyChaosu,
  "Jeźdzcy Wilków": jeźdzcyWilków,
  "Zwiadowcza kompania z Królestw Ogrów": ogry,
  "Kult Ducha Chaosu": duchChaosu,
  "Kult Karmazynowej Czaszki": karmazynowaCzaszka,
  "Kult Dzieci Zagłady": dzieciZagłady,
  "Kult Purpurowej Dłoni": purpurowaDłoń,
  "Grasanci Chaosu": grasanciChaosu,
  "Karnawał Chaosu": karnawałChaosu,
  "Zbrojne stado Zwierzoludzi": zwierzoludzie,
  "Nieumarła świta Hrabiego Von Carstein": vonCarstein,
  "Nieumarły orszak księżnej Lahmi": lahmia,
  "Nieumarły poczet Krwawych Smoków": krwaweSmoki,
  "Nieumarły sabat rodu Nekrarch": nekrarcha,
  "Nieumarły tabor ludu Strigosu": strigos,
  "Nieumarły zastęp z Nehekhary": nehekhara,
  "Zwiadowcze stado klanu Eshin": eshin,
  "Poganiacze klanu Moulder": moulder,
  "Kult Zarazy klanu Pestilens": pestilens,
  "Harcownicy klanu Skryre": skryre,
  "Zbrojne stado klanu Mors": mors,
  "Łowcze plemię Dzikich Orków": dzikieOrki,
  "Plemię Leśnych Goblinów": leśneGobliny,
  "Orkowie & Gobliny": orki,
  "Załoga Zielonoskórych Kaprów": kapry,
  "Jaszczuroludzie z Lustrii": jaszczuroludzie,
  "Nieumarła horda Liczmistrza": liczmistrz,
  "Żołnierze z Reiklandu": reikland 
};

export default armies;
