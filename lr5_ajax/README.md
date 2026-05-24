# Лабораторная работа №5. Добавление AJAX-запросов к API

**Студент:** Бабере Виктория  
**Группа:** ИУ5-44Б


## Содержание

1. [Цель работы](#цель-работы)
2. [Задание](#задание)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Структура проекта](#структура-проекта)
5. [Дополнительное задание на защите](#дополнительное-задание-на-защите)


## Цель работы

Знакомство с механизмом **AJAX** и встроенным в браузер объектом **`XMLHttpRequest`** для асинхронного обмена данными между клиентом и сервером без перезагрузки страницы. Подключение фронтенда (ЛР №3) к REST API (ЛР №4) и решение возникающей проблемы **CORS** в условиях разработки.


## Задание

Перевести клиентскую часть из ЛР №3 на работу с реальным API из ЛР №4: главную страницу — на получение списка карточек, страницу карточки — на получение одной карточки по id. Все запросы выполнить через `XMLHttpRequest`. Создать страницу добавления/редактирования карточки с предзаполнением полей данными с сервера для существующих записей. Кнопка «Сохранить» появится только в ЛР №6.


## Вариант и референсы

**Вариант:** Молочная кухня для детей  
**Сайт-референс:** [mir-tema.ru](https://mir-tema.ru)


### Слой работы с API

`modules/ajax.js` — централизованная обёртка над `XMLHttpRequest`. Все методы работают через колбек вида `(data, status) => {}`:

```js
class Ajax {
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    _handleResponse(xhr, callback) {
        try {
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            callback(data, xhr.status);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            callback(null, xhr.status);
        }
    }
}

export const ajax = new Ajax();
```

`modules/stockUrls.js` — единый источник адресов API, чтобы избежать дублирования и облегчить смену сервера:

```js
class StockUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }
    getStocks()           { return `${this.baseUrl}/products`; }
    getStockById(id)      { return `${this.baseUrl}/products/${id}`; }
    createStock()         { return `${this.baseUrl}/products`; }
    removeStockById(id)   { return `${this.baseUrl}/products/${id}`; }
    updateStockById(id)   { return `${this.baseUrl}/products/${id}`; }
}

export const stockUrls = new StockUrls();
```

### Получение данных в страницах

Главная (`pages/main/index.js`) грузит список и проверяет статус ответа:

```js
getData() {
    ajax.get(stockUrls.getStocks(), (data, status) => {
        if (status >= 200 && status < 300 && Array.isArray(data)) {
            this.allData = data;
            this.filteredData = [...data];
            this.renderData(this.filteredData);
        } else {
            this.cardsContainer.innerHTML =
                '<p class="no-results">Не удалось загрузить данные с сервера. ' +
                'Проверьте, что бэкенд запущен и включено расширение CORS Unblock.</p>';
        }
    });
}
```

Страница карточки и форма редактирования получают конкретную запись по `GET /products/:id` и заполняют поля.

### Используемые эндпоинты

| Метод  | URL              | Где используется                                  |
|--------|------------------|---------------------------------------------------|
| GET    | `/products`      | главная — список карточек                         |
| GET    | `/products/:id`  | страница карточки и форма редактирования          |
| POST   | `/products`      | будет использован в ЛР №6                         |
| PATCH  | `/products/:id`  | будет использован в ЛР №6                         |
| DELETE | `/products/:id`  | будет использован в ЛР №6                         |

### Решение проблемы CORS

Фронтенд открывается через **Live Server** (`http://127.0.0.1:5501`), бэкенд работает на `http://localhost:3000` — разные origin. Браузер блокирует запросы политикой same-origin. На этом этапе используется расширение **CORS Unblock**, которое подменяет заголовки ответа. В ЛР №6 это решится «правильным» способом: бэкенд будет сам раздавать собранный фронт как статику, и оба окажутся на одном origin.


## Дополнительное задание на защите

На защите было предложено добавить на главную страницу **фильтрацию карточек по названию** в реальном времени — пользователь вводит текст в поле, и список карточек мгновенно сужается до тех, у которых название содержит введённую подстроку.

**Реализация** — `pages/main/index.js`.

В разметку главной добавлено поле ввода рядом с кнопкой «+ Добавить»:

```html
<div class="filter-bar">
    <input
        type="text"
        id="filter-input"
        class="filter-input"
        placeholder="Поиск по названию..."
    >
    <button class="btn-add" id="btn-add">+ Добавить</button>
</div>
```

При каждом нажатии клавиши в поле срабатывает обработчик `applyFilter()`, который фильтрует исходный массив и перерисовывает сетку карточек:

```js
applyFilter() {
    const query = document.getElementById('filter-input')?.value.toLowerCase() || '';
    this.filteredData = this.allData.filter(item =>
        item.title.toLowerCase().includes(query)
    );
    this.renderData(this.filteredData);
}
```

Подписка на ввод подвешивается в `render()`:

```js
document.getElementById('filter-input').addEventListener('input', () => this.applyFilter());
```

Фильтрация работает поверх массива `this.allData`, полученного один раз с сервера через `ajax.get` — то есть никаких лишних запросов на сервер не делается, и фильтрация мгновенная. Эта возможность также используется в демонстрации: после добавления новой карточки через Postman (`POST /products`) её удобно найти в общем списке, набрав название в поле фильтрации.
