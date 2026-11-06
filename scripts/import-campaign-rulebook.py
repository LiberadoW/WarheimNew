"""Import campaign reference data from the owner's AD2026.04.15 PDF.
Usage: python scripts/import-campaign-rulebook.py /path/to/rulebook.pdf
Requires PyMuPDF. The PDF itself is not committed.
"""
import fitz, json, re, sys
from pathlib import Path
pdf=fitz.open(sys.argv[1])
root=Path(__file__).resolve().parents[1]
def text(n):
 p=pdf[n-1]; cols=[[],[]]
 for b in p.get_text('dict')['blocks']:
  for l in b.get('lines',[]):
   s=''.join(v['text'] for v in l['spans']).strip()
   if s and 15 < l['bbox'][1]<805:
    cols[(l['bbox'][0]+l['bbox'][2])/2>=p.rect.width/2].append((l['bbox'][1],l['bbox'][0],s))
 out=[]
 for c in cols:
  rows=[]
  for y,x,s in sorted(c):
   if rows and abs(y-rows[-1][0])<3: rows[-1][1].append((x,s))
   else: rows.append([y,[(x,s)]])
  out += [' '.join(s for x,s in sorted(row)) for y,row in rows]
 return '\n'.join(out)
cats=[(427,'Oręż — walka wręcz'),(430,'Oręż — dystansowy'),(432,'Oręż — prochowy'),(435,'Tarcza i pancerz'),(436,'Amunicja specjalna'),(438,'Narzędzia i osobliwości'),(440,'Trucizny, mikstury i narkotyki'),(442,'Ulepszenia machin wojennych'),(443,'Protezy, dodatki i usługi'),(444,'Zwierzęta'),(447,'Chowańce i cherubiny'),(450,'Magiczny oręż'),(458,'Magiczna zbroja'),(465,'Magiczne talizmany'),(470,'Arkana'),(474,'Magiczne instrumenty'),(478,'Magiczne sztandary')]
items=[]; headings=[]; current=None
for n in range(427,483):
 s=text(n)
 # Heading starts in capitals, optional lowercase limitation in parentheses.
 pattern=r'^([A-ZĄĆĘŁŃÓŚŹŻ0-9][A-ZĄĆĘŁŃÓŚŹŻ0-9 /&!,.’–\-]+(?:\s*\([^\n]*?\))?)\s*:\s*$'
 hs=list(re.finditer(pattern,s,re.M))
 for i,h in enumerate(hs):
  name=h.group(1).strip(); body=s[h.end():hs[i+1].start() if i+1<len(hs) else len(s)]
  price=re.search(r'CENA:\s*([^;\n]+?)\s*zk\s*;\s*DOSTĘPNOŚĆ:\s*(Powszechna|\d+)',body,re.I)
  if not price: continue
  cat=[cat for start,cat in cats if start<=n][-1]
  items.append({'id':f'pdf-{n}-{len(items)}','name':name[0]+name[1:].lower(),'category':cat,'price':price.group(1).strip().replace(' ','').upper(),'availability':0 if price.group(2).lower()=='powszechna' else int(price.group(2)), 'text':' '.join(body.split()),'page':n})
(root/'src/campaign/catalog.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
# Campaign chapters are available as contextual references inside each phase.
refs={str(n):text(n) for n in range(408,427)}
(root/'src/campaign/reference.json').write_text(json.dumps(refs,ensure_ascii=False,indent=2)+'\n')
# Serious injuries and exploration results use the PDF's standard reading order.
inj=pdf[409].get_text()
ms=list(re.finditer(r'\((\d{2})(?:-(\d{2}))?\)\s*([^\n]+)',inj))
injuries=[{'min':int(m.group(1)),'max':int(m.group(2) or m.group(1)),'name':m.group(3).strip().capitalize(),'text':' '.join(inj[m.end():ms[i+1].start() if i+1<len(ms) else len(inj)].split()),'page':410} for i,m in enumerate(ms)]
(root/'src/campaign/injuries.json').write_text(json.dumps(injuries,ensure_ascii=False,indent=2)+'\n')
expl=[]
for n in range(419,424):
 s=pdf[n-1].get_text(); ms=list(re.finditer(r'\(([1-6]{2,6})\)\s*([^\n]+)',s))
 for i,m in enumerate(ms):
  # First six entries describe inside; second six describe outside.
  expl.append({'key':m.group(1),'area':'inside' if i<6 else 'outside','name':m.group(2).strip().capitalize(),'text':' '.join(s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)].split()),'page':n})
