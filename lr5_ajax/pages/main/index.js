import { ProductCardComponent } from "../../components/product-card/index.js";
import { HeaderComponent } from "../../components/header/index.js";
import { AnalyticsPage } from "../analytics/index.js";
import { CarouselComponent } from "../../components/carousel/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.allData = [];
        this.carouselData = [];
        this.filteredData = [];
    }

    get cardsContainer() {
        return document.getElementById('cards-container');
    }

    getHTML() {
        return `
            <div id="main-page">
                <section class="carousel-section">
                    <div class="container">
                        <h2 class="section-title">Популярное</h2>
                        <div id="carousel-container"></div>
                    </div>
                </section>
                <section class="main-section">
                    <div class="container">
                        <h2 class="section-title">Наша продукция</h2>
                        <div class="filter-bar">
                            <input
                                type="text"
                                id="filter-input"
                                class="filter-input"
                                placeholder="Поиск по названию..."
                            >
                            <button class="btn-add" id="btn-add">+ Добавить</button>
                        </div>
                        <div class="cards-grid" id="cards-container"></div>
                    </div>
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

    getData() {
        ajax.get(stockUrls.getStocks(), (data, status) => {
            if (status >= 200 && status < 300 && Array.isArray(data)) {
                this.allData = data;
                this.carouselData = [...data];
                this.filteredData = [...data];
                this.renderCarousel();
                this.renderData(this.filteredData);
            } else {

                if (this.cardsContainer) {
                    this.cardsContainer.innerHTML =
                        '<p class="no-results">Не удалось загрузить данные с сервера. ' +
                        'Проверьте, что бэкенд из ЛР №4 запущен на http://localhost:3000 ' +
                        'и включено расширение CORS Unblock.</p>';
                }
                console.error('Ошибка загрузки данных. Статус:', status);
            }
        });
    }

    renderData(items) {
        this.cardsContainer.innerHTML = '';
        if (!items || items.length === 0) {
            this.cardsContainer.innerHTML = '<p class="no-results">Ничего не найдено</p>';
            return;
        }
        items.forEach((item) => {
            const card = new ProductCardComponent(this.cardsContainer);
            card.render(
                item,
                (e) => this.clickDetails(e)
            );
        });
    }

    renderCarousel() {
        const carouselContainer = document.getElementById('carousel-container');
        if (!carouselContainer || this.carouselData.length === 0) return;
        carouselContainer.innerHTML = '';
        this.carousel = new CarouselComponent(
            carouselContainer,
            this.carouselData,
            (e) => this.clickDetails(e)
        );
        this.carousel.render();
    }

    clickDetails(e) {
        const id = +e.target.dataset.id;
        import("../product/index.js").then(({ ProductPage }) => {
            const productPage = new ProductPage(this.parent, id);
            productPage.render(
                () => this.render(),
                () => this.openAnalytics(),
                () => this.openEdit(id)
            );
        });
    }

    openAdd() {
        import("../edit/index.js").then(({ EditPage }) => {
            const editPage = new EditPage(this.parent, null);
            editPage.render(
                () => this.render(),
                () => this.openAnalytics()
            );
        });
    }

    openEdit(id) {
        import("../edit/index.js").then(({ EditPage }) => {
            const editPage = new EditPage(this.parent, id);
            editPage.render(
                () => this.render(),
                () => this.openAnalytics()
            );
        });
    }

    applyFilter() {
        const query = document.getElementById('filter-input')?.value.toLowerCase() || '';
        this.filteredData = this.allData.filter(item =>
            item.title.toLowerCase().includes(query)
        );
        this.renderData(this.filteredData);
    }

    openAnalytics() {
        const analyticsPage = new AnalyticsPage(this.parent, this.allData);
        analyticsPage.render(
            () => this.render(),
            () => this.openAnalytics()
        );
    }

    render() {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent, {
            onHome: () => this.render(),
            onAnalytics: () => this.openAnalytics()
        });
        header.render();

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        document.getElementById('btn-add').addEventListener('click', () => this.openAdd());
        document.getElementById('filter-input').addEventListener('input', () => this.applyFilter());

        this.getData();
    }
}
