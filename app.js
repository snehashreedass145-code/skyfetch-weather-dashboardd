function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // DOM elements
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    // Recent searches DOM
    this.recentSearchesSection = document.getElementById('recent-searches-section');
    this.recentSearchesContainer = document.getElementById('recent-searches-container');

    // Data
    this.recentSearches = [];
    this.maxRecentSearches = 5;

    this.init();
}

/* ================= INIT ================= */

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));

    this.cityInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') this.handleSearch();
    }.bind(this));

    this.loadRecentSearches();
    this.loadLastCity();

    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', this.clearHistory.bind(this));
    }
};

/* ================= SEARCH HANDLER ================= */

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();
    if (!city) {
        this.showError('Please enter a city name.');
        return;
    }
    this.getWeather(city);
};

/* ================= WEATHER FETCH ================= */

WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();
    this.searchBtn.disabled = true;
    this.searchBtn.textContent = 'Searching...';

    const currentUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [currentWeather, forecastData] = await Promise.all([
            axios.get(currentUrl),
            this.getForecast(city)
        ]);

        this.displayWeather(currentWeather.data);
        this.displayForecast(forecastData);

        // ✅ save searches only if successful
        this.saveRecentSearch(city);
        localStorage.setItem('lastCity', city);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            this.showError('City not found. Please check spelling.');
        } else {
            this.showError('Something went wrong. Try again later.');
        }
    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = 'Search';
    }
};

/* ================= FORECAST FETCH ================= */

WeatherApp.prototype.getForecast = async function (city) {
    const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    const res = await axios.get(url);
    return res.data;
};

/* ================= DISPLAY WEATHER ================= */

WeatherApp.prototype.displayWeather = function (data) {
    const html = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p>${data.weather[0].description}</p>
        </div>
    `;
    this.weatherDisplay.innerHTML = html;
};

/* ================= DISPLAY FORECAST ================= */

WeatherApp.prototype.displayForecast = function (data) {
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    let html = '<div class="forecast">';

    daily.slice(0, 5).forEach(day => {
        html += `
            <div class="forecast-card">
                <p>${new Date(day.dt_txt).toDateString().slice(0, 10)}</p>
                <p>${Math.round(day.main.temp)}°C</p>
                <p>${day.weather[0].main}</p>
            </div>
        `;
    });

    html += '</div>';
    this.weatherDisplay.innerHTML += html;
};

/* ================= LOADING / ERROR ================= */

WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML =
        `<div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather...</p>
        </div>`;
};

WeatherApp.prototype.showError = function (msg) {
    this.weatherDisplay.innerHTML =
        `<div class="error-message">⚠️ ${msg}</div>`;
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML =
        `<div class="welcome-message">
            <h3>🌤️ Welcome to SkyFetch</h3>
            <p>Search for any city to see weather & forecast.</p>
        </div>`;
};

/* ================= LOCAL STORAGE ================= */

WeatherApp.prototype.loadRecentSearches = function () {
    const saved = localStorage.getItem('recentSearches');
    if (saved) this.recentSearches = JSON.parse(saved);
    this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function (city) {
    const name = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    const index = this.recentSearches.indexOf(name);
    if (index > -1) this.recentSearches.splice(index, 1);

    this.recentSearches.unshift(name);

    if (this.recentSearches.length > this.maxRecentSearches)
        this.recentSearches.pop();

    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
    this.recentSearchesContainer.innerHTML = '';

    if (this.recentSearches.length === 0) {
        this.recentSearchesSection.style.display = 'none';
        return;
    }

    this.recentSearchesSection.style.display = 'block';

    this.recentSearches.forEach(function (city) {
        const btn = document.createElement('button');
        btn.className = 'recent-search-btn';
        btn.textContent = city;

        btn.addEventListener('click', function () {
            this.cityInput.value = city;
            this.getWeather(city);
        }.bind(this));

        this.recentSearchesContainer.appendChild(btn);
    }.bind(this));
};

WeatherApp.prototype.loadLastCity = function () {
    const last = localStorage.getItem('lastCity');
    if (last) this.getWeather(last);
    else this.showWelcome();
};

WeatherApp.prototype.clearHistory = function () {
    if (confirm('Clear all recent searches?')) {
        this.recentSearches = [];
        localStorage.removeItem('recentSearches');
        this.displayRecentSearches();
    }
};

/* ================= START APP ================= */
const app = new WeatherApp(CONFIG.API_KEY);
