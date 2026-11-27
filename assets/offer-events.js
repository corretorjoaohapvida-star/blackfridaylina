/* Events use the existing owner pixel only; never send personal form data. */
(()=>{
 const emit=(name,data)=>{window.dispatchEvent(new CustomEvent('lina:offer-event',{detail:{name,...data}}));if(typeof window.fbq==='function')window.fbq('trackCustom',name,{...data,revision:'four-ps-v1'});};
 document.querySelectorAll('[data-destino]').forEach(a=>a.addEventListener('click',()=>emit(a.hasAttribute('data-upgrade-trigger')?'EntryOfferSelected':'CheckoutSelected',{plan:a.dataset.destino,value:a.dataset.destino==='checkoutColetiva'?37.9:a.dataset.destino==='checkoutColetivaEspecial'?27.9:17.9,currency:'BRL'})));
 const offer=document.getElementById('oferta');if(offer&&'IntersectionObserver'in window){const o=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){emit('OfferSectionViewed',{});o.disconnect()}},{threshold:.15});o.observe(offer)}
 const dialog=document.getElementById('coletiva-special-dialog');if(dialog)new MutationObserver(()=>{if(dialog.open)emit('UpgradeOfferViewed',{value:27.9,currency:'BRL'})}).observe(dialog,{attributes:true,attributeFilter:['open']});
})();
