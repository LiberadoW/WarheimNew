"""Extract the three-column advancement table, including its red headings."""
import sys,re,json,fitz
from pathlib import Path
p=fitz.open(sys.argv[1])[416]; cols=[[],[],[]]
for b in p.get_text('dict')['blocks']:
 for l in b.get('lines',[]):
  for s in l['spans']:
   if s['color']!=0xc00000 or s['bbox'][1]>800 or not s['text'].strip():continue
   x0,y0,x1,y1=s['bbox'];col=0 if (x0+x1)/2<215 else 1 if (x0+x1)/2<390 else 2
   cols[col].append((y0,x0,y1,s['text']))
thresholds=[[5,10,15,20,29,40],[3,7,11,19,29,40],[6,13,20,29,40]]
tracks=['determinacja','gniew','odpornosc'];out=[]
for c,spans in enumerate(cols):
 lines=[]
 for y,x,y1,s in sorted(spans):
  if lines and abs(lines[-1]['y']-y)<2:lines[-1]['spans'].append((x,s));lines[-1]['bottom']=max(lines[-1]['bottom'],y1)
  else:lines.append({'y':y,'bottom':y1,'spans':[(x,s)]})
 for i,line in enumerate(lines):
  name=''.join(s for x,s in sorted(line['spans'])).strip().capitalize()
  threshold=thresholds[c][i//3]
  bottom=lines[i+1]['y']-1 if i+1<len(lines) else 799
  body=p.get_text(clip=fitz.Rect([58,235,412][c],line['bottom'],[210,387,564][c],bottom),sort=True)
  out.append({'id':f'{tracks[c]}-{threshold}-{i%3}','track':tracks[c],'threshold':threshold,'name':name,'text':' '.join(body.split()),'page':417})
assert len(out)==51
Path('src/campaign/company-advances.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print([(e['track'],e['threshold'],e['name']) for e in out])
