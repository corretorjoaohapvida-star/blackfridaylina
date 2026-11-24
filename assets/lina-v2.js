"use strict";(()=>{
const config=window.OFERTA_CONFIG||{};
function destination(key){const raw=typeof config[key]==='string'?config[key].trim():'';if(!raw)return null;try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
document.querySelectorAll('[data-destino]').forEach(a=>{const u=destination(a.dataset.destino);if(u){a.href=u;a.removeAttribute('aria-disabled');a.removeAttribute('title')}a.addEventListener('click',e=>{if(!destination(a.dataset.destino))e.preventDefault()})});
})();
