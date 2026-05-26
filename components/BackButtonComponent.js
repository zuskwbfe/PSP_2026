// components/BackButtonComponent.js
export class BackButtonComponent {
    constructor(root) {
        this.root = root;
        this.button = document.createElement('button');
        this.button.className = 'back-button';
        this.button.textContent = '← Назад';
        this.button.type = 'button'; // предотвращает сабмит формы, если кнопка внутри <form>
        this.root.appendChild(this.button);
    }

    /**
      Отрисовывает кнопку и привязывает обработчик клика
     * @param {Function} callback - Функция, которая вызовется при нажатии
     */
    render(callback) {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (callback && typeof callback === 'function') {
                callback();
            } else {
                // Фоллбэк: переход на главную страницу
                window.location.hash = '#';
            }
        });
    }
}
