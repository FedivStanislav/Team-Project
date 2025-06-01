
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.keyCode === 32) {
        const tag = e.target.tagName;
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
            e.preventDefault();
        }
    }
});


import {createAppHeader} from "./components/header.js"
import {createAppFooter} from  "./components/footer.js"
import {CatalogPage} from "./pages/CatalogPage.js"
import {FlappyBird} from "./pages/FlappyBird.js";
import {HomePage} from "./pages/HomePage.js"
import {BackgroundService} from "./pages/BackgroundService.js";

const backgroundService = new BackgroundService();
const catalogPage = new CatalogPage();
const flappyBird = new FlappyBird("main-container");
const homePage = new HomePage({
    catalog: catalogPage,
    game: flappyBird
})

backgroundService._initCanvas();
homePage.renderPage();

document.addEventListener("DOMContentLoaded", () => {

    const header = createAppHeader();
    createAppFooter();
    document.body.prepend(header);

    document.getElementById("home").addEventListener("click", () => {
        homePage.renderPage();
        hideHeader();
    });

    document.getElementById("catalog-button").addEventListener("click", () => {
        catalogPage.renderPage();
        hideHeader();
    });

    document.getElementById("start-game").addEventListener("click", () => {
        flappyBird.renderGame();
        hideHeader();
    });
});

function hideHeader(){
    document.querySelector(".show")?.classList?.remove("show");
}