export function initTheme() {
    // load saved theme

   const savedTheme = localStorage.getItem('savedTheme') || 'light';
    setTheme(savedTheme);
    updateThemeUI();

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;

        const nextTheme = currentTheme === "dark"
            ? "light"
            : "dark";

        setTheme(nextTheme);
        updateThemeUI();
        saveThemeToStorage();
    });
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function saveThemeToStorage() {
    localStorage.setItem('savedTheme', document.documentElement.dataset.theme);
}

function updateThemeUI() {
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === "dark") {
        themeIcon.src = './images/icon-sun.svg';
    } else {
        themeIcon.src = './images/icon-moon.svg';
    }
}