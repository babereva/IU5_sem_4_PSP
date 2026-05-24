export class CarouselComponent {
    constructor(parent, products, onDetails) {
        this.parent = parent;
        this.products = products;
        this.onDetails = onDetails;
        this.currentIndex = 0;
        this.timer = null;
    }

    getCardHTML(product) {
        const stockClass = product.inStock ? 'stock-in' : 'stock-out';
        const stockText = product.inStock ? 'В наличии' : 'Нет в наличии';
        return `
            <div class="carousel-card">
                <div class="carousel-card-left">
                    <img class="carousel-card-img" src="${product.src}" alt="${product.title}">
                </div>
                <div class="carousel-card-right">
                    <span class="product-card-category">${product.category}</span>
                    <h2 class="carousel-card-title">${product.title}</h2>
                    <p class="carousel-card-subtitle">${product.text}</p>
                    <p class="carousel-card-desc">${product.description}</p>
                    <div class="carousel-card-meta">
                        <span class="product-card-stock ${stockClass}">${stockText}</span>
                    </div>
                    <button class="btn-details carousel-btn-details" id="carousel-btn-details" data-id="${product.id}">
                        Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    getDotsHTML() {
        return this.products.map((_, i) => `
            <button class="carousel-dot ${i === this.currentIndex ? 'active' : ''}" data-index="${i}"></button>
        `).join('');
    }

    getHTML() {
        return `
            <div class="carousel-wrapper" id="carousel-wrapper">
                <div class="carousel-content" id="carousel-content">
                    ${this.getCardHTML(this.products[this.currentIndex])}
                </div>
                <button class="carousel-arrow carousel-arrow-left" id="carousel-prev">&#8592;</button>
                <button class="carousel-arrow carousel-arrow-right" id="carousel-next">&#8594;</button>
                <div class="carousel-dots" id="carousel-dots">
                    ${this.getDotsHTML()}
                </div>
            </div>
        `;
    }

    updateCard() {
        const content = document.getElementById('carousel-content');
        const dots = document.getElementById('carousel-dots');
        if (!content || !dots) return;

        content.innerHTML = this.getCardHTML(this.products[this.currentIndex]);
        dots.innerHTML = this.getDotsHTML();

        
        document.getElementById('carousel-btn-details')
            ?.addEventListener('click', (e) => this.onDetails(e));

       
        document.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                this.currentIndex = +e.target.dataset.index;
                this.updateCard();
                this.resetTimer();
            });
        });
    }

    goNext() {
        this.currentIndex = (this.currentIndex + 1) % this.products.length;
        this.updateCard();
    }

    goPrev() {
        this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
        this.updateCard();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.goNext();
        }, 3000); 
    }

    resetTimer() {
        clearInterval(this.timer);
        this.startTimer();
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        
        document.getElementById('carousel-prev').addEventListener('click', () => {
            this.goPrev();
            this.resetTimer();
        });
        document.getElementById('carousel-next').addEventListener('click', () => {
            this.goNext();
            this.resetTimer();
        });
        
        document.getElementById('carousel-btn-details')
            ?.addEventListener('click', (e) => this.onDetails(e));

        document.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                this.currentIndex = +e.target.dataset.index;
                this.updateCard();
                this.resetTimer();
            });
        });

        this.startTimer();
    }
}
