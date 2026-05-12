import { HeaderComponent } from "../../components/header/index.js";
import { ProductComponent } from "../../components/product/index.js";

export class ProductPage {
    constructor(parent, id, allData) {
        this.parent = parent;
        this.id = id;
        this.allData = allData;
    }

    getData() {
        return this.allData.find(item => item.id === +this.id);
    }

    get pageRoot() {
        return document.getElementById('product-page');
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

    render(onBack, onAnalytics) {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent, {
            onHome: onBack,
            onAnalytics: onAnalytics
        });
        header.render();

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const container = document.querySelector('#product-page .product-section .container');
        const data = this.getData();
        const product = new ProductComponent(container);
        product.render(data);
    }
}
