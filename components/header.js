const notRegistretedUser = 'Guest';

export function createAppHeader() {
    const header = document.createElement('header');

    const style = document.createElement('style');
    style.textContent = `
        .navbar-brand img {
            height: 40px;
        }
        .navbar-user {
            font-size: 0.9rem;
        }
        @media (max-width: 768px) {
            .navbar-user {
                display: none;
            }
        }
    `;
    header.appendChild(style);

    let username = localStorage.getItem('username') || 'Guest';

    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg navbar-dark bg-dark fixed-top';
    nav.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img src="./images/bird-logo.svg" alt="Логотип застосунку" />
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" id="home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" id="catalog-button">Articles</a></li>
                    <li class="nav-item"><a class="nav-link" id="start-game">Flappy bird</a></li>
                </ul>
                <div id="welcome-user" class="navbar-actions ms-auto ${username === 'Guest' ? 'd-none' : ''}" style="color: white">
                    Hello, <strong id="username">${username}</strong>!
                </div>
                <div class="navbar-actions ms-3 row">
                    <div class="col">              
                        <input type="text" id="registerInput" class="form-control d-none" placeholder="Enter your name" />
                    </div>
                    <div class="col">            
                        <button id="registerButton" class="btn btn-secondary ms-2">Реєстрація</button>
                    </div>
                    <div class="col">                  
                        <button id="logoutButton" class="btn btn-secondary ms-2 ${username === 'Guest' ? 'd-none' : ''}">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    header.appendChild(nav);

    const bootstrap = window.bootstrap || {};
    const collapse = new bootstrap.Collapse(nav.querySelector('#navbarNav'), { toggle: false });

    const toggler = nav.querySelector('.navbar-toggler');
    toggler.addEventListener('click', () => {
        collapse.toggle();
    });

    const registerButton = nav.querySelector('#registerButton');
    const registerInput = nav.querySelector('#registerInput');
    const usernameDisplay = nav.querySelector('#username');
    const logoutButton = nav.querySelector('#logoutButton');
    const welcomeUser = nav.querySelector('#welcome-user');
    
    if (username !== notRegistretedUser) {
        registerInput.classList.add('d-none');
        registerButton.classList.add('d-none')
    }

    registerButton.addEventListener('click', () => {
        if (registerInput.classList.contains('d-none')) {
            registerInput.classList.remove('d-none');
            registerButton.textContent = 'Submit';
        } else {
            const newUsername = registerInput.value.trim();
            if (newUsername) {
                localStorage.setItem('username', newUsername);
                usernameDisplay.textContent = newUsername;
                registerInput.classList.add('d-none');
                registerButton.classList.add('d-none')
                logoutButton.classList.remove('d-none');
                welcomeUser.classList.remove('d-none');
                registerInput.value = '';
            } else {
                welcomeUser.classList.add("d-none")
                registerInput.classList.add('d-none');
            }
        }
    });

    registerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            registerButton.click();
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('username');
        usernameDisplay.textContent = 'Guest';
        welcomeUser.classList.add("d-none")
        logoutButton.classList.add('d-none');
    });

    return header;
}