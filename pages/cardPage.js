import { api } from "../modules/ajax.js";  // ← замени ajax на api
import { stockUrls } from "../modules/stockUrls.js";
import { ProductCardComponent } from "../components/ProductCardComponent.js";
import { BackButtonComponent } from "../components/BackButtonComponent.js";

export class CardPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    async render() {  // ← async
        this.parent.innerHTML = '<h2 style="margin-bottom:20px; color:#111;">Просмотр заявки</h2>';

        const backButton = new BackButtonComponent(this.parent);
        backButton.render(() => { window.location.hash = '#'; });

        try {
            const data = await api.get(stockUrls.getStockById(this.id)); // ← await
            if (!data) {
                this.parent.insertAdjacentHTML('beforeend', '<p style="color:#666;">Заявка не найдена.</p>');
                return;
            }
            const card = new ProductCardComponent(this.parent);
            card.render(data, (id) => { window.location.hash = `#edit/${id}`; });
        } catch (e) {
            console.error('Ошибка загрузки карточки:', e);
            this.parent.insertAdjacentHTML('beforeend', '<p style="color:#e74c3c;">Ошибка загрузки</p>');
        }
    }
}
