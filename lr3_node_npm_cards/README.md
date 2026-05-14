# Лабораторная работа №3. Компонентный подход с использованием Node.js и npm

**Студент:** Бабере Виктория  
**Группа:** ИУ5-44Б


## Содержание

1. [Цель работы](#цель-работы)
2. [Задание](#задание)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Дополнительное задание на защите](#дополнительное-задание-на-защите)


## Цель работы

Знакомство с **компонентным подходом** при разработке веб-приложений, инструментами **Node.js** и **npm**, а также с принципами разделения интерфейса на независимые переиспользуемые компоненты.


## Задание

Разработать веб-приложение с использованием компонентного подхода: реализовать набор карточек товаров, поддерживающих добавление, удаление и фильтрацию. Организовать код в виде отдельных JS-классов-компонентов с методами `render()`.


## Вариант и референсы

**Вариант:** Молочная кухня для детей  
**Сайт-референс:** [mir-tema.ru](https://mir-tema.ru)


## Дополнительное задание на защите

На защите было предложено добавить в начало главной страницы **листающуюся галерею карточек (карусель)** с автоматической прокруткой, кнопками «вперёд/назад» и точками-индикаторами.

**Реализация** — компонент `components/carousel/index.js`.

Карусель хранит текущий индекс и автоматически переключает слайды каждые 3 секунды:

```js
startTimer() {
  this.timer = setInterval(() => {
    this.goNext();
  }, 3000);
}

goNext() {
  this.currentIndex = (this.currentIndex + 1) % this.products.length;
  this.updateCard();
}

goPrev() {
  this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
  this.updateCard();
}
```

Разметка карточки внутри карусели генерируется методом `getCardHTML()`:

```js
getCardHTML(product) {
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
        <button class="btn-details carousel-btn-details" data-id="${product.id}">
          Подробнее
        </button>
      </div>
    </div>
  `;
}
```

Карусель встраивается в главную страницу через `MainPage`:

```js
const carouselContainer = document.getElementById('carousel-container');
this.carousel = new CarouselComponent(
  carouselContainer,
  this.carouselData,
  (e) => this.clickDetails(e)
);
this.carousel.render();
```
