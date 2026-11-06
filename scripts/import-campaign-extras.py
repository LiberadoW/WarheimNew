"""Import chapter 21 mutations and chapter 22 crafting recipes from the owner's PDF."""
import fitz,json,re,sys
from pathlib import Path
pdf=fitz.open(sys.argv[1]);root=Path(__file__).resolve().parents[1]/'src/campaign'
def text(n):
 p=pdf[n-1];cols=[[],[]]
 for b in p.get_text('dict')['blocks']:
  for l in b.get('lines',[]):
   s=''.join(v['text'] for v in l['spans']).strip()
   if s and 15<l['bbox'][1]<805:cols[(l['bbox'][0]+l['bbox'][2])/2>=p.rect.width/2].append((l['bbox'][1],l['bbox'][0],s))
 out=[]
 for col in cols:
  rows=[]
  for y,x,s in sorted(col):
   if rows and abs(y-rows[-1][0])<3:rows[-1][1].append((x,s))
   else:rows.append([y,[(x,s)]])
  out+=[' '.join(s for x,s in sorted(row)) for y,row in rows]
 return '\n'.join(out)
mutations=[]
for n,god in zip(range(543,548),['Niepodzielony','Khorne','Nurgle','Slaanesh','Tzeentch']):
 s=pdf[n-1].get_text();ms=list(re.finditer(r'(?m)^([1-6][1-6])(?:-([1-6][1-6]))?\s+([A-ZĄĆĘŁŃÓŚŹŻ][A-ZĄĆĘŁŃÓŚŹŻ ,&!\-]+)\s*\n',s))
 for i,m in enumerate(ms):
  mutations.append({'god':god,'min':int(m[1]),'max':int(m[2] or m[1]),'name':m[3].strip().capitalize(),'text':' '.join(s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)].split()),'page':n})
 for a in range(1,7):
  for b in range(1,7):assert sum(m['min']<=a*10+b<=m['max'] for m in mutations if m['god']==god)==1,(god,a,b)
(root/'mutations.json').write_text(json.dumps(mutations,ensure_ascii=False,indent=2)+'\n')
recipes=[];category=''
for n in [582,583,584,586,587,588]:
 s=text(n);ms=[m for m in re.finditer(r'(?m)^([^\n:]+):\s*$',s) if m[1].strip().isupper()]
 for i,m in enumerate(ms):
  name=m[1].strip();body=s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)]
  if name.startswith(('RUNY ','MECHANIZMY ')):category=name.capitalize();continue
  price=re.search(r'CENA:\s*([^;\n]+?)\s*zk\s*;\s*DOSTĘPNOŚĆ:\s*(Powszechna|\d+)',body,re.I)
  if not price:continue
  recipes.append({'id':f'craft-{n}-{len(recipes)}','name':name.capitalize(),'category':category,'kind':'rune' if n<585 else 'mechanism','master':'MISTRZOWSKA' in name,'price':price[1].strip().replace(' ','').replace('CENA:','').upper(),'availability':0 if price[2].lower()=='powszechna' else int(price[2]),'text':' '.join(body.split()),'page':n})
assert len(recipes)>50,len(recipes)
(root/'crafting.json').write_text(json.dumps(recipes,ensure_ascii=False,indent=2)+'\n')
refs={str(n):text(n) for n in [484,496,542,*range(543,548),*range(581,589)]}
(root/'extra-reference.json').write_text(json.dumps(refs,ensure_ascii=False,indent=2)+'\n')
print('Mutations',len(mutations),'Crafting',len(recipes))
for r in recipes:print(r['name'],r['category'],r['price'])
