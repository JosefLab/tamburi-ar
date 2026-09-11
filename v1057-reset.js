// Tamburi AR v10.59 loader – Hard Reset bleibt erhalten, neuer 2-Foto-Ablauf wird ergänzt
(function(){
 function loadFlow(){if(document.getElementById('v1059FlowScript'))return;const s=document.createElement('script');s.id='v1059FlowScript';s.src='v1059-flow.js?v=1059';document.head.appendChild(s)}
 function markVersion(){const frame=document.getElementById('app');if(!frame||!frame.contentDocument)return;const d=frame.contentDocument;const v=d.querySelector('header h1 span');if(v)v.textContent='v10.59';d.title='Tamburi Standort AR v10.59'}
 const frame=document.getElementById('app');if(frame)frame.addEventListener('load',()=>setTimeout(markVersion,180));setTimeout(markVersion,700);loadFlow();
})();
