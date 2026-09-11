// Tamburi AR v10.57 – zentraler Hard-Reset
(function(){
  function boot(){
    const frame=document.getElementById('app');
    if(!frame||!frame.contentDocument)return;
    const d=frame.contentDocument,w=frame.contentWindow;
    if(d.getElementById('v1057NewSite'))return;

    const style=d.createElement('style');
    style.textContent=`#v1057NewSiteWrap{margin:10px 10px 0}#v1057NewSite{width:100%;border:2px solid #d96f0d;background:#fff7ef;color:#9a4b00;border-radius:14px;padding:13px 16px;font-weight:800;font-size:15px;letter-spacing:.2px;box-shadow:0 3px 12px rgba(24,28,32,.06)}#v1057NewSite:active{transform:scale(.985)}`;
    d.head.appendChild(style);

    const wrap=d.createElement('div');wrap.id='v1057NewSiteWrap';
    wrap.innerHTML='<button id="v1057NewSite" type="button">🔄 NEUER STANDORT</button>';

    // Gewünschte Position: zwischen Modus und Standort. Wir suchen den Standort-Block
    // über den Standort-Button und setzen den Reset unmittelbar davor.
    const locate=d.getElementById('preLocationBtn');
    const locationPanel=locate?.closest('.panel');
    if(locationPanel)locationPanel.parentNode.insertBefore(wrap,locationPanel);
    else{
      const panels=d.querySelectorAll('.panel');
      if(panels.length>1)panels[1].parentNode.insertBefore(wrap,panels[1]);
      else d.body.insertBefore(wrap,d.body.firstChild);
    }

    function clearStorage(){
      try{
        Object.keys(localStorage).filter(k=>k.startsWith('tamburi-ar-v10')).forEach(k=>localStorage.removeItem(k));
        sessionStorage.clear();
      }catch(e){}
    }

    function hardReset(){
      clearStorage();

      // Zuerst die originale Standort-Neu-Funktion auslösen, damit deren interne
      // lexikalische Varianten-/Blob-Zustände ebenfalls gelöscht werden.
      const original=d.getElementById('v10NewSite');
      if(original)original.click();

      // Alle bekannten Eingaben vollständig auf Ausgangswerte setzen.
      const emptyIds=['preLocationAddress','photoName','v1044Adresse','v1044Lat','v1044Lon','v1044Montage','v1044Flaeche'];
      emptyIds.forEach(id=>{const e=d.getElementById(id);if(e)e.value=''});
      const defaults={v1044Grundmodul:'1',v1044Erweiterung:'0',v1044Mittel:'Betonsockel',v1044Platten:'Nein',v1044Schild:'Nein',v1044Solar:'Nein',v1044Preferred:'1',v1044Besichtiger:'Josef Röhrich'};
      Object.entries(defaults).forEach(([id,val])=>{const e=d.getElementById(id);if(e)e.value=val});
      const date=d.getElementById('v1044Datum');
      if(date){const n=new Date();date.value=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`}

      const gps=d.getElementById('preLocationGps');if(gps)gps.textContent='';
      const result=d.getElementById('v9Result');if(result)result.classList.remove('show');
      const resultImg=d.getElementById('v9ResultImg');if(resultImg)resultImg.removeAttribute('src');
      const review=d.getElementById('v98Review');if(review)review.classList.remove('active');
      const reviewImg=d.getElementById('v98ReviewImg');if(reviewImg)reviewImg.removeAttribute('src');
      const badges=d.getElementById('v10VariantBadges');if(badges)badges.innerHTML='';
      const count=d.getElementById('v10VariantCount');if(count)count.textContent='0 Aufnahmen für diesen Standort';

      // Alte Drafts nochmals nach dem originalen Handler entfernen. Anschließend
      // Reload: dadurch werden auch Wrapper-interne Arrays (Bildpaare) garantiert neu erzeugt.
      clearStorage();
      setTimeout(()=>{
        clearStorage();
        try{w.location.reload()}catch(e){location.reload()}
      },120);
    }

    d.getElementById('v1057NewSite').addEventListener('click',()=>{
      if(w.confirm('Wirklich neuen Standort beginnen?\n\nAlle Daten, Fotos und Varianten des aktuellen Standorts werden gelöscht.'))hardReset();
    });
  }

  const frame=document.getElementById('app');
  if(frame){frame.addEventListener('load',()=>setTimeout(boot,80));setTimeout(boot,500)}
})();
