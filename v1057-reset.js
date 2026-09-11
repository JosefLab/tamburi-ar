// Tamburi AR v10.58 – Hard-Reset + robuste Original/Rendering-Paare
(function(){
  const WEBAPP='https://script.google.com/macros/s/AKfycby9N5ZygYPfmUNHYnCaO0lFTsXJ86G0Xq3BEsf8qJv0LD72ckeMOIobFGGMJk2WMK-24g/exec';
  let originals=[];
  let pendingOriginal=null;

  function boot(){
    const frame=document.getElementById('app');
    if(!frame||!frame.contentDocument)return;
    const d=frame.contentDocument,w=frame.contentWindow;
    const version=d.querySelector('header h1 span');if(version)version.textContent='v10.58';
    d.title='Tamburi Standort AR v10.58';

    installPairing(d,w);
    if(d.getElementById('v1057NewSite'))return;

    const style=d.createElement('style');
    style.textContent=`#v1057NewSiteWrap{margin:10px 10px 0}#v1057NewSite{width:100%;border:2px solid #d96f0d;background:#fff7ef;color:#9a4b00;border-radius:14px;padding:13px 16px;font-weight:800;font-size:15px;letter-spacing:.2px;box-shadow:0 3px 12px rgba(24,28,32,.06)}#v1057NewSite:active{transform:scale(.985)}`;
    d.head.appendChild(style);
    const wrap=d.createElement('div');wrap.id='v1057NewSiteWrap';
    wrap.innerHTML='<button id="v1057NewSite" type="button">🔄 NEUER STANDORT</button>';
    const locate=d.getElementById('preLocationBtn');
    const locationPanel=locate?.closest('.panel');
    if(locationPanel)locationPanel.parentNode.insertBefore(wrap,locationPanel);
    else{const panels=d.querySelectorAll('.panel');if(panels.length>1)panels[1].parentNode.insertBefore(wrap,panels[1]);else d.body.insertBefore(wrap,d.body.firstChild)}

    d.getElementById('v1057NewSite').addEventListener('click',()=>{
      if(w.confirm('Wirklich neuen Standort beginnen?\n\nAlle Daten, Fotos und Varianten des aktuellen Standorts werden gelöscht.'))hardReset(d,w);
    });
  }

  function badges(d){return [...d.querySelectorAll('#v10VariantBadges .v10Badge')]}

  async function captureOriginal(d){
    const video=d.getElementById('v9Video');
    if(!video||!video.videoWidth||!video.videoHeight)throw new Error('Kamerabild noch nicht bereit.');
    const vw=video.videoWidth,vh=video.videoHeight,target=4/3;
    let sx=0,sy=0,sw=vw,sh=vh;
    if(vw/vh>target){sw=vh*target;sx=(vw-sw)/2}else{sh=vw/target;sy=(vh-sh)/2}
    const c=d.createElement('canvas');c.width=1024;c.height=768;
    c.getContext('2d').drawImage(video,sx,sy,sw,sh,0,0,1024,768);
    return await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('Originalfoto konnte nicht erzeugt werden.')),'image/jpeg',.95));
  }

  function installPairing(d,w){
    const shutter=d.getElementById('v9Shutter');
    if(shutter&&!shutter.dataset.v1058){
      shutter.dataset.v1058='1';
      const start=()=>{pendingOriginal=captureOriginal(d).catch(()=>null)};
      shutter.addEventListener('pointerdown',start,true);
      shutter.addEventListener('touchstart',start,{capture:true,passive:true});
    }
    const confirm=d.getElementById('v98Confirm');
    if(confirm&&!confirm.dataset.v1058){
      confirm.dataset.v1058='1';
      confirm.addEventListener('click',()=>{
        const p=pendingOriginal,before=badges(d).length;
        setTimeout(async()=>{
          const after=badges(d).length;
          if(after===before+1&&p){const blob=await p;if(blob)originals[after-1]=blob}
          pendingOriginal=null;updateStatus(d);
        },120);
      },true);
    }
    const retake=d.getElementById('v98Retake');if(retake&&!retake.dataset.v1058){retake.dataset.v1058='1';retake.addEventListener('click',()=>pendingOriginal=null,true)}
    const del=d.getElementById('v101Delete');if(del&&!del.dataset.v1058){del.dataset.v1058='1';del.addEventListener('click',()=>{const i=badges(d).findIndex(b=>b.classList.contains('active'));setTimeout(()=>{if(i>=0)originals.splice(i,1);updateStatus(d)},40)},true)}
    const send=d.getElementById('v1044Send');if(send&&!send.dataset.v1058){send.dataset.v1058='1';send.onclick=()=>sendV1058(d,w)}
    updateStatus(d);
  }

  function updateStatus(d){
    const c=d.getElementById('v1056Check'),n=badges(d).length;if(!c)return;
    if(!n){c.className='v1056warn';c.textContent='⚠ Noch keine Variante vorhanden.';return}
    const missing=[];for(let i=0;i<n;i++)if(!originals[i])missing.push('V'+(i+1)+' Original');
    if(missing.length){c.className='v1056warn';c.textContent='⚠ Unvollständig: '+missing.join(', ')}
    else{c.className='v1056ok';c.textContent=`✓ ${n} Variante${n===1?'':'n'} = ${n*2} Bilder (je Original + Rendering).`}
  }

  async function blob64(blob){return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(blob)})}
  function coord(v){const n=Number(String(v||'').replace(',','.'));return Number.isFinite(n)?n.toFixed(8):''}
  async function collect(d){
    const bs=badges(d);if(!bs.length)throw new Error('Keine gespeicherte Variante gefunden.');
    if(originals.filter(Boolean).length!==bs.length)throw new Error(`Variantenzuordnung unvollständig: ${bs.length} Renderings, ${originals.filter(Boolean).length} Originale.`);
    const active=bs.findIndex(b=>b.classList.contains('active')),out=[];
    for(let i=0;i<bs.length;i++){
      bs[i].click();await new Promise(r=>setTimeout(r,100));
      const src=d.getElementById('v9ResultImg')?.src;if(!src)throw new Error(`Rendering Variante ${i+1} fehlt.`);
      const rendering=await (await fetch(src)).blob();
      out.push({originalVariant:i+1,originalBase64:await blob64(originals[i]),originalMimeType:originals[i].type||'image/jpeg',renderingBase64:await blob64(rendering),renderingMimeType:rendering.type||'image/jpeg'});
    }
    if(active>=0&&bs[active])bs[active].click();
    const fav=Number(d.getElementById('v1044Preferred')?.value||1);
    return out.sort((a,b)=>(a.originalVariant===fav?-1:b.originalVariant===fav?1:a.originalVariant-b.originalVariant)).map((x,i)=>({...x,position:i+1,favorit:i===0}));
  }
  function post(d,data){let t=d.getElementById('v1058PostTarget');if(!t){t=d.createElement('iframe');t.id='v1058PostTarget';t.name='v1058PostTarget';t.style.display='none';d.body.appendChild(t)}const f=d.createElement('form');f.method='POST';f.action=WEBAPP;f.target='v1058PostTarget';f.style.display='none';const i=d.createElement('input');i.type='hidden';i.name='payload';i.value=JSON.stringify(data);f.appendChild(i);d.body.appendChild(f);f.submit();setTimeout(()=>f.remove(),1500)}
  async function sendV1058(d,w){
    const $=id=>d.getElementById(id),st=$('v1044SheetStatus'),btn=$('v1044Send'),address=$('v1044Adresse')?.value.trim()||'';
    if(!address){st.textContent='Bitte zuerst eine Adresse eintragen.';return}
    const lat=coord($('v1044Lat')?.value),lon=coord($('v1044Lon')?.value);if(!lat||!lon){st.textContent='Bitte gültige GPS-Koordinaten eintragen.';return}
    btn.disabled=true;
    try{
      st.textContent='Bildpaare werden vorbereitet …';const variants=await collect(d);
      const data={adresse:address,latitude:"'"+lat,longitude:"'"+lon,montagebeschreibung:$('v1044Montage')?.value.trim()||'',grundmodul:$('v1044Grundmodul')?.value||'1',erweiterungskaesten:$('v1044Erweiterung')?.value||'0',montageflaeche:$('v1044Flaeche')?.value.trim()||'',besichtigtAm:$('v1044Datum')?.value||'',besichtigtVon:$('v1044Besichtiger')?.value.trim()||'',montagemittel:$('v1044Mittel')?.value||'',betonplatten:$('v1044Platten')?.value||'',beschilderung:$('v1044Schild')?.value||'',solar:$('v1044Solar')?.value||'',bevorzugteVariante:$('v1044Preferred')?.value||'1',varianten:variants};
      post(d,data);st.textContent=`Übertragung gestartet: ${variants.length} Varianten = ${variants.length*2} Bilder.`;
    }catch(e){st.textContent='Senden fehlgeschlagen: '+(e.message||e)}finally{btn.disabled=false}
  }

  function clearStorage(){try{Object.keys(localStorage).filter(k=>k.startsWith('tamburi-ar-v10')).forEach(k=>localStorage.removeItem(k));sessionStorage.clear()}catch(e){}}
  function hardReset(d,w){
    originals=[];pendingOriginal=null;clearStorage();
    const original=d.getElementById('v10NewSite');if(original)original.click();
    ['preLocationAddress','photoName','v1044Adresse','v1044Lat','v1044Lon','v1044Montage','v1044Flaeche'].forEach(id=>{const e=d.getElementById(id);if(e)e.value=''});
    const defaults={v1044Grundmodul:'1',v1044Erweiterung:'0',v1044Mittel:'Betonsockel',v1044Platten:'Nein',v1044Schild:'Nein',v1044Solar:'Nein',v1044Preferred:'1',v1044Besichtiger:'Josef Röhrich'};Object.entries(defaults).forEach(([id,val])=>{const e=d.getElementById(id);if(e)e.value=val});
    const date=d.getElementById('v1044Datum');if(date){const n=new Date();date.value=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`}
    const gps=d.getElementById('preLocationGps');if(gps)gps.textContent='';
    const result=d.getElementById('v9Result');if(result)result.classList.remove('show');const resultImg=d.getElementById('v9ResultImg');if(resultImg)resultImg.removeAttribute('src');
    const review=d.getElementById('v98Review');if(review)review.classList.remove('active');const reviewImg=d.getElementById('v98ReviewImg');if(reviewImg)reviewImg.removeAttribute('src');
    const vb=d.getElementById('v10VariantBadges');if(vb)vb.innerHTML='';const count=d.getElementById('v10VariantCount');if(count)count.textContent='0 Aufnahmen für diesen Standort';
    clearStorage();setTimeout(()=>{clearStorage();try{w.location.reload()}catch(e){location.reload()}},120);
  }

  const frame=document.getElementById('app');
  if(frame){frame.addEventListener('load',()=>setTimeout(boot,120));setTimeout(boot,600)}
})();
