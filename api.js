/* api.js — طبقة البيانات. الوضع الحالي: demo (localStorage). كل الدوال async
   حتى نستبدلها لاحقاً بـ Supabase بدون تغيير الصفحات. */
const API=(()=>{
 const K='lms_demo_v1',DAY=864e5;
 const PLANS={basic:{n:'أساسية',price:300,max:100,f:['courses','codes']},pro:{n:'احترافية',price:600,max:500,f:['courses','codes','exams','homework']},ultimate:{n:'مميزة',price:1000,max:5000,f:['courses','codes','exams','homework','live']}};
 const seed=()=>({owner:{email:'owner@demo.com',pass:'Owner@123'},tenants:[],ann:[],logs:[],sess:null,tsess:null,data:{}});
 let db;try{db=JSON.parse(localStorage.getItem(K))}catch(e){}db=db||seed();db.data=db.data||{};db.tsess=db.tsess||null;db.asess=db.asess||null;db.ssess=db.ssess||null;
 const save=()=>{try{localStorage.setItem(K,JSON.stringify(db))}catch(e){}};
 const sync=()=>{try{const x=localStorage.getItem(K);if(x)db=JSON.parse(x)}catch(e){}};
 const wrap=o=>{for(const k in o){const v=o[k];if(k==='log'||k==='rnd'||k==='PLANS')continue;if(typeof v==='function')o[k]=function(...a){sync();return v.apply(this,a)};else if(v&&typeof v==='object')wrap(v)}return o};
 const id=()=>Math.random().toString(36).slice(2,9);
 const rnd=n=>Array.from({length:n},()=>'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random()*31)]).join('');
 const lg=m=>{db.logs.unshift({t:Date.now(),m});db.logs=db.logs.slice(0,60);save()};
 const api={mode:'demo',PLANS,DAY,log:m=>{sync();lg(m)},rnd,
  async login(e,p){if(e===db.owner.email&&p===db.owner.pass){db.sess=id();save();lg('تسجيل دخول المالك');return true}return false},
  async isIn(){return !!db.sess},async logout(){db.sess=null;save()},
  async setCreds(e,p){db.owner={email:e,pass:p};save();lg('تغيير بيانات دخول المالك')},
  tenants:{async list(){return db.tenants},
   async create(d){if(db.tenants.some(x=>x.slug===d.slug))throw new Error('هذا الرابط مستخدم بالفعل');if(d.email&&db.tenants.some(x=>x.email===d.email))throw new Error('هذا البريد مستخدم لمنصة أخرى');const t={id:id(),active:true,created:Date.now(),themeId:'neon',custom:null,tpass:rnd(8),...d};db.tenants.push(t);lg('إنشاء منصة '+t.name);save();return t},
   async update(i,d){const t=db.tenants.find(x=>x.id===i);Object.assign(t,d);save();return t},
   async remove(i){const t=db.tenants.find(x=>x.id===i);db.tenants=db.tenants.filter(x=>x.id!==i);lg('حذف منصة '+(t?t.name:''));save()}},
  ann:{async list(){return db.ann},async add(x){db.ann.unshift({id:id(),t:Date.now(),x});lg('إعلان جديد');save()},async remove(i){db.ann=db.ann.filter(a=>a.id!==i);save()}},
  logs:{async list(){return db.logs}},
  async tlogin(e,p){const t=db.tenants.find(x=>x.email===e&&x.tpass===p);if(!t)return 'bad';if(!t.active)return 'off';if(t.expires<Date.now())return 'exp';db.tsess=t.id;save();return 'ok'},
  async tme(){return db.tenants.find(x=>x.id===db.tsess)||null},async tlogout(){db.tsess=null;save()},
  col(tid,n){const g=()=>{db.data[tid]=db.data[tid]||{};return db.data[tid][n]=db.data[tid][n]||[]};
   return wrap({async list(){return g()},async add(x){const r={id:id(),t:Date.now(),...x};g().push(r);save();return r},async update(i,d){const r=g().find(y=>y.id===i);Object.assign(r,d);save();return r},async remove(i){db.data[tid][n]=g().filter(y=>y.id!==i);save()}})},
  bySlug(s){const t=db.tenants.find(x=>x.slug===s);return t&&t.active&&t.expires>Date.now()?t:null},
  async alogin(s,e,p){const t=db.tenants.find(x=>x.slug===s);if(!t||!t.active||t.expires<Date.now())return 'tenant';const a=((db.data[t.id]||{}).assistants||[]).find(x=>x.email===e&&x.pass===p);if(!a)return 'bad';if(!a.active)return 'off';db.asess={tid:t.id,aid:a.id};save();return 'ok'},
  async ame(){const s=db.asess;if(!s)return null;const t=db.tenants.find(x=>x.id===s.tid),a=t&&((db.data[t.id]||{}).assistants||[]).find(x=>x.id===s.aid);return t&&t.active&&a&&a.active?{t,a}:null},async alogout(){db.asess=null;save()},
  async slogin(s,ph,p){const t=API.bySlug(s);if(!t)return 'tenant';const u=((db.data[t.id]||{}).students||[]).find(x=>x.phone===ph&&x.pass===p);if(!u)return 'bad';if(u.ban)return 'ban';u.tok=id();db.ssess={tid:t.id,sid:u.id,tok:u.tok};save();return 'ok'},
  async sme(){const s=db.ssess;if(!s)return null;const t=db.tenants.find(x=>x.id===s.tid);if(!t||!t.active||t.expires<Date.now())return null;const u=((db.data[s.tid]||{}).students||[]).find(x=>x.id===s.sid);return u&&u.tok===s.tok&&!u.ban?{t,u}:null},async slogout(){db.ssess=null;save()},
  async exportDB(){return JSON.stringify(db)},async importDB(s){db=JSON.parse(s);save()},async reset(){db=seed();save()}};
 return wrap(api);
})();
