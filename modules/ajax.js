// modules/ajax.js
export const api = {
    /**
     * GET запрос через fetch
     * @param {string} url
     * @returns {Promise<any>}
     */
    async get(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('❌ GET error:', error);
            throw error;
        }
    },

    /**
     * POST запрос
     * @param {string} url
     * @param {object} data
     * @returns {Promise<any>}
     */
    async post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('❌ POST error:', error);
            throw error;
        }
    },

    /**
     * PATCH запрос
     * @param {string} url
     * @param {object} data
     * @returns {Promise<any>}
     */
    async patch(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('❌ PATCH error:', error);
            throw error;
        }
    },

    /**
     * DELETE запрос
     * @param {string} url
     * @returns {Promise<any>}
     */
    async delete(url) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('❌ DELETE error:', error);
            throw error;
        }
    }
};
