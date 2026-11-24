"use strict";(()=>{
const config=window.OFERTA_CONFIG||{};
function destination(key){const raw=typeof config[key]==='string'?config[key].trim():'';if(!raw)return null;try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
document.querySelectorAll('[data-destino]').forEach(a=>{const u=destination(a.dataset.destino);if(u){a.href=u;a.removeAttribute('aria-disabled');a.removeAttribute('title')}a.addEventListener('click',e=>{if(!destination(a.dataset.destino))e.preventDefault()})});
const select=document.getElementById('plano-conta'),output=document.getElementById('resultado-conta');select.addEventListener('change',()=>{const n=Number(select.value),price={1:37,3:67,8:97}[n];const nome={1:"Essencial",3:"Ampliado",8:"Completo"}[n];output.textContent=`Pack ${nome}: referência habitual de R$${n*65}. Black Friday: R$${price}. Economia: R$${n*65-price}.`});
})();
