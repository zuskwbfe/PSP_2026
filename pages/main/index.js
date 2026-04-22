import {RequestCardComponent} from "../../components/request-card/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `<div id="main-page" class="d-flex flex-wrap"></div>`;
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://placehold.co/300x200?text=Доставка",
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
                src: "https://placehold.co/300x200?text=Ремонт",
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
                src: "https://placehold.co/300x200?text=Установка",
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

        import("../product/index.js").then(({RequestPage}) => {
            const requestPage = new RequestPage(this.parent, cardId);
            requestPage.render();
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const data = this.getData();
        data.forEach((item) => {
            const card = new RequestCardComponent(this.pageRoot);
            card.render(item, this.clickCard.bind(this));
        });
    }
}
