export class CatalogPage {
    constructor() {
        this.dataStore = {};
        this.categories = [];
    }
    async #getData() {
        try {
            const [
                categories,
                history,
                development,
                mechanics,
                ui_ux,
                psychology
            ] = await Promise.all([
                fetch('data/categories.json').then(r => r.json()),
                fetch('data/history.json').then(r => r.json()),
                fetch('data/development.json').then(r => r.json()),
                fetch('data/mechanics.json').then(r => r.json()),
                fetch('data/ui_ux.json').then(r => r.json()),
                fetch('data/psychology.json').then(r => r.json())
            ]);

            this.categories = categories;
            Object.assign(this.dataStore, {
                history, development, mechanics, ui_ux, psychology
            });
        } catch (err) {
            console.error('Помилка завантаження даних:', err);
            this.categories = [];
            this.dataStore = {};
        }
    }

    async renderPage() {
        await this.#getData(); 
        
        try {
            this.showCatalog();
        } catch (err) {
            console.error('Не вдалось завантажити дані:', err);
            document.getElementById('main-container').innerHTML = `<div class="alert alert-danger">Помилка завантаження даних.</div>`;
        }
    }

    showCatalog() {
        const html = [
            `<h2 class="mt-5">Категорії</h2>`,
            `<div class="list-group mb-3">`,
            ...this.categories.map(cat => `
                <button data-short="${cat.shortname}" class="list-group-item  list-group-item-action cat-link">
                    ${cat.name}
                </button>`),
            `</div>`
        ].join('');

        const c = document.getElementById('main-container');
        c.innerHTML = html;

        c.querySelectorAll('.cat-link').forEach(a =>
            a.addEventListener('click', e => {
                e.preventDefault();
                this.loadCategory(e.currentTarget.dataset.short);
            })
        );
    }

    async loadCategory(shortname) {
        let items = this.dataStore[shortname];
        if (!items) {
            try {
                items = await fetch(`data/${shortname}.json`).then(r => r.json());
                this.dataStore[shortname] = items;
            } catch (err) {
                console.error(`Не вдалось завантажити ${shortname}.json:`, err);
                return;
            }
        }

        const cat = this.categories.find(c => c.shortname === shortname);
        const cards = items.map(item => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="https://place-hold.it/200x200?text=${encodeURIComponent(item.name)}"
                         class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text"><strong>Ціна:</strong> ${item.price}</p>
                    </div>
                </div>
            </div>`).join('');

        document.getElementById('main-container').innerHTML = `
            <h2 class="mt-5">${cat.name}</h2>
            <div class="row">${cards}</div>
        `;
    }

    getRandomItems(count) {
        const allItems = [];
        for (const key in this.dataStore) {
            if (this.dataStore.hasOwnProperty(key)) {
                const items = this.dataStore[key];
                if (Array.isArray(items)) {
                    allItems.push(...items);
                }
            }
        }
        if (allItems.length <= 0) {
            return [];
        }
        if (count > allItems.length) {
            count = allItems.length;
        }
        const shuffled = allItems.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    async showRandomItems(count, id) {
        await this.#getData();
        
        const randomItems = this.getRandomItems(count);
        if (randomItems.length > 0) {
            const cards = randomItems.map(item =>
                `<div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="https://place-hold.it/200x200?text=${encodeURIComponent(item.name)}"
                             class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><strong>Ціна:</strong> ${item.price}</p>
                        </div>
                    </div>
                </div>`).join('');

            document.getElementById(id).innerHTML += `
                <h2>Випадкові статті</h2>
                <div class="row">${cards}</div>
            `;
        }
    }

    filterCategoriesByShortname(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return this.categories;
        }
        return this.categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}