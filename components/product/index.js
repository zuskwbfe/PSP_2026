export class RequestDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <h3 class="card-title mb-3">📋 Заявка #${data.id}</h3>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p class="mb-1"><strong>👤 Клиент:</strong> ${data.client}</p>
                            <p class="mb-1"><strong>🛠 Услуга:</strong> ${data.service}</p>
                            <p class="mb-1"><strong>📝 Описание:</strong> ${data.desc}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong>👨‍💼 Создал менеджер:</strong> ${data.manager}</p>
                            <p class="mb-1"><strong>🔧 Исполнитель:</strong> ${data.executor}</p>
                            <p class="mb-1"><strong>🚚 Курьер:</strong> ${data.courier}</p>
                        </div>
                    </div>

                    <hr>
                    <p class="text-muted mb-3">Статус: <span class="badge bg-primary">${data.status}</span></p>
                    <button class="btn btn-success">✅ Подтвердить выполнение</button>
                    <button class="btn btn-outline-secondary ms-2">📞 Связаться с менеджером</button>
                </div>
            </div>
        `;
    }

    render(data) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    }
}
