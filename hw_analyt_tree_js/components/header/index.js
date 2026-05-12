export class HeaderComponent {
    constructor(parent, { onHome } = {}) {
        this.parent = parent;
        this.onHome = onHome;
    }

    getHTML() {
        return `
            <header class="header">
                <div class="container header-inner">
                    <a href="#" id="header-logo-link">
                        <img src="https://mir-tema.ru/header-logo.webp" alt="Тёма" class="logo-img">
                    </a>
                    <nav class="navigation">
                        <button id="btn-home-nav" class="nav-item">Домой</button>
                    </nav>
                </div>
            </header>
        `;
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        if (this.onHome) {
            document.getElementById('btn-home-nav').addEventListener('click', this.onHome);
            document.getElementById('header-logo-link').addEventListener('click', (e) => {
                e.preventDefault();
                this.onHome();
            });
        }
    }
}
