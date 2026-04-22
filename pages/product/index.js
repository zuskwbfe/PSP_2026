import {RequestDetailComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";

export class RequestPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div id="product-page" class="container mt-4">
                <div class="mb-3" id="back-button-container"></div>
                <div id="product-content"></div>
            </div>
        `;
    }

    getData() {
        const requests = [
            { id: 1, src: "https://placehold.co/300x200?text=Доставка", client: "Кофейня «Уголок»", service: "Доставка расходников", manager: "Смирнова О.А.", executor: "Петров И.В.", courier: "Кузнецов С.С.", status: "Новая", desc: "Привезти молоко, сиропы и стаканы до 12:00. Оставить на ресепшене." },
            { id: 2, src: "https://placehold.co/300x200?text=Ремонт", client: "Салон «Локон»", service: "Ремонт оборудования", manager: "Иванова М.П.", executor: "Сидоров А.А.", courier: "—", status: "В работе", desc: "Диагностика фена Dyson, замена нагревательного элемента. Клиент ждёт на месте." },
            { id: 3, src: "https://placehold.co/300x200?text=Установка", client: "Магазин «Цветы»", service: "Установка кассы", manager: "Козлова Е.В.", executor: "Морозов Д.К.", courier: "Лебедев П.Р.", status: "Завершена", desc: "Подключение онлайн-кассы, регистрация в ФНС, инструктаж персонала." }
        ];
        return requests.find(r => r.id == this.id);
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const backButton = new BackButtonComponent(document.getElementById('back-button-container'));
        backButton.render(this.clickBack.bind(this));

        const data = this.getData();
        const detail = new RequestDetailComponent(document.getElementById('product-content'));
        detail.render(data);
    }
}
