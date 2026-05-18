import"./main-KXKUqxo2.js";var e=document.getElementById(`btn-zoom`),t=document.getElementById(`modal-zoom`);if(e&&t){let n=t.querySelector(`.modal__close`),r=t.querySelector(`.modal__backdrop`);function i(){t.classList.add(`is-open`),document.body.style.overflow=`hidden`}function a(){t.classList.remove(`is-open`),document.body.style.overflow=``}e.addEventListener(`click`,i),n.addEventListener(`click`,a),r.addEventListener(`click`,a),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&a()})}var n={meses:[{nombre:`Mayo 2025`,slug:`mayo-2025`,fotos:[`https://res.cloudinary.com/deymoyy1z/image/upload/q_auto,f_auto/v1779120431/WhatsApp_Image_2026-05-18_at_18.01.18_iu1jhk.jpg`]}]};function r(e,t,n,r){e.innerHTML=``,t.forEach(({nombre:t,slug:i})=>{let a=document.createElement(`button`);a.className=`ganadores__filter-btn`+(i===n?` is-active`:``),a.textContent=t,a.addEventListener(`click`,()=>r(i)),e.appendChild(a)})}function i(e,t){if(e.innerHTML=``,!t||t.length===0){e.innerHTML=`<p class="ganadores__empty">No hay fotos disponibles para este mes.</p>`;return}t.forEach((t,n)=>{let r=t.split(`/`).pop().split(`?`)[0]||`foto-${n+1}`,i=document.createElement(`div`);i.className=`ganadores__card`,i.innerHTML=`
      <img src="${t}" alt="Foto ganadores mes ${n+1}" loading="lazy" />
      <div class="ganadores__card-overlay">
        <a
          class="ganadores__download"
          href="${t}"
          download="${r}"
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
    `,e.appendChild(i)})}function a(){let e=document.getElementById(`ganadores`);if(!e)return;let t=e.querySelector(`.ganadores__filters`),a=e.querySelector(`.ganadores__grid`),{meses:o}=n;if(!o||o.length===0){a.innerHTML=`<p class="ganadores__empty">No hay meses disponibles.</p>`;return}let s=o[0].slug;function c(e){s=e,r(t,o,s,c);let n=o.find(t=>t.slug===e);i(a,n?n.fotos:[])}c(s)}a();