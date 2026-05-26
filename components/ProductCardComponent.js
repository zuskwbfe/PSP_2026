// components/ProductCardComponent.js
export class ProductCardComponent {
    constructor(root) {
        this.root = root;
        this.element = document.createElement('div');
        this.element.classList.add('product-card');
        this.root.appendChild(this.element);
    }

    render(data, onClick) {
        const id = data.id || data._id || Math.random().toString(36).slice(2);
        const client = data.client || data.clientName || data.companyName || 'Клиент не указан';
        const service = data.service || data.requestType || 'Услуга не указана';
        const manager = data.manager || 'Не назначен';
        const status = data.status || 'new';
        const priority = data.priority || 'medium';
        const cost = data.cost || data.amount || 0;
        const desc = data.desc || data.description || '';

        const statusLabels = {
            new: 'Новая',
            'in-progress': 'В работе',
            resolved: 'Решена',
            closed: 'Закрыта',
            pending: 'Ожидает'
        };
        const priorityLabels = {
            low: 'Низкий',
            medium: 'Средний',
            high: 'Высокий',
            urgent: 'Срочный'
        };

        this.element.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${client}</h3>
                <span class="card-id">ID: ${id}</span>
            </div>
            <div class="card-body">
                <p><strong>Услуга:</strong> ${service}</p>
                <p><strong>Менеджер:</strong> ${manager}</p>
                <p><strong>Статус:</strong> <span class="badge status-${status}">${statusLabels[status] || status}</span></p>
                <p><strong>Приоритет:</strong> <span class="badge priority-${priority}">${priorityLabels[priority] || priority}</span></p>
                <p><strong>Сумма:</strong> ${cost ? Number(cost).toLocaleString('ru-RU') + ' ₽' : '—'}</p>
                ${desc ? `<p class="card-desc"><strong>Описание:</strong> ${desc}</p>` : ''}
            </div>
            <div class="card-actions">
                <button type="button" class="btn btn-view" data-id="${id}">Просмотр</button>
                <button type="button" class="btn btn-edit" data-id="${id}">Редактировать</button>
            </div>
        `;

        const viewBtn = this.element.querySelector('.btn-view');
        const editBtn = this.element.querySelector('.btn-edit');

        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.hash = `#card/${id}`;
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.hash = `#edit/${id}`;
        });

        if (onClick && typeof onClick === 'function') {
            this.element.addEventListener('click', (e) => {
                if (!e.target.closest('.card-actions')) {
                    onClick(id);
                }
            });
        }
    }
}
