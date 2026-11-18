(function(){
var W0={santorini:'Santorini',fushimi:'Fushimi Inari-taisha',machu:'Machu Picchu',louise:'Lake Louise (Alberta)',petra:'Petra'};
function add(f){var s=document.createElement('script');s.src=f;document.body.appendChild(s)}
var i;for(i=2;i<=12;i++)add('places'+i+'.js');for(i=2;i<=10;i++)add('quotes'+i+'.js');

var landPath='',landState=0,WK={},showN=30;
function wikiOf(p){return p.wiki||W0[p.id]||p.name}

function loadLand(){
 if(landState)return;landState=1;
 var s=document.createElement('script');
 s.src='https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';
 s.onload=function(){
  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(function(r){return r.json()}).then(function(t){
   var f=topojson.feature(t,t.objects.land),d='';
   var geos=f.type=='FeatureCollection'?f.features.map(function(x){return x.geometry}):[f.geometry];
   function ring(r){for(var i=0;i<r.length;i++)d+=(i?'L':'M')+(r[i][0]+180).toFixed(1)+' '+(90-r[i][1]).toFixed(1);d+='Z'}
   geos.forEach(function(g){
    if(g.type=='Polygon')g.coordinates.forEach(ring);
    else if(g.type=='MultiPolygon')g.coordinates.forEach(function(p){p.forEach(ring)});
   });
   landPath=d;landState=2;if(tab=='world')render();
  }).catch(function(){landState=0});
 };
 s.onerror=function(){landState=0};
 document.head.appendChild(s);
}

function mapSvg(pts,zoom,r){
 var W=360,H=180,vb='0 0 360 180';
 if(zoom&&pts.length){
  var p0=pts[0],w=90,h=45;
  var x=Math.max(0,Math.min(W-w,p0.lon+180-w/2)),y=Math.max(0,Math.min(H-h,90-p0.lat-h/2));
  vb=x.toFixed(1)+' '+y.toFixed(1)+' '+w+' '+h;
 }
 var bg='';
 if(landPath)bg='<use href="#landp" fill="#fffaf2" stroke="#bcd9ee" stroke-width=".3"/>';
 else{
  for(var a=0;a<=W;a+=30)bg+='<line x1="'+a+'" y1="0" x2="'+a+'" y2="'+H+'" stroke="#fff" stroke-width=".6"/>';
  for(var b=0;b<=H;b+=30)bg+='<line x1="0" y1="'+b+'" x2="'+W+'" y2="'+b+'" stroke="#fff" stroke-width=".6"/>';
 }
 var dots=pts.map(function(p){
  var cx=(p.lon+180).toFixed(2),cy=(90-p.lat).toFixed(2);
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#f7a58c" stroke="#fff" stroke-width="'+(r*.35)+'"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.38)+'" fill="#fff"/>';
 }).join('');
 return '<svg viewBox="'+vb+'" width="100%" style="display:block;border-radius:14px;background:#dcecf7" role="img" aria-label="地圖">'+bg+dots+'</svg>';
}

function placeCard(p){
 return '<div class="card"><div id="ph" data-id="'+p.id+'" style="min-height:120px;border-radius:18px;background:#e6dcf5;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:13px;color:#8a84a0">📷 載入照片中…</div>'
 +'<div id="phc" style="font-size:12px;color:#8a84a0;margin:6px 0 0"></div>'
 +'<h3>'+esc(p.name)+' <span class="sm">'+esc(p.country)+'</span></h3><p>'+esc(p.story)+'</p>'
 +'<p>✨ <b>你知道嗎？</b><br>'+esc(p.fact)+'</p>'
 +'<b>📍 它在地球的哪裡？</b><div style="margin-top:6px">'+mapSvg([p],true,1.6)+'</div></div>';
}

function loadPhoto(p){
 var id=p.id;
 function show(d){
  var box=document.getElementById('ph'),cr=document.getElementById('phc');
  if(!box||box.dataset.id!=id)return;
  if(d&&d.thumbnail&&d.thumbnail.source){
   var small=d.thumbnail.source,big=small.replace(/\/(\d+)px-/,'/500px-');
   var img=document.createElement('img');
   img.alt=p.name;img.style.cssText='width:100%;height:190px;object-fit:cover;display:block';
   img.onerror=function(){img.onerror=null;img.src=small};
   img.src=big;
   box.innerHTML='';box.style.minHeight='0';box.appendChild(img);
   var page=d.content_urls&&d.content_urls.desktop?d.content_urls.desktop.page:'';
   cr.innerHTML='照片來源：'+(page?'<a href="'+page+'" target="_blank" style="color:#7d6aa8">Wikipedia／Wikimedia Commons</a>':'Wikipedia／Wikimedia Commons')+'，授權依原頁面標示';
  }else{box.textContent='（這個景點暫時沒有照片）'}
 }
 if(WK[id]!==undefined){show(WK[id]);return}
 fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(wikiOf(p).replace(/ /g,'_')))
  .then(function(r){return r.json()}).then(function(d){WK[id]=d;show(d)})
  .catch(function(){show(null)});
}

vWorld=function(){
 var n=count();
 var col=S.places.map(function(id){return PLACES.find(function(p){return p.id==id})}).filter(Boolean);
 var cur=PLACES.find(function(p){return p.id==S.lastP});
 var h='<h2>🌍 世界</h2>';
 if(landPath)h+='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><path id="landp" fill-rule="evenodd" d="'+landPath+'"/></defs></svg>';
 if(n<3)h+='<div class="card c">🔒 今日完成 3 項習慣，就能抽新的景點<br>目前 '+n+' / 7</div>';
 else h+='<div class="c" style="margin-bottom:12px"><button class="main" data-a="draw2">抽一張世界美景</button><div class="sm" style="margin-top:6px">已探索 '+col.length+' / '+PLACES.length+'</div></div>';
 if(cur)h+=placeCard(cur);
 h+='<div class="card"><b>我的世界足跡地圖</b><div style="margin-top:8px">'+mapSvg(col,false,3)+'</div>'
  +'<p class="sm c">已探索 '+col.length+' 個景點 · '+new Set(col.map(function(p){return p.country})).size+' 個國家／地區<br>「點亮」代表在 App 抽到，不代表實際到訪</p></div>';
 col.slice().reverse().slice(0,showN).forEach(function(p){
  h+='<div class="card" style="padding:12px"><div class="row"><div style="flex:none;width:96px">'+mapSvg([p],true,3)+'</div>'
   +'<div style="flex:1;min-width:0"><b>'+esc(p.name)+'</b><div class="sm">'+esc(p.country)+'</div></div>'
   +'<button data-a="view2" data-v="'+p.id+'">重讀</button></div></div>';
 });
 if(col.length>showN)h+='<div class="c"><button data-a="more2">顯示更多</button></div>';
 return h;
};

var _render=render;
render=function(){_render();if(tab=='world'){loadLand();var c=PLACES.find(function(p){return p.id==S.lastP});if(c)loadPhoto(c)}};

document.addEventListener('click',function(e){
 var el=e.target.closest('[data-a]');if(!el)return;var a=el.dataset.a,v=el.dataset.v;
 if(a=='draw2'){
  if(count()<3)return;
  var left=PLACES.filter(function(p){return S.places.indexOf(p.id)<0});
  var pool=left.length?left:PLACES;
  var p=pool[Math.floor(Math.random()*pool.length)];
  S.lastP=p.id;if(S.places.indexOf(p.id)<0)S.places.push(p.id);
  save();render();scrollTo(0,0);
 }else if(a=='view2'){S.lastP=v;save();render();scrollTo(0,0)}
 else if(a=='more2'){showN+=30;render()}
});
})();
