/* themes.js — الثيمات المشتركة (m: d=داكن / l=فاتح) */
const THEMES=[
 {id:'neon',n:'نيون داكن',m:'d',bg:'#0b0f19',c1:'#22d3ee',c2:'#8b5cf6'},
 {id:'gold',n:'ذهبي ملكي',m:'d',bg:'#12100a',c1:'#fbbf24',c2:'#d97706'},
 {id:'emerald',n:'زمردي',m:'d',bg:'#07130f',c1:'#34d399',c2:'#10b981'},
 {id:'royal',n:'بنفسجي ملكي',m:'d',bg:'#0f0a1f',c1:'#a78bfa',c2:'#ec4899'},
 {id:'ocean',n:'محيط',m:'d',bg:'#06121f',c1:'#38bdf8',c2:'#2563eb'},
 {id:'sunset',n:'غروب',m:'d',bg:'#1a0d10',c1:'#fb923c',c2:'#ef4444'},
 {id:'rose',n:'وردي',m:'d',bg:'#1a0b14',c1:'#fb7185',c2:'#c026d3'},
 {id:'cyber',n:'سايبر',m:'d',bg:'#0a0a12',c1:'#a3e635',c2:'#22d3ee'},
 {id:'slate',n:'رمادي هادئ',m:'d',bg:'#0f172a',c1:'#94a3b8',c2:'#6366f1'},
 {id:'clean',n:'فاتح نظيف',m:'l',bg:'#f5f7fb',c1:'#2563eb',c2:'#7c3aed'},
 {id:'warm',n:'فاتح دافئ',m:'l',bg:'#fbf6ee',c1:'#ea580c',c2:'#b45309'},
 {id:'mint',n:'فاتح منعش',m:'l',bg:'#f0faf6',c1:'#059669',c2:'#0891b2'}];
function themeVars(t){const L=t.m==='l';return{'--bg':t.bg,'--tx':L?'#1b2233':'#e8ecf6','--mut':L?'#5d6a85':'#8b95ad','--c1':t.c1,'--c2':t.c2,
 '--grad':`linear-gradient(135deg,${t.c1},${t.c2})`,'--glass':L?'rgba(255,255,255,.78)':'rgba(255,255,255,.05)','--line':L?'rgba(20,30,60,.13)':'rgba(255,255,255,.09)',
 '--r':(t.r==null?20:t.r)+'px','--blur':(t.b==null?12:t.b)+'px','--shadow':L?'0 8px 30px rgba(30,40,80,.12)':'0 10px 40px rgba(0,0,0,.35)'}}
function applyTheme(t,el){el=el||document.documentElement;const v=themeVars(t);for(const k in v)el.style.setProperty(k,v[k]);el.style.colorScheme=t.m==='l'?'light':'dark'}
const getTheme=(id,custom)=>custom||THEMES.find(t=>t.id===id)||THEMES[0];
