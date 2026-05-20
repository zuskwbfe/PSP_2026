import { ajax } from "../modules/ajax.js";
import { stockUrls } from "../modules/stockUrls.js";
import { ProductCardComponent } from "../components/ProductCardComponent.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.pageRoot = document.createElement('div');
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.getData(); // Загружаем данные с API
    }

    getHTML() {
        return `<h2>Заявки от коллцентра мелкого бизнеса</h2>
                <div id="cards-container"></div>`;
    }

    getData() {
        ajax.get(stockUrls.getStocks(), (data) => {
            this.renderData(data);
        });
    }

    renderData(items) {
        const container = this.pageRoot.querySelector('#cards-container');
        container.innerHTML = '';
        items.forEach((item) => {
            const card = new ProductCardComponent(container);
            card.render(item, this.clickCard.bind(this));
        });
    }

    clickCard(id) {
        // Переход на страницу карточки
        window.location.hash = `#card/${id}`;
    }
}
