export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(activeLink = 'requests') {
        return `
            <header class="app-header">
                <a href="https://www.ozon.ru/">
                    <img src="logo_ozon_1.png" class="logo">
                </a>
                <nav class="nav-menu">
                    <a href="#" class="nav-link ${activeLink === 'home' ? 'active' : ''}" data-nav="home">Главная</a>
                    <a href="#" class="nav-link ${activeLink === 'requests' ? 'active' : ''}" data-nav="requests">Заявки</a>
                    <a href="hw-test.html" class="nav-link ${activeLink === 'requests' ? 'active' : ''}" data-nav="requests">ДЗ1</a>
                </nav>
            </header>
        `;
    }




    addListeners(handlers) {
        const homeLink = this.parent.querySelector('.nav-link[data-nav="home"]');
        const requestsLink = this.parent.querySelector('.nav-link[data-nav="requests"]');

        if (homeLink) homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            handlers.onHome?.();
        });
        if (requestsLink) requestsLink.addEventListener('click', (e) => {
            e.preventDefault();
            handlers.onRequests?.();
        });
    }

    render({ activeLink = 'requests', onHome, onRequests }) {
        this.parent.insertAdjacentHTML('afterbegin', this.getHTML(activeLink));
        this.addListeners({ onHome, onRequests });
    }
}
