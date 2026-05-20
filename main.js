import { MainPage } from './pages/mainPage.js';
import { CardPage } from './pages/cardPage.js';
import { EditPage } from './pages/editPage.js';

const app = document.getElementById('root');

function renderPage(hash) {
    if (!hash || hash === '#') {
        const mainPage = new MainPage(app);
        mainPage.render();
    } else if (hash.startsWith('#card/')) {
        const id = hash.split('/')[1];
        const cardPage = new CardPage(app, id);
        cardPage.render();
    } else if (hash.startsWith('#edit/')) {
        const id = hash.split('/')[1];
        const editPage = new EditPage(app, id);
        editPage.render();
    } else if (hash === '#add') {
        const editPage = new EditPage(app, null);
        editPage.render();
    }
}

// Обработчик изменения хэша
window.addEventListener('hashchange', () => {
    renderPage(window.location.hash);
});

// Первичная отрисовка
renderPage(window.location.hash);
