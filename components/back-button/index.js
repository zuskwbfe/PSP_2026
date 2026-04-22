export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const button = document.getElementById("back-button");
        if (button) {
            button.addEventListener("click", listener);
        }
    }

    getHTML() {
        return `
            <button id="back-button" class="btn btn-secondary" type="button">
                ← Назад
            </button>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}
