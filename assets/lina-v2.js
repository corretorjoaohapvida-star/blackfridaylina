"use strict";(()=>{
const config=window.OFERTA_CONFIG||{};
function destination(key){const raw=typeof config[key]==='string'?config[key].trim():'';if(!raw)return null;try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
const dialog=document.getElementById('coletiva-special-dialog');
const notice=dialog&&dialog.querySelector('[data-offer-notice]');
let opener=null,previousOverflow='';
function closeSpecial(){if(dialog&&dialog.open)dialog.close()}
function openSpecial(trigger){
 if(!dialog||dialog.open)return;
 opener=trigger;previousOverflow=document.body.style.overflow;
 if(notice){notice.textContent='';notice.hidden=true}
 dialog.showModal();document.body.style.overflow='hidden';
 dialog.querySelector('[data-special-close]').focus({preventScroll:true});
 dialog.querySelector('.special-offer-scroll').scrollTop=0;
}
if(dialog){
 dialog.querySelector('[data-special-close]').addEventListener('click',closeSpecial);
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;if(opener&&opener.isConnected)opener.focus({preventScroll:true})});
 dialog.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const items=[...dialog.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(el=>el.getAttribute('aria-disabled')!=='true'&&el.getClientRects().length);
  const first=items[0],last=items[items.length-1];
  if(!first){e.preventDefault();return}
  if(e.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){e.preventDefault();first.focus()}
 });
 let backdropPress=false;
 function outside(event){const r=dialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom}
 dialog.addEventListener('pointerdown',e=>{backdropPress=e.target===dialog&&outside(e)});
 dialog.addEventListener('click',e=>{if(backdropPress&&e.target===dialog&&outside(e))closeSpecial();backdropPress=false});
}
document.querySelectorAll('[data-destino]').forEach(a=>{
 const u=destination(a.dataset.destino);
 if(u)a.href=u;
 if(u||a.hasAttribute('data-upgrade-trigger')||a.hasAttribute('data-special-decline')){a.removeAttribute('aria-disabled');a.removeAttribute('title')}
 a.addEventListener('click',e=>{
  if(a.hasAttribute('data-upgrade-trigger')&&dialog){e.preventDefault();openSpecial(a);return}
  if(!destination(a.dataset.destino)){
   e.preventDefault();
   if(dialog&&dialog.contains(a)){
    if(a.hasAttribute('data-special-decline')){closeSpecial();return}
    if(notice){notice.textContent='O checkout desta condição ainda não está disponível. Você pode fechar e voltar às opções.';notice.hidden=false}
   }
   return;
  }
  if(dialog&&dialog.contains(a))closeSpecial();
 });
});
})();
