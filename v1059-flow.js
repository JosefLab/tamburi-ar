// Tamburi AR v10.59 – zwei Aufnahmen bilden genau eine Aufstellvariante
(function(){
  function boot(){
    const frame=document.getElementById('app');
    if(!frame||!frame.contentDocument)return;
    const d=frame.contentDocument;
    const alt=d.getElementById('v10Alternative');
    if(alt)alt.style.display='none';
    const count=d.getElementById('v10VariantCount');
    const badges=d.getElementById('v10VariantBadges');
    if(!count||!badges)return;
    function refresh(){
      const n=badges.querySelectorAll('.v10Badge').length;
      const complete=Math.floor(n/2), open=n%2;
      count.textContent=open?`${complete+1} Aufstellvarianten · ${n} Fotos · V${complete+1}: Rendering fehlt`:`${complete} Aufstellvariante${complete===1?'':'n'} · ${n} Fotos`;
      [...badges.querySelectorAll('.v10Badge')].forEach((b,i)=>{const v=Math.floor(i/2)+1;b.textContent=`V${v} ${i%2===0?'O':'R'}`;b.title=i%2===0?`Variante ${v} – Original`:`Variante ${v} – Rendering`});
    }
    new MutationObserver(refresh).observe(badges,{childList:true,subtree:true});refresh();
  }
  const frame=document.getElementById('app');if(frame){frame.addEventListener('load',()=>setTimeout(boot,150));setTimeout(boot,600)}
})();