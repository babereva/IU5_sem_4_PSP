class Ajax {
    /**
     * GET запрос
     * @param {string} url - Адрес запроса
     * @returns {Promise<{data: any, status: number}>}
     */
    async get(url) {
        const response = await fetch(url, { method: 'GET' });
        return this._handleResponse(response);
    }

    /**
     * POST запрос
     * @param {string} url - Адрес запроса
     * @param {object} body - Данные для отправки (будут сериализованы в JSON)
     * @returns {Promise<{data: any, status: number}>}
     */
    async post(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return this._handleResponse(response);
    }

    /**
     * PATCH запрос
     * @param {string} url - Адрес запроса
     * @param {object} body - Данные для обновления (будут сериализованы в JSON)
     * @returns {Promise<{data: any, status: number}>}
     */
    async patch(url, body) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return this._handleResponse(response);
    }

    /**
     * DELETE запрос
     * @param {string} url - Адрес запроса
     * @returns {Promise<{data: any, status: number}>}
     */
    async delete(url) {
        const response = await fetch(url, { method: 'DELETE' });
        return this._handleResponse(response);
    }

    /**
     * Парсит тело ответа как JSON (если оно есть) и возвращает
     * объект { data, status } — общий формат для всех методов.
     * @param {Response} response - объект ответа fetch
     */
    async _handleResponse(response) {
        let data = null;
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : null;
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
        }
        return { data, status: response.status };
    }
}

export const ajax = new Ajax();
