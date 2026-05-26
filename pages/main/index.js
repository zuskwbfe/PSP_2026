import { RequestCardComponent } from "../../components/request-card/index.js";
import { HeaderComponent } from "../../components/header/index.js";
import { RequestPage } from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `<div id="main-page" class="container mt-4">
                    <div class="row" id="cards-row"></div>
                </div>`;
    }

    getData() {
        return [
            {
                id: 1,
                src: "images/cafe.png",
                client: "Кофейня «Уголок»",
                service: "Доставка расходников",
                manager: "Смирнова О.А.",
                executor: "Петров И.В.",
                courier: "Кузнецов С.С.",
                status: "Новая",
                desc: "Привезти молоко, сиропы и стаканы до 12:00"
            },
            {
                id: 2,
                src: "images/salon.png",
                client: "Салон «Локон»",
                service: "Ремонт оборудования",
                manager: "Иванова М.П.",
                executor: "Сидоров А.А.",
                courier: "—",
                status: "В работе",
                desc: "Настройка и ремонт профессионального фена Dyson"
            },
            {
                id: 3,
                src: "images/flowers.png",
                client: "Магазин «Цветы»",
                service: "Установка кассы",
                manager: "Козлова Е.В.",
                executor: "Морозов Д.К.",
                courier: "Лебедев П.Р.",
                status: "Завершена",
                desc: "Подключение онлайн-кассы под маркировку продукции"
            }
        ];
    }

    clickCard(e) {
        const cardId = e.currentTarget.dataset.id;
        import("../product/index.js").then(({ RequestPage }) => {
            const requestPage = new RequestPage(this.parent, cardId);
            requestPage.render();
        });
    }

    goHome() {
        this.render();
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        header.render({ activeLink: 'requests', onHome: this.goHome.bind(this) });
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const cardsRow = document.getElementById('cards-row');
        const data = this.getData();
        data.forEach((item) => {
            const card = new RequestCardComponent(cardsRow);
            card.render(item, this.clickCard.bind(this));
        });
    }
}
