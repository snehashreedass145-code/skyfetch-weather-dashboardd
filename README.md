# 🌤️ SkyFetch - Weather Dashboard

A beautiful, interactive weather dashboard that provides real-time weather data and 5-day forecasts for any city in the world.

## ✨ Features

- 🔍 Search weather for any city worldwide
- 🌡️ Current temperature, weather conditions, and icon
- 📊 5-day weather forecast with daily predictions
- 💾 Recent searches saved locally
- 🔄 Auto-loads last searched city
- 📱 Fully responsive design
- ⚡ Fast and efficient API calls

## 🛠️ Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Axios for API calls
- OpenWeatherMap API
- localStorage for data persistence

## 🎯 Concepts Demonstrated

- Prototypal Inheritance (OOP)
- Async/Await & Promises
- Promise.all() for concurrent API calls
- DOM Manipulation
- Event Handling
- Error Handling
- localStorage API
- Responsive Web Design

## 🚀 Live Demo

[Add your Vercel URL here after deployment]

## 📸 Screenshots

[Add screenshots after deployment]

## 💻 Local Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/skyfetch-weather-dashboard.git
Navigate to project directory:
cd skyfetch-weather-dashboard
Get your free API key from OpenWeatherMap

Replace YOUR_API_KEY in app.js with your actual API key

Open index.html in your browser

📝 License
This project is open source and available under the MIT License.

👨‍💻 Author
[Snehashreedas]

GitHub: [@snehashreedass145-code]
LinkedIn: [Sneha Dash]
🙏 Acknowledgments
Weather data provided by OpenWeatherMap API
Icons from OpenWeatherMap
Built as part of Frontend Web Development Advanced Course
</details>

### 6.2 Optional: Create .gitignore (If not exists)

**Your task:** Update `.gitignore` to exclude unnecessary files

<details>
<summary>View Code</summary>

Dependencies
node_modules/

Environment variables (if you use them)
.env .env.local

OS files
.DS_Store Thumbs.db

Editor directories
.vscode/ .idea/

Logs
*.log

</details>

### 6.3 Optional: Move API Key to Separate File

For better security, you can separate your API key.

**Your task:** Create `config.js` file

<details>
<summary>View Code</summary>

```javascript
// TODO: Create config.js (optional)
const CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE'
};
