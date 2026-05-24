import { HeaderComponent } from "../../components/header/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;                 // null — режим добавления, число — режим редактирования
        this.isEdit = id !== null && id !== undefined;
        this.data = {
            src: '',
            title: '',
            text: '',
            description: '',
            category: '',
            age: '',
            inStock: true
        };
    }

    async getData() {
        try {
            const { data, status } = await ajax.get(stockUrls.getStockById(this.id));
            if (status >= 200 && status < 300 && data) {
                this.data = { ...this.data, ...data };
                this.fillForm();
            } else {
                console.error('Ошибка загрузки карточки для редактирования. Статус:', status);
            }
        } catch (e) {
            console.error('Сетевая ошибка при загрузке карточки:', e);
        }
    }

    fillForm() {
        const set = (name, value) => {
            const el = document.getElementById(`field-${name}`);
            if (el) el.value = value ?? '';
        };
        set('src', this.data.src);
        set('title', this.data.title);
        set('text', this.data.text);
        set('description', this.data.description);
        set('category', this.data.category);
        set('age', this.data.age);

        const stockEl = document.getElementById('field-inStock');
        if (stockEl) stockEl.checked = !!this.data.inStock;
    }

    getFormHTML() {
        const title = this.isEdit ? 'Редактирование карточки' : 'Добавление карточки';
        return `
            <div id="edit-page">
                <section class="edit-section">
                    <div class="container">
                        <h2 class="section-title">${title}</h2>
                        <div class="edit-form-wrap">
                            <div class="form-row">
                                <label class="form-label" for="field-title">Название</label>
                                <input class="form-input" id="field-title" type="text" placeholder="Например: Биойогурт">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-text">Краткое описание</label>
                                <input class="form-input" id="field-text" type="text" placeholder="Например: с малиной и шиповником">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-description">Полное описание</label>
                                <textarea class="form-input form-textarea" id="field-description" rows="4" placeholder="Подробное описание продукта..."></textarea>
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-category">Категория</label>
                                <input class="form-input" id="field-category" type="text" placeholder="Например: Йогурты">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-age">Возраст</label>
                                <input class="form-input" id="field-age" type="text" placeholder="Например: от 8 мес.">
                            </div>
                            <div class="form-row">
                                <label class="form-label" for="field-src">Ссылка на изображение</label>
                                <input class="form-input" id="field-src" type="text" placeholder="https://...">
                            </div>
                            <div class="form-row form-row-checkbox">
                                <label class="form-label" for="field-inStock">В наличии</label>
                                <input id="field-inStock" type="checkbox" checked>
                            </div>

                            <div class="edit-actions">
                                <button class="btn-save" id="btn-save" type="button">Сохранить</button>
                            </div>
                            <p class="edit-status" id="edit-status"></p>
                        </div>
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

    async saveData(onBack) {
        const statusEl = document.getElementById('edit-status');
        const btn = document.getElementById('btn-save');
        const payload = this.collectForm();

        if (!payload.title.trim()) {
            if (statusEl) {
                statusEl.textContent = 'Введите название карточки';
                statusEl.className = 'edit-status edit-status-error';
            }
            return;
        }

        if (btn) btn.disabled = true;
        if (statusEl) {
            statusEl.textContent = 'Сохраняем…';
            statusEl.className = 'edit-status';
        }

        try {
            const { data, status } = this.isEdit
                ? await ajax.patch(stockUrls.updateStockById(this.id), payload)
                : await ajax.post(stockUrls.createStock(), payload);

            if (status >= 200 && status < 300 && data) {
                if (statusEl) {
                    statusEl.textContent = 'Сохранено!';
                    statusEl.className = 'edit-status edit-status-ok';
                }

                setTimeout(() => onBack && onBack(), 600);
            } else {
                if (statusEl) {
                    statusEl.textContent = `Ошибка сохранения. Статус: ${status}`;
                    statusEl.className = 'edit-status edit-status-error';
                }
                if (btn) btn.disabled = false;
                console.error('Ошибка сохранения. Статус:', status, 'Ответ:', data);
            }
        } catch (e) {
            if (statusEl) {
                statusEl.textContent = 'Сетевая ошибка. Сервер недоступен.';
                statusEl.className = 'edit-status edit-status-error';
            }
            if (btn) btn.disabled = false;
            console.error('Сетевая ошибка при сохранении:', e);
        }
    }

    render(onBack, onAnalytics) {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent, {
            onHome: onBack,
            onAnalytics: onAnalytics
        });
        header.render();

        this.parent.insertAdjacentHTML('beforeend', this.getFormHTML());

        document
            .getElementById('btn-save')
            .addEventListener('click', () => this.saveData(onBack));

        if (this.isEdit) {
            this.getData();
        }
    }
}
