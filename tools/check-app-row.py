"""Run the app-row browser fixture with Chrome on macOS; previews go to --output."""
import argparse,json,re,subprocess,tempfile
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parent.parent;out=Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
reports=[]
with tempfile.TemporaryDirectory(prefix='tv-row-check-') as work:
 work=Path(work)
 html=(root/'index.html').read_text().replace('<head>','<head><base href="'+root.as_uri()+'/">').replace('<script src="js/main.js">','<script src="tools/app-row.browser.js"></script><script src="js/main.js">')
 page=work/'check.html';page.write_text(html)
 for count in [0,1,5,12]:
  result=subprocess.run(['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','--headless','--no-sandbox','--disable-gpu','--allow-file-access-from-files','--hide-scrollbars','--window-size=1920,1080','--force-device-scale-factor=1','--user-data-dir='+str(work/'profile'),'--virtual-time-budget=5000','--dump-dom','--screenshot='+str(out/(str(count)+'-apps.png')),page.as_uri()+'?count='+str(count)],capture_output=True,text=True,timeout=30)
  m=re.search(r'<script id="row-check-result" type="application/json">(.*?)</script>',result.stdout)
  if not m: raise RuntimeError('Missing report: '+result.stderr[-1000:])
  report=json.loads(m[1]);reports.append(report);print(json.dumps(report))
(out/'results.json').write_text(json.dumps(reports,indent=2))
assert all(not r['failures'] and not r['errors'] for r in reports)
