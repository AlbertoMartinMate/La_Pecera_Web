import"./main-KXKUqxo2.js";var e=document.getElementById(`btn-zoom`),t=document.getElementById(`modal-zoom`);if(e&&t){let n=t.querySelector(`.modal__close`),r=t.querySelector(`.modal__backdrop`);function i(){t.classList.add(`is-open`),document.body.style.overflow=`hidden`}function a(){t.classList.remove(`is-open`),document.body.style.overflow=``}e.addEventListener(`click`,i),n.addEventListener(`click`,a),r.addEventListener(`click`,a),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&a()})}var n=`deymoyy1z`,r=[{id:`mayo-2025`,label:`Mayo 2025`}];function i(e){return`https://res.cloudinary.com/deymoyy1z/image/upload/q_auto,f_auto,w_600/${e}`}function a(e){return`https://res.cloudinary.com/deymoyy1z/image/upload/${e}`}async function o(e){let t=`https://res.cloudinary.com/${n}/image/list/${e}.json`,r=await fetch(t);if(!r.ok)throw Error(`Error ${r.status}`);return(await r.json()).resources||[]}function s(e,t,n){e.innerHTML=``,r.forEach(({id:r,label:i})=>{let a=document.createElement(`button`);a.className=`ganadores__filter-btn`+(r===t?` is-active`:``),a.textContent=i,a.addEventListener(`click`,()=>n(r)),e.appendChild(a)})}function c(e,t){if(e.innerHTML=``,t.length===0){e.innerHTML=`<p class="ganadores__empty">No hay fotos disponibles para este mes.</p>`;return}t.forEach(t=>{let n=i(t.public_id),r=a(t.public_id),o=t.public_id.split(`/`).pop(),s=document.createElement(`div`);s.className=`ganadores__card`,s.innerHTML=`
      <img src="${n}" alt="Ganador del mes" loading="lazy" />
      <div class="ganadores__card-overlay">
        <a
          class="ganadores__download"
          href="${r}"
          download="${o}.jpg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Descargar foto"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Descargar
        </a>
      </div>
    `,e.appendChild(s)})}function l(e,t=6){e.innerHTML=Array.from({length:t}).map(()=>`<div class="ganadores__card ganadores__card--skeleton"></div>`).join(``)}function u(){let e=document.getElementById(`ganadores`);if(!e)return;let t=e.querySelector(`.ganadores__filters`),n=e.querySelector(`.ganadores__grid`),i=e.querySelector(`.ganadores__error`),a=r[0].id;async function u(e){a=e,s(t,a,u),l(n),i&&(i.hidden=!0);try{c(n,await o(e))}catch(e){n.innerHTML=``,i&&(i.hidden=!1,i.textContent=`No se pudieron cargar las fotos. Inténtalo de nuevo.`),console.error(`[Galería]`,e)}}s(t,a,u),u(a)}u();