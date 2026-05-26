export class RequestCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const statusClass = data.status === 'Новая' ? 'badge-status-new' :
                            data.status === 'В работе' ? 'badge-status-work' : 'badge-status-done';
        const imageUrl = data.src || "https://placehold.co/300x160?text=Нет+фото";

        return `
            <div class="col-12 col-sm-4 mb-4">
                <div class="card h-100">
                    <img src="${imageUrl}" class="card-img-top" alt="Фото заявки"
                        style="height: 160px; object-fit: cover;">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <strong>👤 ${data.client}</strong>
                        <span class="badge ${statusClass}">${data.status}</span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="card-text mb-1">🛠 <strong>Услуга:</strong> ${data.service}</p>
                        <p class="card-text small text-muted mb-1">👨‍💼 Менеджер: ${data.manager}</p>
                        <p class="card-text small text-muted">🚚 Курьер: ${data.courier}</p>
                        <button class="btn btn-primary mt-auto" id="click-card-${data.id}" data-id="${data.id}">
                            Открыть заявку
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    addListeners(data, listener) {
        const button = document.getElementById(`click-card-${data.id}`);
        if (button) button.addEventListener("click", listener);
    }

    render(data, listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, listener);
    }
}
