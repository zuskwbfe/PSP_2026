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
            <form id="edit-form">
                <label>Клиент (название компании):<input type="text" id="client" name="client" required></label>
                <label>Услуга:<input type="text" id="service" name="service" required></label>
                <label>Менеджер:<input type="text" id="manager" name="manager" required></label>
                <label>Исполнитель:<input type="text" id="executor" name="executor"></label>
                <label>Курьер:<input type="text" id="courier" name="courier"></label>
                <label>Описание заявки:<textarea id="desc" name="desc" rows="3"></textarea></label>
                <label>Оборудование:<input type="text" id="equipment" name="equipment"></label>
                <label>Стоимость:<input type="number" id="cost" name="cost" min="0"></label>
                <label>Приоритет:
                    <select id="priority" name="priority">
                        <option value="1">1 — Низкий</option>
                        <option value="2">2 — Средний</option>
                        <option value="3" selected>3 — Высокий</option>
                    </select>
                </label>
                <label>Статус:
                    <select id="status" name="status">
                        <option value="Новая">Новая</option>
                        <option value="В работе">В работе</option>
                        <option value="Завершена">Завершена</option>
                    </select>
                </label>
                <button type="submit" style="margin-top: 16px; padding: 10px 24px; background: #005bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    ${this.id ? 'Сохранить изменения' : 'Создать заявку'}
                </button>
            </form>
            <div id="form-message" style="margin-top: 12px;"></div>
        `;

        const backButton = new BackButtonComponent(this.parent);
        backButton.render(() => {
            window.location.hash = this.id ? `#card/${this.id}` : '#';
        });

        if (this.id) this.loadData();
        else this.setupFormListeners();
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
                    // Редактирование — PATCH
                    await api.patch(stockUrls.updateStockById(this.id), body);
                    this.showMessage('Заявка успешно обновлена!', 'success');
                    setTimeout(() => { window.location.hash = `#card/${this.id}`; }, 1000);
                } else {
                    // Создание — POST
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
