import { ajax } from "../modules/ajax.js";
import { stockUrls } from "../modules/stockUrls.js";
import { ProductCardComponent } from "../components/ProductCardComponent.js";
import { BackButtonComponent } from "../components/BackButtonComponent.js";

export class CardPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.pageRoot = document.createElement('div');
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }

    getHTML() {
        return `<div id="card-detail"></div>`;
    }

    getData() {
        ajax.get(stockUrls.getStockById(this.id), (data) => {
            this.renderData(data);
        });
    }

    renderData(item) {
        const container = this.pageRoot.querySelector('#card-detail');
        container.innerHTML = '';
        const card = new ProductCardComponent(container);
        card.render(item); // Отображаем в режиме просмотра
    }

    clickBack() {
        window.location.hash = '#';
    }
}
