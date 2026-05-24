import"./main-ChF7wEGm.js";import{t as e}from"./galeria-B6UmQMRF.js";var t=document.getElementById(`acti-hero-stories`);t&&e.meses.flatMap(e=>e.fotos).slice(-5).forEach(e=>{let n=document.createElement(`div`);n.className=`acti-hero__story`,n.innerHTML=`<img src="${e}" alt="" loading="lazy" />`,t.appendChild(n)});var n=document.getElementById(`btn-zoom`),r=document.getElementById(`modal-zoom`);if(n&&r){let e=r.querySelector(`.modal__close`),t=r.querySelector(`.modal__backdrop`);function i(){r.classList.add(`is-open`),document.body.style.overflow=`hidden`}function a(){r.classList.remove(`is-open`),document.body.style.overflow=``}n.addEventListener(`click`,i),e.addEventListener(`click`,a),t.addEventListener(`click`,a),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&a()})}function i(e){let t=e.fotos.slice(0,6),n=document.createElement(`div`);return n.className=`ganadores__month-card`,n.setAttribute(`role`,`button`),n.setAttribute(`tabindex`,`0`),n.setAttribute(`aria-label`,`Ver fotos de ${e.nombre}`),n.innerHTML=`
    <div class="ganadores__collage">
      ${t.map(e=>`<div class="ganadores__collage-cell"><img src="${e}" alt="" loading="lazy" /></div>`).join(``)}
    </div>
    <div class="ganadores__month-overlay">
      <span class="ganadores__month-name">${e.nombre}</span>
      <span class="ganadores__month-count">${e.fotos.length} fotos</span>
    </div>
  `,n}function a(){let e=document.createElement(`div`);return e.className=`ganadores__modal`,e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-modal`,`true`),e.innerHTML=`
    <div class="ganadores__modal-backdrop"></div>
    <div class="ganadores__modal-box">

      <!-- Cabecera grid -->
      <div class="ganadores__modal-header">
        <span class="ganadores__modal-title"></span>
        <button class="ganadores__modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Grid de fotos (estilo galería móvil) -->
      <div class="ganadores__photo-grid"></div>

    </div>

    <!-- Visor pantalla completa (encima de todo) -->
    <div class="ganadores__viewer" hidden>
      <button class="ganadores__viewer-close" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="ganadores__viewer-img-wrap">
        <img class="ganadores__viewer-img" src="" alt="" />
      </div>
      <div class="ganadores__viewer-bar">
        <button class="ganadores__viewer-prev" aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="ganadores__viewer-center">
          <span class="ganadores__viewer-counter"></span>
          <a class="ganadores__viewer-download" href="#" download aria-label="Descargar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar
          </a>
        </div>
        <button class="ganadores__viewer-next" aria-label="Siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  `,document.body.appendChild(e),e}var o=null,s=[],c=0;function l(e){s=e.fotos,o.querySelector(`.ganadores__modal-title`).textContent=e.nombre;let t=o.querySelector(`.ganadores__photo-grid`);t.innerHTML=``,e.fotos.forEach((e,n)=>{let r=document.createElement(`button`);r.className=`ganadores__photo-thumb`,r.setAttribute(`aria-label`,`Ver foto ${n+1}`),r.innerHTML=`<img src="${e}" alt="Foto ${n+1}" loading="lazy" />`,r.addEventListener(`click`,()=>d(n)),t.appendChild(r)}),document.body.style.overflow=`hidden`,o.classList.add(`is-open`)}function u(){o.classList.remove(`is-open`),document.body.style.overflow=``}function d(e){c=e;let t=o.querySelector(`.ganadores__viewer`);t.hidden=!1,p()}function f(){let e=o.querySelector(`.ganadores__viewer`);e.hidden=!0}function p(){let e=s[c],t=o.querySelector(`.ganadores__viewer-img`),n=o.querySelector(`.ganadores__viewer-counter`),r=o.querySelector(`.ganadores__viewer-download`),i=o.querySelector(`.ganadores__viewer-prev`),a=o.querySelector(`.ganadores__viewer-next`);t.src=e,t.alt=`Foto ${c+1}`,n.textContent=`${c+1} / ${s.length}`,r.href=e,r.setAttribute(`download`,e.split(`/`).pop()||`foto-${c+1}`),i.disabled=c===0,a.disabled=c===s.length-1}function m(e){let t=c+e;if(t<0||t>=s.length)return;let n=o.querySelector(`.ganadores__viewer-img`);n.style.opacity=`0`,setTimeout(()=>{c=t,p(),n.style.opacity=`1`},120)}function h(){let t=document.getElementById(`ganadores`);if(!t)return;let n=t.querySelector(`.ganadores__months`);if(!n)return;let{meses:r}=e;!r||r.length===0||(r.forEach(e=>{if(!e.fotos.length)return;let t=i(e),r=()=>l(e);t.addEventListener(`click`,r),t.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&r()}),n.appendChild(t)}),o=a(),o.querySelector(`.ganadores__modal-backdrop`).addEventListener(`click`,u),o.querySelector(`.ganadores__modal-close`).addEventListener(`click`,u),o.querySelector(`.ganadores__viewer-close`).addEventListener(`click`,f),o.querySelector(`.ganadores__viewer-prev`).addEventListener(`click`,()=>m(-1)),o.querySelector(`.ganadores__viewer-next`).addEventListener(`click`,()=>m(1)),document.addEventListener(`keydown`,e=>{if(!o.classList.contains(`is-open`))return;let t=!o.querySelector(`.ganadores__viewer`).hidden;e.key===`Escape`&&(t?f():u()),t&&e.key===`ArrowLeft`&&m(-1),t&&e.key===`ArrowRight`&&m(1)}))}h();