(root/'src/campaign/exploration.json').write_text(json.dumps(expl,ensure_ascii=False,indent=2)+'\n')
print('Catalog:',len(items),'injuries:',len(injuries),'exploration:',len(expl))
for i in items: print(i['page'],i['name'],i['price'],i['availability'])
special={}
for n in range(64,329):
 s=pdf[n-1].get_text()
 if 'UMIEJĘTNOŚCI SPECJALNE' not in s:continue
 heading=re.search(r'([A-ZĄĆĘŁŃÓŚŹŻ][A-ZĄĆĘŁŃÓŚŹŻ &\-]+):',s).group(1)
 tail=' '.join(s.split('UMIEJĘTNOŚCI SPECJALNE',1)[1].split())
 m=re.search(r'(?:zasady specjalnej|zasad specjalnych) (.+?)(?:\. Więcej|\.Więcej)',tail)
 if not m:
  print('UNPARSED SPECIAL',n,heading);continue
 names=re.split(r'\s+(?:lub|oraz)\s+(?![^()]*\))',m.group(1))
 special[heading.lower()]={'page':n,'entries':[{'name':x.split(' (')[0].strip().capitalize(),'restriction':re.search(r'\((.*?)\)',x).group(1) if '(' in x else ''} for x in names],'text':tail[:tail.find('Więcej')]}
(root/'src/campaign/special-skills.json').write_text(json.dumps(special,ensure_ascii=False,indent=2)+'\n')
print('Special skill lists:',len(special))
# Explicit variants from the same source paragraphs; keep price arithmetic executable.
items=json.loads((root/'src/campaign/catalog.json').read_text())
fixed=[]
for item in items:
 if item['name']=='Pancerz skórzany /':item['name']='Lekki pancerz'
 if item['name']=='Pancerz kolczy /':item['name']='Średni pancerz'
 if item['name']=='Zbroja płytowa (ciężki pancerz)':item['name']='Ciężki pancerz'
 if item['name']=='Latarnia/latarnia sztormowa':
  for suffix,name,price in [('a','Latarnia','10'),('b','Latarnia sztormowa','20')]:fixed.append({**item,'id':item['id']+suffix,'name':name,'price':price})
 elif item['price']=='KOSZTPANCERZAX2':
  for suffix,name,price in [('a','Lekki pancerz (dla wielkoluda)','10'),('b','Średni pancerz (dla wielkoluda)','30'),('c','Ciężki pancerz (dla wielkoluda)','60')]:fixed.append({**item,'id':item['id']+suffix,'name':name,'price':price})
 else:fixed.append(item)
assert len(fixed)==505
assert len(expl)==60 and len(injuries)==20 and len(special)==66
(root/'src/campaign/catalog.json').write_text(json.dumps(fixed,ensure_ascii=False,indent=2)+'\n')
# Mental illness descriptions required by serious injury 24.
mental=[]
for n in [412,413]:
 s=pdf[n-1].get_text();ms=list(re.finditer(r'(?m)^([1-6][1-6])\s*\n\s*([A-ZĄĆĘŁŃÓŚŹŻ][A-ZĄĆĘŁŃÓŚŹŻ -]{3,})\s*\n',s))
 for i,m in enumerate(ms):mental.append({'code':int(m[1]),'name':m[2].strip().capitalize(),'text':' '.join(s[m.end():ms[i+1].start() if i+1<len(ms) else len(s)].split()),'page':n})
assert len(mental)==36
(root/'src/campaign/mental-injuries.json').write_text(json.dumps(mental,ensure_ascii=False,indent=2)+'\n')
