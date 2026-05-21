// ЗАМЕНИ ИМПОРТ:
import { api } from "../modules/ajax.js";

import { stockUrls } from "../modules/stockUrls.js";
import { ProductCardComponent } from "../components/ProductCardComponent.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.allData = [];
    }

    // ← ДОБАВЬ async
    async render() {
        this.parent.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                <h2 style="margin:0; color:#111;">Заявки от коллцентра</h2>
                <input type="text" id="search-input" placeholder="Поиск..."
                       style="padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 12px; width: 320px; font-family: inherit;">
            </div>
            <div id="cards-container"></div>
        `;

        this.searchInput = this.parent.querySelector('#search-input');
        this.searchInput.addEventListener('input', () => this.filterCards());

        await this.getData(); // ← await!
    }

    // ← ДОБАВЬ async
    async getData() {
        try {
            const data = await api.get(stockUrls.getStocks()); // ← новый синтаксис
            this.allData = data || [];
            this.filterCards();
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            this.parent.querySelector('#cards-container').innerHTML =
                '<p style="color:#e74c3c;">Ошибка загрузки данных</p>';
        }
    }

    filterCards() {
        const query = this.searchInput.value.toLowerCase().trim();
        const container = this.parent.querySelector('#cards-container');
        container.innerHTML = '';

        const filtered = this.allData.filter(item => {
            const client = (item.client || item.clientName || item.companyName || '').toLowerCase();
            const service = (item.service || item.requestType || '').toLowerCase();
            const desc = (item.desc || item.description || '').toLowerCase();
            return client.includes(query) || service.includes(query) || desc.includes(query);
        });

        if (!filtered.length) {
            container.innerHTML = '<p style="text-align:center; color:#666; margin-top: 40px;">Ничего не найдено.</p>';
            return;
        }

        filtered.forEach(item => {
            const card = new ProductCardComponent(container);
            card.render(item, (id) => { window.location.hash = `#card/${id}`; });
        });
    }
}
