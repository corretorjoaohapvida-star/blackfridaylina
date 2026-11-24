"use strict";(()=>{
const config=window.OFERTA_CONFIG||{};
function destination(key){const raw=typeof config[key]==='string'?config[key].trim():'';if(!raw)return null;try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
document.querySelectorAll('[data-destino]').forEach(a=>{const u=destination(a.dataset.destino);if(u){a.href=u;a.removeAttribute('aria-disabled');a.removeAttribute('title')}a.addEventListener('click',e=>{if(!destination(a.dataset.destino))e.preventDefault()})});
const toggle=document.getElementById('floatToggle'),menu=document.getElementById('floatMenu');toggle.addEventListener('click',()=>toggle.setAttribute('aria-expanded',String(menu.classList.contains('open'))));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
const select=document.getElementById('plano-conta'),output=document.getElementById('resultado-conta');select.addEventListener('change',()=>{const n=Number(select.value),price={1:37,3:67,8:97}[n];output.textContent=`${n} × R$65 = R$${n*65} na referência habitual. Black Friday: R$${price}. Economia: R$${n*65-price}.`});
})();
