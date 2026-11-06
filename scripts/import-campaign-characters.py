"""Import named characters, mercenaries and recruitment availability from the owner's PDF."""
import fitz,re,json,sys
from pathlib import Path
pdf=fitz.open(sys.argv[1]);root=Path(__file__).resolve().parents[1]
head=r'(?m)^([^\n:]+?)\s*:\s*\nLICZBA MODELI W DRUŻYNIE:'
def sections(start,end):
 s='\n'.join(pdf[n-1].get_text() for n in range(start,end+1));matches=[m for m in re.finditer(head,s) if m.group(1).strip().isupper()]
 return [(m.group(1).strip().capitalize(),s[m.start():matches[i+1].start() if i+1<len(matches) else len(s)]) for i,m in enumerate(matches)]
def numbers(s,label):
 m=re.search(label+r'\s+((?:[\d*–−-]+\s+){8}[\d*–−-]+)',s)
 return [int(x) if x.isdigit() else '-' for x in m.group(1).split()] if m else []
def profile(name,s):
 header=' '.join(s[:s.find('PODSTAWKA:')].split())
 cost=re.search(r'KOSZT REKRUTACJI:\s*(\d+)\s*zk',header)
 wage=re.search(r'ŻOŁD:\s*([^P]+?)(?:PRESTIŻ|PODSTAWKA)',header)
 prestige=re.search(r'PRESTIŻ DRUŻYNY:\s*\+?(\d+)',header)
 initial=numbers(s,'Początkowa');maximum=numbers(s,'Maksymalna')
 if not initial:
  print('Reference-only companion:',name);return None
 rules=re.search(r'ZASADY SPECJALNE:\s*([^:]+?)(?:\.|\n[A-ZĄĆĘŁŃÓŚŹŻ][A-ZĄĆĘŁŃÓŚŹŻ ]+:)',s,re.S)
 rulesList=re.split(r',\s*(?![^()]*\))',' '.join(rules.group(1).split())) if rules else []
 gear=re.search(r'BROŃ/PANCERZ:\s*(.*?)(?:ZASADY SPECJALNE:)',s,re.S)
 lore=s[s.find('UWAGI:'):s.find('CHARAKTERYSTYKA')]
 extra=re.search(r'może nauczyć się jednej z wymienionych poniżej zasad specjalnych (.+?)(?:\. |\.$)',' '.join(lore.split()),re.S)
 specialSkills=re.split(r'\s+(?:lub|oraz)\s+(?![^()]*\))',' '.join(extra[1].split())) if extra else []
 skills=[i for i,key in enumerate(['WALKI','STRZELECKICH','AKADEMICKICH','SIŁOWYCH','SZYBKOŚCIOWYCH']) if key in lore]
 return {'name':name,'requirements':' '.join(lore.split()),'wageText':' '.join(s[s.rfind('ŻOŁD:'):].split()),'cost':int(cost.group(1)) if cost else None,'wage':wage.group(1).strip() if wage else 'SPECJALNE','prestige':int(prestige.group(1)) if prestige else 0,'stats':{'Początkowa':initial,'Maksymalna':maximum or initial},'rules':[r[0]+r[1:].lower() for r in rulesList if r],'skills':skills+([5] if specialSkills else []),'specialSkills':[n[0]+n[1:].lower() for n in specialSkills if n],'gearText':' '.join(gear.group(1).split()) if gear else '', 'text':' '.join(s.split())}
drama=[p for n,s in sections(497,521) if (p:=profile(n,s))]
merc=[p for n,s in sections(485,495) if (p:=profile(n,s))]
for p in merc:
 m=re.search(r'DOSTĘPNOŚĆ:\s*(\d+)',' '.join(p['text'].split()))
 p['availability']=int(m.group(1)) if m else None
(root/'src/campaign/drama.json').write_text(json.dumps(drama,ensure_ascii=False,indent=2)+'\n')
(root/'src/campaign/mercenary-profiles.json').write_text(json.dumps(merc,ensure_ascii=False,indent=2)+'\n')
# Army recruitment thresholds indexed by unit name and reference page.
special=json.loads((root/'src/campaign/special-skills.json').read_text())
armyPages=sorted([(v['page'],k) for k,v in special.items()])
recruits=[]
for n in range(64,329):
 s=pdf[n-1].get_text();ms=list(re.finditer(head,s))
 for i,m in enumerate(ms):
  body=' '.join(s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)].split())
  availability=re.search(r'DOSTĘPNOŚĆ:\s*(\d+|POWSZECHNA|NIE DOTYCZY)',body)
  if availability:recruits.append({'army':next((name for page,name in reversed(armyPages) if page<=n),''),'name':m.group(1).strip().capitalize(),'availability':int(availability[1]) if availability[1].isdigit() else 0 if availability[1]=='POWSZECHNA' else None,'page':n})
(root/'src/campaign/recruitment.json').write_text(json.dumps(recruits,ensure_ascii=False,indent=2)+'\n')
assert len(drama)==45 and len(merc)==44
print('Drama',len(drama),'Mercenaries',len(merc),'Recruitment profiles',len(recruits))
print([(p['name'],p['cost'],p['wage']) for p in drama])
