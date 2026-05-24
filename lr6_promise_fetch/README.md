# Лабораторная работа №6. Знакомство с Promise, fetch и сборкой клиентской части через Vite

**Студент:** Бабере Виктория  
**Группа:** ИУ5-44Б


## Содержание

1. [Цель работы](#цель-работы)
2. [Задание](#задание)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Структура проекта](#структура-проекта)
5. [Дополнительное задание на защите](#дополнительное-задание-на-защите)


## Цель работы

Знакомство с механизмом **промисов** (`Promise`) и современной функцией **`fetch`** для асинхронных HTTP-запросов вместо `XMLHttpRequest`. Освоение **сборщика** клиентской части (**Vite**) и развёртывание собранного бандла на сервере с API из ЛР №4 — таким образом, что фронтенд и бэкенд работают на одном домене и проблема **CORS** снимается сама собой.


## Задание

Заменить колбеки на промисы и переписать слой работы с API через `fetch` + `async/await`. Собрать клиентскую часть с помощью сборщика **Vite** и развернуть собранный бандл в проекте бэкенда из ЛР №4 в качестве статики. Ветка по ЛР №6 содержит только исходный код, собранный `bundle` добавляется в ветку по ЛР №4.


## Вариант и референсы

**Вариант:** Молочная кухня для детей  
**Сайт-референс:** [mir-tema.ru](https://mir-tema.ru)


### Слой работы с API

`modules/ajax.js` — все методы асинхронные и возвращают `Promise<{ data, status }>`:

```js
class Ajax {
    async get(url) {
        const response = await fetch(url, { method: 'GET' });
        return this._handleResponse(response);
    }

    async post(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return this._handleResponse(response);
    }

    async _handleResponse(response) {
        let data = null;
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : null;
        } catch (e) { console.error('Ошибка парсинга JSON:', e); }
        return { data, status: response.status };
    }
}
```

Вызывающий код использует `async/await` и `try/catch` вместо вложенных колбеков:

```js
async getData() {
    try {
        const { data, status } = await ajax.get(stockUrls.getStocks());
        if (status >= 200 && status < 300 && Array.isArray(data)) {
            this.allData = data;
            this.renderData(data);
        }
    } catch (e) {
        console.error('Сетевая ошибка:', e);
    }
}
```

### Сборка через Vite

Конфиг `vite.config.js`:

```js
export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/products': 'http://localhost:3000',
        },
    },
};
```

Скрипты `package.json`:

```json
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
}
```

После `npm run build` появляется папка `public/` с минифицированным бандлом (`assets/index-*.js`, `assets/index-*.css`) и `index.html` без исходников. Папку нужно скопировать в проект ЛР №4.

### Раздача статики в ЛР №4

В `lr4_backend_express_js/src/index.js` подключается встроенный middleware Express:

```js
app.use(express.static(path.join(__dirname, '..', 'public')));
```

Теперь при заходе на `http://localhost:3000/` бэкенд сам отдаёт бандл, а API доступно по `/products`. Поскольку фронт и API на одном origin, политика same-origin срабатывает естественно — расширение CORS Unblock больше не требуется.


## Дополнительное задание на защите

На защите было предложено доделать страницу редактирования: добавить кнопку **«Сохранить»**, которая отправляет данные карточки на сервер через `POST` (при добавлении) или `PATCH` (при редактировании), показывает состояние сохранения и автоматически возвращает пользователя на главную после успеха.

**Реализация** — `pages/edit/index.js`.

В разметку формы добавлены кнопка и поле для статус-сообщения:

```html
<div class="edit-actions">
    <button class="btn-save" id="btn-save" type="button">Сохранить</button>
</div>
<p class="edit-status" id="edit-status"></p>
```

Метод `collectForm()` читает значения всех полей и собирает объект для отправки:

```js
collectForm() {
    const get = (name) => document.getElementById(`field-${name}`)?.value ?? '';
    const stockEl = document.getElementById('field-inStock');
    return {
        src: get('src'),
        title: get('title'),
        text: get('text'),
        description: get('description'),
        category: get('category'),
        age: get('age'),
        inStock: stockEl ? !!stockEl.checked : true
    };
}
```

Метод `saveData(onBack)` выбирает между `POST` и `PATCH` по флагу `this.isEdit`, блокирует кнопку на время запроса, показывает статус и возвращает пользователя на главную после успеха:

```js
async saveData(onBack) {
    const btn = document.getElementById('btn-save');
    const payload = this.collectForm();

    if (!payload.title.trim()) {
        this._setStatus('Введите название карточки', 'error');
        return;
    }

    btn.disabled = true;
    this._setStatus('Сохраняем…');

    try {
        const { data, status } = this.isEdit
            ? await ajax.patch(stockUrls.updateStockById(this.id), payload)
            : await ajax.post(stockUrls.createStock(), payload);

        if (status >= 200 && status < 300 && data) {
            this._setStatus('Сохранено!', 'ok');
            setTimeout(() => onBack && onBack(), 600);
        } else {
            this._setStatus(`Ошибка сохранения. Статус: ${status}`, 'error');
            btn.disabled = false;
        }
    } catch (e) {
        this._setStatus('Сетевая ошибка. Сервер недоступен.', 'error');
        btn.disabled = false;
    }
}
```

Обработчик клика подвешивается в `render()`:

```js
document
    .getElementById('btn-save')
    .addEventListener('click', () => this.saveData(onBack));
```

Таким образом форма из ЛР №5 становится полностью рабочей: новая карточка появляется в общем списке через `POST /products`, существующая обновляется через `PATCH /products/:id`, и пользователь видит понятный отклик о том, что произошло с его данными.
