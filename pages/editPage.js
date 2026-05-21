import { api } from "../modules/ajax.js";  // ← замени ajax на api
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
                <label>Название компании:<input type="text" id="company-name" name="companyName" required></label>
                <label>Контактное лицо:<input type="text" id="contact-person" name="contactPerson" required></label>
                <label>Телефон:<input type="tel" id="phone" name="phone" required></label>
                <label>Email:<input type="email" id="email" name="email"></label>
                <label>Описание заявки:<textarea id="description" name="description" rows="3"></textarea></label>
                <label>Статус:
                    <select id="status" name="status">
                        <option value="new">Новая</option>
                        <option value="in-progress">В работе</option>
                        <option value="resolved">Решена</option>
                        <option value="closed">Закрыта</option>
                    </select>
                </label>
                <div class="form-hint">💡 Сохранение появится в следующей лабораторной</div>
            </form>
        `;

        const backButton = new BackButtonComponent(this.parent);
        backButton.render(() => {
            window.location.hash = this.id ? `#card/${this.id}` : '#';
        });

        if (this.id) this.loadData();
        else this.setupFormListeners();
    }

    async loadData() {  // ← async
        try {
            const data = await api.get(stockUrls.getStockById(this.id)); // ← await
            if (data) this.fillForm(data);
            this.setupFormListeners();
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }

    fillForm(data) {
        const f = this.parent.querySelector('#edit-form');
        if (!f) return;
        f.querySelector('#company-name').value = data.companyName || data.client || '';
        f.querySelector('#contact-person').value = data.contactPerson || data.manager || '';
        f.querySelector('#phone').value = data.phone || '';
        f.querySelector('#email').value = data.email || '';
        f.querySelector('#description').value = data.description || data.desc || '';
        f.querySelector('#status').value = data.status || 'new';
    }

    setupFormListeners() {
        const form = this.parent.querySelector('#edit-form');
        if (!form) return;
        form.addEventListener('input', (e) => console.log('Изменение:', e.target.name));
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Сохранение будет в следующей лабораторной');
        });
    }
}
