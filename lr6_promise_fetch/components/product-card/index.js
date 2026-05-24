export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="product-card">
                <img class="product-card-img" src="${data.src}" alt="${data.title}">
                <span class="product-card-category">${data.category}</span>
                <h3 class="product-card-title">${data.title}</h3>
                <p class="product-card-text">${data.text}</p>
                <span class="product-card-stock ${data.inStock ? 'stock-in' : 'stock-out'}">
                    ${data.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
                <div class="card-buttons">
                    <button class="btn-details" id="btn-details-${data.id}" data-id="${data.id}">Подробнее</button>
                </div>
            </div>
        `;
    }

    addListeners(data, onDetails) {
        document.getElementById(`btn-details-${data.id}`)
            .addEventListener('click', onDetails);
    }

    render(data, onDetails) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, onDetails);
    }
}
