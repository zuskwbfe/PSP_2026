(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const l={async get(s){const e=await fetch(s);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()},async post(s,e){const t=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()},async patch(s,e){const t=await fetch(s,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()},async delete(s){const e=await fetch(s,{method:"DELETE"});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return e.status===204?null:await e.json()}};class ${constructor(){this.baseUrl=""}getStocks(){return`${this.baseUrl}/tickets`}getStockById(e){return`${this.baseUrl}/tickets/${e}`}createStock(){return`${this.baseUrl}/tickets`}removeStockById(e){return`${this.baseUrl}/tickets/${e}`}updateStockById(e){return`${this.baseUrl}/tickets/${e}`}}const d=new $;class f{constructor(e){this.root=e,this.element=document.createElement("div"),this.element.classList.add("product-card"),this.root.appendChild(this.element)}render(e,t){const o=e.id||e._id||Math.random().toString(36).slice(2),r=e.client||e.clientName||e.companyName||"Клиент не указан",i=e.service||e.requestType||"Услуга не указана",n=e.manager||"Не назначен",a=e.status||"new",u=e.priority||"medium",h=e.cost||e.amount||0,y=e.desc||e.description||"",w={new:"Новая","in-progress":"В работе",resolved:"Решена",closed:"Закрыта",pending:"Ожидает"},x={low:"Низкий",medium:"Средний",high:"Высокий",urgent:"Срочный"};this.element.innerHTML=`
            <div class="card-header">
                <h3 class="card-title">${r}</h3>
                <span class="card-id">ID: ${o}</span>
            </div>
            <div class="card-body">
                <p><strong>Услуга:</strong> ${i}</p>
                <p><strong>Менеджер:</strong> ${n}</p>
                <p><strong>Статус:</strong> <span class="badge status-${a}">${w[a]||a}</span></p>
                <p><strong>Приоритет:</strong> <span class="badge priority-${u}">${x[u]||u}</span></p>
                <p><strong>Сумма:</strong> ${h?Number(h).toLocaleString("ru-RU")+" ₽":"—"}</p>
                ${y?`<p class="card-desc"><strong>Описание:</strong> ${y}</p>`:""}
            </div>
            <div class="card-actions">
                <button type="button" class="btn btn-view" data-id="${o}">Просмотр</button>
                <button type="button" class="btn btn-edit" data-id="${o}">Редактировать</button>
            </div>
        `;const v=this.element.querySelector(".btn-view"),S=this.element.querySelector(".btn-edit");v.addEventListener("click",c=>{c.stopPropagation(),window.location.hash=`#card/${o}`}),S.addEventListener("click",c=>{c.stopPropagation(),window.location.hash=`#edit/${o}`}),t&&typeof t=="function"&&this.element.addEventListener("click",c=>{c.target.closest(".card-actions")||t(o)})}}class q{constructor(e){this.parent=e,this.allData=[]}async render(){this.parent.innerHTML=`
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                <h2 style="margin:0; color:#111;">Заявки от коллцентра</h2>
                <input type="text" id="search-input" placeholder="Поиск..."
                       style="padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; width: 320px; font-family: inherit;">
            </div>
            <div id="cards-container"></div>
        `,this.searchInput=this.parent.querySelector("#search-input"),this.searchInput.addEventListener("input",()=>this.filterCards()),await this.getData()}async getData(){try{const e=await l.get(d.getStocks());this.allData=e||[],this.filterCards()}catch(e){console.error("Ошибка загрузки:",e),this.parent.querySelector("#cards-container").innerHTML='<p style="color:#e74c3c;">Ошибка загрузки данных</p>'}}filterCards(){const e=this.searchInput.value.toLowerCase().trim(),t=this.parent.querySelector("#cards-container");t.innerHTML="";const o=this.allData.filter(r=>{const i=(r.client||r.clientName||r.companyName||"").toLowerCase(),n=(r.service||r.requestType||"").toLowerCase(),a=(r.desc||r.description||"").toLowerCase();return i.includes(e)||n.includes(e)||a.includes(e)});if(!o.length){t.innerHTML='<p style="text-align:center; color:#666; margin-top: 40px;">Ничего не найдено.</p>';return}o.forEach(r=>{new f(t).render(r,n=>{window.location.hash=`#card/${n}`})})}}class g{constructor(e){this.root=e,this.button=document.createElement("button"),this.button.className="back-button",this.button.textContent="← Назад",this.button.type="button",this.root.appendChild(this.button)}render(e){this.button.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),e&&typeof e=="function"?e():window.location.hash="#"})}}class L{constructor(e,t){this.parent=e,this.id=t}async render(){this.parent.innerHTML='<h2 style="margin-bottom:20px; color:#111;">Просмотр заявки</h2>',new g(this.parent).render(()=>{window.location.hash="#"});try{const t=await l.get(d.getStockById(this.id));if(!t){this.parent.insertAdjacentHTML("beforeend",'<p style="color:#666;">Заявка не найдена.</p>');return}new f(this.parent).render(t,r=>{window.location.hash=`#edit/${r}`})}catch(t){console.error("Ошибка загрузки карточки:",t),this.parent.insertAdjacentHTML("beforeend",'<p style="color:#e74c3c;">Ошибка загрузки</p>')}}}class m{constructor(e,t=null){this.parent=e,this.id=t}render(){this.parent.innerHTML=`
            <h2 style="margin-bottom: 20px; color: #111;">${this.id?"Редактирование заявки":"Новая заявка"}</h2>
            <form id="edit-form" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                max-width: 800px;
            ">
                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Клиент <span style="color:#e74c3c;">*</span>
                    <input type="text" id="client" name="client" required placeholder="Название компании"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Услуга <span style="color:#e74c3c;">*</span>
                    <input type="text" id="service" name="service" required placeholder="Тип услуги"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Менеджер <span style="color:#e74c3c;">*</span>
                    <input type="text" id="manager" name="manager" required placeholder="ФИО менеджера"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Исполнитель
                    <input type="text" id="executor" name="executor" placeholder="ФИО исполнителя"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Курьер
                    <input type="text" id="courier" name="courier" placeholder="ФИО курьера"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Оборудование
                    <input type="text" id="equipment" name="equipment" placeholder="Тип оборудования"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Стоимость (₽)
                    <input type="number" id="cost" name="cost" min="0" placeholder="0"
                        style="${this.inputStyle()}">
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Приоритет
                    <select id="priority" name="priority" style="${this.inputStyle()}">
                        <option value="1">1 — Низкий</option>
                        <option value="2">2 — Средний</option>
                        <option value="3" selected>3 — Высокий</option>
                    </select>
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151;">
                    Статус
                    <select id="status" name="status" style="${this.inputStyle()}">
                        <option value="Новая">Новая</option>
                        <option value="В работе">В работе</option>
                        <option value="Завершена">Завершена</option>
                    </select>
                </label>

                <label style="display:flex; flex-direction:column; gap:6px; font-size:0.9rem; color:#374151; grid-column: 1 / -1;">
                    Описание заявки
                    <textarea id="desc" name="desc" rows="3" placeholder="Подробное описание..."
                        style="${this.inputStyle()} resize:vertical;"></textarea>
                </label>

                <div style="grid-column: 1 / -1; display:flex; align-items:center; gap:16px; margin-top:8px;">
                    <button type="submit" style="
                        padding: 10px 28px;
                        background: #005bff;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                        font-family: inherit;
                        transition: filter 0.2s;
                    " onmouseover="this.style.filter='brightness(110%)'"
                       onmouseout="this.style.filter='brightness(100%)'">
                        ${this.id?"Сохранить изменения":"Создать заявку"}
                    </button>
                    <div id="form-message" style="font-size:0.9rem;"></div>
                </div>
            </form>
        `,new g(this.parent).render(()=>{window.location.hash=this.id?`#card/${this.id}`:"#"}),this.id?this.loadData():this.setupFormListeners()}inputStyle(){return`
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
            width: 100%;
            box-sizing: border-box;
        `}async loadData(){try{const e=await l.get(d.getStockById(this.id));e&&this.fillForm(e),this.setupFormListeners()}catch(e){console.error("Ошибка загрузки данных:",e),this.showMessage("Ошибка загрузки данных","error")}}fillForm(e){const t=this.parent.querySelector("#edit-form");t&&(t.querySelector("#client").value=e.client||"",t.querySelector("#service").value=e.service||"",t.querySelector("#manager").value=e.manager||"",t.querySelector("#executor").value=e.executor||"",t.querySelector("#courier").value=e.courier||"",t.querySelector("#desc").value=e.desc||"",t.querySelector("#equipment").value=e.equipment||"",t.querySelector("#cost").value=e.cost||0,t.querySelector("#priority").value=e.priority||3,t.querySelector("#status").value=e.status||"Новая")}setupFormListeners(){const e=this.parent.querySelector("#edit-form");e&&(e.querySelectorAll("input, select, textarea").forEach(t=>{t.addEventListener("focus",()=>t.style.borderColor="#005bff"),t.addEventListener("blur",()=>t.style.borderColor="#d1d5db")}),e.addEventListener("submit",async t=>{t.preventDefault();const o={client:e.querySelector("#client").value.trim(),service:e.querySelector("#service").value.trim(),manager:e.querySelector("#manager").value.trim(),executor:e.querySelector("#executor").value.trim()||"—",courier:e.querySelector("#courier").value.trim()||"—",desc:e.querySelector("#desc").value.trim()||"",equipment:e.querySelector("#equipment").value.trim()||"—",cost:Number(e.querySelector("#cost").value)||0,priority:Number(e.querySelector("#priority").value),status:e.querySelector("#status").value};try{if(this.id)await l.patch(d.updateStockById(this.id),o),this.showMessage("Заявка успешно обновлена!","success"),setTimeout(()=>{window.location.hash=`#card/${this.id}`},1e3);else{const r=await l.post(d.createStock(),o);this.showMessage("Заявка успешно создана!","success"),setTimeout(()=>{window.location.hash=`#card/${r.id}`},1e3)}}catch(r){console.error("Ошибка сохранения:",r),this.showMessage("Ошибка при сохранении заявки","error")}}))}showMessage(e,t){const o=this.parent.querySelector("#form-message");o&&(o.textContent=e,o.style.color=t==="success"?"#00a6a6":"#e74c3c")}}const p=document.getElementById("root");function b(s){if(!s||s==="#")new q(p).render();else if(s.startsWith("#card/")){const e=s.split("/")[1];new L(p,e).render()}else if(s.startsWith("#edit/")){const e=s.split("/")[1];new m(p,e).render()}else s==="#add"&&new m(p,null).render()}window.addEventListener("hashchange",()=>{b(window.location.hash)});b(window.location.hash);
