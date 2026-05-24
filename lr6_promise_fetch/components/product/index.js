export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="product-detail">
                <img class="product-detail-img" src="${data.src}" alt="${data.title}">
                <div class="product-detail-info">
                    <span class="product-detail-category">${data.category}</span>
                    <h2 class="product-detail-title">${data.title}</h2>
                    <p class="product-detail-text">${data.text}</p>
                    <p class="product-detail-text">${data.description}</p>
                    <span class="product-detail-age">Возраст: ${data.age}</span>
                </div>
            </div>
        `;
    }

    render(data) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    }
}
