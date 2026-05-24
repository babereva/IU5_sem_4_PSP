import { HeaderComponent } from "../../components/header/index.js";
import { ProductComponent } from "../../components/product/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.querySelector('#product-page .product-section .container');
    }

    async getData() {
        try {
            const { data, status } = await ajax.get(stockUrls.getStockById(this.id));
            if (status >= 200 && status < 300 && data) {
                this.renderData(data);
            } else {
                if (this.pageRoot) {
                    this.pageRoot.innerHTML =
                        '<p class="no-results">Не удалось загрузить карточку с сервера.</p>';
                }
                console.error('Ошибка загрузки карточки. Статус:', status);
            }
        } catch (e) {
            if (this.pageRoot) {
                this.pageRoot.innerHTML =
                    '<p class="no-results">Сервер недоступен.</p>';
            }
            console.error('Сетевая ошибка при загрузке карточки:', e);
        }
    }

    renderData(item) {
        const product = new ProductComponent(this.pageRoot);
        product.render(item);
    }

    getHTML() {
        return `
            <div id="product-page">
                <section class="product-section">
                    <div class="container"></div>
                </section>
                <footer class="footer">
                    <div class="container footer-inner">
                        <a href="#">
                            <img src="https://mir-tema.ru/header-logo.webp" alt="Тёма" class="footer-logo">
                        </a>
                        <p class="footer-copy">2026 Лабораторная работа. Молочная кухня.</p>
                    </div>
                </footer>
            </div>
        `;
    }

    render(onBack, onAnalytics, onEdit) {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent, {
            onHome: onBack,
            onAnalytics: onAnalytics
        });
        header.render();

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        this.pageRoot.insertAdjacentHTML('beforeend', `
            <div class="product-actions">
                <button class="btn-edit" id="btn-edit">Редактировать</button>
            </div>
        `);
        if (onEdit) {
            document.getElementById('btn-edit').addEventListener('click', onEdit);
        }

        this.getData();
    }
}
