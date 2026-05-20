import { ajax } from "../modules/ajax.js";
import { stockUrls } from "../modules/stockUrls.js";
import { BackButtonComponent } from "../components/BackButtonComponent.js";

export class EditPage {
    constructor(parent, id = null) {
        this.parent = parent;
        this.id = id; // Если null — режим добавления, иначе — редактирование
        this.pageRoot = document.createElement('div');
        this.formData = {};
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        // Если редактирование — загружаем данные
        if (this.id) {
            this.loadData();
        } else {
            this.setupFormListeners(); // Для режима добавления
        }
    }

    getHTML() {
        return `
            <h2>${this.id ? 'Редактирование заявки' : 'Новая заявка'}</h2>
            <form id="edit-form">
                <label>
                    Название компании:
                    <input type="text" id="company-name" name="companyName" required>
                </label>
                <label>
                    Контактное лицо:
                    <input type="text" id="contact-person" name="contactPerson" required>
                </label>
                <label>
                    Телефон:
                    <input type="tel" id="phone" name="phone" required>
                </label>
                <label>
                    Email:
                    <input type="email" id="email" name="email">
                </label>
                <label>
                    Описание заявки:
                    <textarea id="description" name="description" rows="4"></textarea>
                </label>
                <label>
                    Статус:
                    <select id="status" name="status">
                        <option value="new">Новая</option>
                        <option value="in-progress">В работе</option>
                        <option value="resolved">Решена</option>
                        <option value="closed">Закрыта</option>
                    </select>
                </label>
                <!-- Кнопка Сохранить появится в ЛР №6 -->
                <!-- <button type="submit">Сохранить</button> -->
            </form>
        `;
    }

    loadData() {
        ajax.get(stockUrls.getStockById(this.id), (data) => {
            this.fillForm(data);
            this.setupFormListeners();
        });
    }

    fillForm(data) {
        document.getElementById('company-name').value = data.companyName || '';
        document.getElementById('contact-person').value = data.contactPerson || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('status').value = data.status || 'new';
    }

    setupFormListeners() {
        const form = this.pageRoot.querySelector('#edit-form');
        form.addEventListener('input', (e) => {
            // Сохраняем введённые данные в formData (но не отправляем!)
            this.formData[e.target.name] = e.target.value;
            console.log('Изменено поле:', e.target.name, '=', e.target.value);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Функция сохранения будет доступна в следующей лабораторной работе!');
        });
    }

    clickBack() {
        window.location.hash = this.id ? `#card/${this.id}` : '#';
    }
}
