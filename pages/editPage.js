import { api } from "../modules/ajax.js";
import { stockUrls } from "../modules/stockUrls.js";
import { BackButtonComponent } from "../components/BackButtonComponent.js";

export class EditPage {
    constructor(parent, id = null) {
        this.parent = parent;
        this.id = id;
    }

    render() {
        this.parent.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #111;">${this.id ? 'Редактирование заявки' : 'Новая заявка'}</h2>
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
                        ${this.id ? 'Сохранить изменения' : 'Создать заявку'}
                    </button>
                    <div id="form-message" style="font-size:0.9rem;"></div>
                </div>
            </form>
        `;

        const backButton = new BackButtonComponent(this.parent);
        backButton.render(() => {
            window.location.hash = this.id ? `#card/${this.id}` : '#';
        });

        if (this.id) this.loadData();
        else this.setupFormListeners();
    }

    inputStyle() {
        return `
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
            width: 100%;
            box-sizing: border-box;
        `;
    }

    async loadData() {
        try {
            const data = await api.get(stockUrls.getStockById(this.id));
            if (data) this.fillForm(data);
            this.setupFormListeners();
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            this.showMessage('Ошибка загрузки данных', 'error');
        }
    }

    fillForm(data) {
        const f = this.parent.querySelector('#edit-form');
        if (!f) return;
        f.querySelector('#client').value    = data.client    || '';
        f.querySelector('#service').value   = data.service   || '';
        f.querySelector('#manager').value   = data.manager   || '';
        f.querySelector('#executor').value  = data.executor  || '';
        f.querySelector('#courier').value   = data.courier   || '';
        f.querySelector('#desc').value      = data.desc      || '';
        f.querySelector('#equipment').value = data.equipment || '';
        f.querySelector('#cost').value      = data.cost      || 0;
        f.querySelector('#priority').value  = data.priority  || 3;
        f.querySelector('#status').value    = data.status    || 'Новая';
    }

    setupFormListeners() {
        const form = this.parent.querySelector('#edit-form');
        if (!form) return;

        // Подсветка полей при фокусе
        form.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('focus', () => el.style.borderColor = '#005bff');
            el.addEventListener('blur',  () => el.style.borderColor = '#d1d5db');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const body = {
                client:    form.querySelector('#client').value.trim(),
                service:   form.querySelector('#service').value.trim(),
                manager:   form.querySelector('#manager').value.trim(),
                executor:  form.querySelector('#executor').value.trim()  || '—',
                courier:   form.querySelector('#courier').value.trim()   || '—',
                desc:      form.querySelector('#desc').value.trim()      || '',
                equipment: form.querySelector('#equipment').value.trim() || '—',
                cost:      Number(form.querySelector('#cost').value)     || 0,
                priority:  Number(form.querySelector('#priority').value),
                status:    form.querySelector('#status').value,
            };

            try {
                if (this.id) {
                    await api.patch(stockUrls.updateStockById(this.id), body);
                    this.showMessage('Заявка успешно обновлена!', 'success');
                    setTimeout(() => { window.location.hash = `#card/${this.id}`; }, 1000);
                } else {
                    const created = await api.post(stockUrls.createStock(), body);
                    this.showMessage('Заявка успешно создана!', 'success');
                    setTimeout(() => { window.location.hash = `#card/${created.id}`; }, 1000);
                }
            } catch (err) {
                console.error('Ошибка сохранения:', err);
                this.showMessage('Ошибка при сохранении заявки', 'error');
            }
        });
    }

    showMessage(text, type) {
        const msg = this.parent.querySelector('#form-message');
        if (!msg) return;
        msg.textContent = text;
        msg.style.color = type === 'success' ? '#00a6a6' : '#e74c3c';
    }
}
