// ================= WEATHER APP CONSTRUCTOR =================
function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // DOM references
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    this.init();
}

// ================= INIT =================
WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));

    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

// ================= WELCOME =================
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌤 Welcome to SkyFetch</h2>
            <p>Search any city to see weather & 5-day forecast</p>
        </div>
    `;
};

// ================= HANDLE SEARCH =================
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        this.showError('City name too short.');
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

// ================= GET WEATHER + FORECAST =================
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

    } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 404) {
            this.showError('City not found. Please check spelling.');
        } else {
            this.showError('Something went wrong. Please try again.');
        }

    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = 'Search';
    }
};

// ================= GET FORECAST =================
WeatherApp.prototype.getForecast = async function (city) {
    const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    const response = await axios.get(url);
    return response.data;
};

// ================= DISPLAY CURRENT WEATHER =================
WeatherApp.prototype.displayWeather = function (data) {
    const cityName = data.name;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" class="weather-icon">
            <div class="temperature">${temp}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    this.cityInput.focus();
};

// ================= PROCESS FORECAST =================
WeatherApp.prototype.processForecastData = function (data) {
    const daily = data.list.filter(item =>
        item.dt_txt.includes('12:00:00')
    );

    return daily.slice(0, 5);
};

// ================= DISPLAY FORECAST =================
WeatherApp.prototype.displayForecast = function (data) {
    const days = this.processForecastData(data);

    const cards = days.map(day => {
        const date = new Date(day.dt * 1000);
        const name = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        return `
            <div class="forecast-card">
                <h4>${name}</h4>
                <img src="${iconUrl}">
                <div>${temp}°C</div>
                <p>${desc}</p>
            </div>
        `;
    }).join('');

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${cards}
            </div>
        </div>
    `;
};

// ================= LOADING =================
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather...</p>
        </div>
    `;
};

// ================= ERROR =================
WeatherApp.prototype.showError = function (msg) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${msg}</p>
        </div>
    `;
};

// ================= CREATE APP INSTANCE =================
const app = new WeatherApp('49699bcdf70a16ce5deba77be0f357d7');
