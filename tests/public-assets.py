"""Validate HTTPS deployment and every image/font including built CSS font URLs."""
import concurrent.futures, json, pathlib, re, urllib.request
from urllib.parse import urljoin
base = 'https://urvold.github.io/portfolio-forma-construction/'
with urllib.request.urlopen(base, timeout=30) as response:
    html = response.read().decode()
    assert response.status == 200 and response.url.startswith('https://')
paths = [str(p.relative_to('public')) for p in pathlib.Path('public').rglob('*') if p.is_file() and p.suffix in ['.webp', '.woff2']]
assets = re.findall(r'(?:src|href)="([^"]+\.(?:css|js))"', html)
paths += assets
for asset in assets:
    if asset.endswith('.css'):
        with urllib.request.urlopen(urljoin(base,asset),timeout=30) as response:
            css = response.read().decode()
        paths += [urljoin(urljoin(base,asset),url) for url in re.findall(r'url\([\'"]?([^\)\'\"]+\.woff2)[\'"]?\)',css)]
def check(path):
    url = urljoin(base,path)
    with urllib.request.urlopen(url,timeout=30) as response:
        data = response.read()
        assert response.status==200 and len(data)>0
        content_type = response.headers.get('Content-Type','')
        assert 'text/html' not in content_type
        if path.endswith('.webp'): assert data[:4]==b'RIFF' and data[8:12]==b'WEBP'
        if path.endswith('.woff2'): assert data[:4]==b'wOF2'
        return {'url':url,'status':response.status,'contentType':content_type,'bytes':len(data)}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(check, paths))
pathlib.Path('reports/public-assets.json').write_text(json.dumps({'url':base,'https':True,'assets':results},indent=2))
print(f'HTTPS 200; {len(results)} resources passed; all image/font signatures valid')
