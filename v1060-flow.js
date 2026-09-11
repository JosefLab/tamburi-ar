// Tamburi AR v10.60 – eine Datenquelle fuer Original/Rendering-Paare
(function(){
 const WEBAPP='https://script.google.com/macros/s/AKfycby9N5ZygYPfmUNHYnCaO0lFTsXJ86G0Xq3BEsf8qJv0LD72ckeMOIobFGGMJk2WMK-24g/exec';
 let photos=[];
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const badges=d=>[...d.querySelectorAll('#v10VariantBadges .v10Badge')];
 function boot(){
  const f=document.getElementById('app'),d=f?.contentDocument;if(!d)return;
  const v=d.querySelector('header h1 span');if(v)v.textContent='v10.60';d.title='Tamburi Standort AR v10.60';
  const alt=d.getElementById('v10Alternative');if(alt)alt.style.display='none';
  const send=d.getElementById('v1044Send');if(send){send.onclick=null;send.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();sendData(d)},true)}
  const confirm=d.getElementById('v98Confirm');if(confirm)confirm.addEventListener('click',()=>setTimeout(()=>{const bs=badges(d);const i=bs.length-1;if(i>=0){bs[i].click();setTimeout(async()=>{const src=d.getElementById('v9ResultImg')?.src;if(src){try{photos[i]=await (await fetch(src)).blob()}catch(e){} render(d)}},60)}},100),true);
  const del=d.getElementById('v101Delete');if(del)del.addEventListener('click',()=>{const i=badges(d).findIndex(x=>x.classList.contains('active'));setTimeout(()=>{if(i>=0)photos.splice(i,1);render(d)},80)},true);
  const reset=d.getElementById('v1057NewSite');if(reset)reset.addEventListener('click',()=>{photos=[];setTimeout(()=>render(d),200)},true);
  const box=d.getElementById('v10VariantBadges');if(box)new MutationObserver(()=>render(d)).observe(box,{childList:true});
  setInterval(()=>render(d),1200);render(d);
 }
 function render(d){
  const n=badges(d).length,c=d.getElementById('v1056Check'),count=d.getElementById('v10VariantCount');
  if(count){const complete=Math.floor(n/2),open=n%2;count.textContent=open?`${complete+1} Aufstellvarianten · ${n} Fotos · V${complete+1}: Rendering fehlt`:`${complete} Aufstellvariante${complete===1?'':'n'} · ${n} Fotos`}
  if(!c)return;
  if(!n){c.className='v1056warn';c.textContent='⚠ Noch keine Aufstellvariante aufgenommen.';return}
  if(n%2){c.className='v1056warn';c.textContent=`⚠ V${Math.ceil(n/2)}: Rendering fehlt. Nächste Aufnahme = Rendering.`;return}
  const missing=[];for(let i=0;i<n;i++)if(!photos[i])missing.push(i+1);
  if(missing.length){c.className='v1056warn';c.textContent='⚠ Fotos werden noch verarbeitet …';return}
  c.className='v1056ok';c.textContent=`✓ ${n/2} Aufstellvariante${n===2?'':'n'} komplett = ${n} Fotos.`;
 }
 async function b64(blob){return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(blob)})}
 function coord(v){const n=Number(String(v||'').replace(',','.'));return Number.isFinite(n)?n.toFixed(8):''}
 async function collect(d){
  const bs=badges(d),n=bs.length;if(!n)throw new Error('Keine Aufstellvariante vorhanden.');if(n%2)throw new Error(`V${Math.ceil(n/2)} ist unvollständig: Rendering fehlt.`);
  for(let i=0;i<n;i++)if(!photos[i]){bs[i].click();await sleep(100);const src=d.getElementById('v9ResultImg')?.src;if(!src)throw new Error(`Foto ${i+1} fehlt.`);photos[i]=await (await fetch(src)).blob()}
  const out=[];for(let i=0;i<n;i+=2){out.push({originalVariant:i/2+1,originalBase64:await b64(photos[i]),originalMimeType:photos[i].type||'image/jpeg',renderingBase64:await b64(photos[i+1]),renderingMimeType:photos[i+1].type||'image/jpeg'})}
  const fav=Math.min(Number(d.getElementById('v1044Preferred')?.value||1),out.length);return out.sort((a,b)=>(a.originalVariant===fav?-1:b.originalVariant===fav?1:a.originalVariant-b.originalVariant)).map((x,i)=>({...x,position:i+1,favorit:i===0}));
 }
 function post(d,data){let t=d.getElementById('v1060Post');if(!t){t=d.createElement('iframe');t.id='v1060Post';t.name='v1060Post';t.style.display='none';d.body.appendChild(t)}const f=d.createElement('form');f.method='POST';f.action=WEBAPP;f.target='v1060Post';f.style.display='none';const x=d.createElement('input');x.type='hidden';x.name='payload';x.value=JSON.stringify(data);f.appendChild(x);d.body.appendChild(f);f.submit();setTimeout(()=>f.remove(),1500)}
 async function sendData(d){
  const $=id=>d.getElementById(id),st=$('v1044SheetStatus'),btn=$('v1044Send'),address=$('v1044Adresse')?.value.trim()||'';if(!address){st.textContent='Bitte zuerst eine Adresse eintragen.';return}const lat=coord($('v1044Lat')?.value),lon=coord($('v1044Lon')?.value);if(!lat||!lon){st.textContent='Bitte gültige GPS-Koordinaten eintragen.';return}
  btn.disabled=true;try{st.textContent='Aufstellvarianten werden vorbereitet …';const variants=await collect(d);const data={adresse:address,latitude:"'"+lat,longitude:"'"+lon,montagebeschreibung:$('v1044Montage')?.value.trim()||'',grundmodul:$('v1044Grundmodul')?.value||'1',erweiterungskaesten:$('v1044Erweiterung')?.value||'0',montageflaeche:$('v1044Flaeche')?.value.trim()||'',besichtigtAm:$('v1044Datum')?.value||'',besichtigtVon:$('v1044Besichtiger')?.value.trim()||'',montagemittel:$('v1044Mittel')?.value||'',betonplatten:$('v1044Platten')?.value||'',beschilderung:$('v1044Schild')?.value||'',solar:$('v1044Solar')?.value||'',bevorzugteVariante:String(Math.min(Number($('v1044Preferred')?.value||1),variants.length)),varianten:variants};post(d,data);st.textContent=`Übertragung gestartet: ${variants.length} Aufstellvarianten = ${variants.length*2} Fotos.`}catch(e){st.textContent='Senden fehlgeschlagen: '+(e.message||e)}finally{btn.disabled=false}
 }
 const f=document.getElementById('app');if(f){f.addEventListener('load',()=>setTimeout(boot,300));setTimeout(boot,900)}
})();