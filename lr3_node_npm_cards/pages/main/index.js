import { ProductCardComponent } from "../../components/product-card/index.js";
import { HeaderComponent } from "../../components/header/index.js";
import { AnalyticsPage } from "../analytics/index.js";
import { CarouselComponent } from "../../components/carousel/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.allData = this.getInitialData();
        this.carouselData = [...this.allData]; 
        this.filteredData = [...this.allData];
        this.nextId = this.allData.length + 1;
    }

    getInitialData() {
        return [
            {
                id: 1,
                src: "https://mir-tema.ru/images/products/1.webp",
                title: "Биолакт",
                text: "с клубникой и бананом",
                description: "Полезный кисломолочный продукт для малышей. Содержит живые бифидобактерии, укрепляет иммунитет и нормализует пищеварение.",
                category: "Кисломолочное",
                age: "от 8 мес.",
                inStock: true
            },
            {
                id: 2,
                src: "https://mir-tema.ru/images/products/2.webp",
                title: "Биойогурт",
                text: "с малиной и шиповником",
                description: "Нежный йогурт с натуральными ягодами. Богат витамином C и пробиотиками для здорового роста ребёнка.",
                category: "Йогурты",
                age: "от 8 мес.",
                inStock: true
            },
            {
                id: 3,
                src: "https://mir-tema.ru/images/products/4.webp",
                title: "Биотворог",
                text: "с бананом",
                description: "Нежный творог с кусочками банана. Богат кальцием и белком — незаменим для развития костей и мышц малыша.",
                category: "Творог",
                age: "от 6 мес.",
                inStock: true
            },
            {
                id: 4,
                src: "https://back.mir-tema.ru/upload/iblock/7a0/mtw4qdaxzfei3zewydda7h4up3eom1gw.png",
                title: "Биолакт",
                text: "натуральный",
                description: "Классический биолакт без добавок. Идеально подходит для первого прикорма и ежедневного рациона малыша.",
                category: "Кисломолочное",
                age: "от 6 мес.",
                inStock: false
            },
            {
                id: 5,
                src: "https://mir-tema.ru/images/products/2.webp",
                title: "Биойогурт",
                text: "с персиком и абрикосом",
                description: "Сладкий йогурт из натуральных фруктов. Без консервантов и искусственных красителей.",
                category: "Йогурты",
                age: "от 8 мес.",
                inStock: false
            },
            {
                id: 6,
                src: "https://back.mir-tema.ru/upload/iblock/189/a9h0ko14ui8s6o6l2kjrtckib2sxjvw8.png",
                title: "Биотворог",
                text: "с грушей",
                description: "Творог с грушей — источник антиоксидантов и кальция для здорового развития малыша.",
                category: "Творог",
                age: "от 6 мес.",
                inStock: true
            },
            {
                id: 7,
                src: "https://back.mir-tema.ru/upload/iblock/f08/a190h2oo0s7offgxdpjh22m4g2uqwv0h.png",
                title: "Кефир детский",
                text: "классический",
                description: "Лёгкий кефир для нежного желудка малыша. Нормализует микрофлору кишечника и улучшает аппетит.",
                category: "Кисломолочное",
                age: "от 9 мес.",
                inStock: true
            },
            {
                id: 8,
                src: "https://back.mir-tema.ru/upload/iblock/f08/a190h2oo0s7offgxdpjh22m4g2uqwv0h.png",
                title: "Молоко",
                text: "с витаминами",
                description: "Нежное молоко. Мягкий вкус и богатый состав витаминов группы B.",
                category: "Кисломолочное",
                age: "от 9 мес.",
                inStock: true
            },
        ];
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
                            <button class="btn-delete-last" id="btn-delete-last">Удалить последнюю</button>
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

    renderCards() {
        this.cardsContainer.innerHTML = '';
        if (this.filteredData.length === 0) {
            this.cardsContainer.innerHTML = '<p class="no-results">Ничего не найдено</p>';
            return;
        }
        this.filteredData.forEach((item) => {
            const card = new ProductCardComponent(this.cardsContainer);
            card.render(
                item,
                (e) => this.clickDetails(e)
            );
        });
    }

    clickDetails(e) {
        const id = +e.target.dataset.id;
        import("../product/index.js").then(({ ProductPage }) => {
            const productPage = new ProductPage(this.parent, id, this.allData);
            productPage.render(
                () => this.render(),  
                () => this.openAnalytics());
        });
    }

    applyFilter() {
        const query = document.getElementById('filter-input')?.value.toLowerCase() || '';
        this.filteredData = this.allData.filter(item =>
            item.title.toLowerCase().includes(query)
        );
        this.renderCards();
    }

    addCard() {
        if (this.allData.length === 0) return;
        const first = { ...this.allData[0] };
        first.id = this.nextId;
        this.nextId++;
        first.title = first.title + ' (копия)';
        this.allData.push(first);
        this.applyFilter();
    }

    deleteLastCard() {
        if (this.allData.length === 0) return;
        this.allData = this.allData.slice(0, -1);
        this.applyFilter();
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

        const carouselContainer = document.getElementById('carousel-container');
        this.carousel = new CarouselComponent(
            carouselContainer,
            this.carouselData,
            (e) => this.clickDetails(e)
        );
        this.carousel.render();

        document.getElementById('btn-add').addEventListener('click', () => this.addCard());
        document.getElementById('btn-delete-last').addEventListener('click', () => this.deleteLastCard());
        document.getElementById('filter-input').addEventListener('input', () => this.applyFilter());

        this.renderCards();
    }
}

