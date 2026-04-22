export class RequestCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const statusColor = data.status === 'Новая' ? 'primary' :
                            data.status === 'В работе' ? 'warning' : 'success';

        return `
            <div class="m-2" style="width: 300px;">
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between">
                        <strong>👤 ${data.client}</strong>
                        <span class="badge bg-${statusColor}">${data.status}</span>
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
