
export class HomePage {
    catalog = null;
    game = null;
    template = `
                <div class="container mt-5">
                    <!-- Пошук -->
                    <div class="input-group mb-4 mt-5">
                        <input type="text" id="searchInput" class="form-control" placeholder="Пошук категорій за shortname..." aria-label="Пошук категорій">
                        <button class="btn btn-primary" id="searchBtn">Знайти</button>
                    </div>
                    <!-- Дропдаун -->
                    <div class="dropdown mb-4">
                        <ul class="dropdown-menu" id="categoryDropdown" style="display: none;"></ul>
                    </div>
                    <!-- Секція статей -->
                    <div class="articles" id="articles" style="padding: 120px;">
                        <div class="alert alert-info" role="alert" id="noResults" style="display: none;">
                            Жодної категорії не знайдено. Спробуйте інший запит!
                        </div>
                    </div>
                </div>
            `;
    gameShortName = "flappybird";
    constructor(options) {
        this.catalog = options.catalog;
        this.game = options.game;
    }

    renderPage() {
        document.getElementById("main-container").innerHTML = this.template;
        
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", () => this.handleSearch());
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.handleSearch();
        });
        document.getElementById("searchBtn").addEventListener("click", () => this.handleSearch());
        
        this.catalog.showRandomItems(6, "articles");
    }

    handleSearch() {
        const searchTerm = document.getElementById("searchInput").value.trim();
        this.filter(searchTerm);
    }

    filter(filteredValue) {
        const filteredValues = ["game", "flappy bird"]
        const filteredCategories = this.catalog.filterCategoriesByShortname(filteredValue);
        const dropdown = document.getElementById("categoryDropdown");
        
        dropdown.style.display = "none";
        dropdown.innerHTML = ``;
        
        if (filteredValues[0].toLowerCase().includes(filteredValue.toLowerCase()) || filteredValues[1].toLowerCase().includes(filteredValue.toLowerCase())) {
            dropdown.innerHTML = `
                <li>
                    <a class="dropdown-item category-item" href="#" data-shortname="${this.gameShortName}" id="${this.gameShortName}">
                        Flappy Bird
                    </a>
                </li>`;
            
            document.getElementById(this.gameShortName).addEventListener("click", (e) => {
                this.game.renderGame()
            });
            
            dropdown.style.display = "block";
            document.getElementById("noResults").style.display = "none";
        } else {
            dropdown.style.display = "none";
            document.getElementById("noResults").style.display = "block";
        }
        
        if (filteredCategories.length > 0) {
            dropdown.style.display = "block";
            dropdown.innerHTML += filteredCategories.map(cat => `
                        <li>
                            <a class="dropdown-item category-item" href="#" data-shortname="${cat.shortname}">
                                ${cat.name} (${cat.shortname})
                            </a>
                        </li>
                    `).join('');

            dropdown.querySelectorAll('.category-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();

                    const shortname = e.currentTarget.dataset.shortname;
                    if (shortname === this.gameShortName) {
                        return;
                    }

                    this.catalog.loadCategory(shortname);
                    dropdown.style.display = 'none';
                });
            });

            document.getElementById("noResults").style.display = "none";
        }
    }
}