document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const GEOAPIFY_API_KEY = 'ecc695d1445c467a9c1be9a82fb11f49';
    const GEOCODING_URL = 'https://api.geoapify.com/v1/geocode/search';
    const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

    // DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');
    const currentCity = document.getElementById('currentCity');
    const currentTemp = document.getElementById('currentTemp');
    const currentWind = document.getElementById('currentWind');
    const currentHumidity = document.getElementById('currentHumidity');
    const forecastContainer = document.getElementById('forecastContainer');

    // Fetch Coordinates using Geoapify
    async function getCoordinates(city) {
        try {
            const response = await fetch(
                `${GEOCODING_URL}?text=${encodeURIComponent(city)}&apiKey=${GEOAPIFY_API_KEY}`
            );
            const data = await response.json();
            if (!data.features?.length) throw new Error('City not found');
            return data.features[0].properties;
        } catch (error) {
            alert('Error fetching location: ' + error.message);
            return null;
        }
    }

    // Fetch Weather Data using Open-Meteo
    async function getWeather(lat, lon) {
        try {
            const response = await fetch(
                `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,relative_humidity_2m_max&timezone=auto`
            );
            return await response.json();
        } catch (error) {
            alert('Error fetching weather: ' + error.message);
            return null;
        }
    }

    // Update Weather Display
    function updateWeatherUI(weatherData, cityData) {
        const date = new Date().toISOString().split('T')[0];
        currentCity.textContent = `${cityData.city || cityData.name} (${date})`;
        currentTemp.textContent = `${weatherData.daily.temperature_2m_max[0]}°C`;
        currentWind.textContent = `${weatherData.daily.windspeed_10m_max[0]} m/s`;
        currentHumidity.textContent = `${weatherData.daily.relative_humidity_2m_max[0]}%`;

        forecastContainer.innerHTML = weatherData.daily.time
            .slice(1, 5)
            .map((date, index) => `
                <div class="forecast-item">
                    <div>(${date})</div>
                    <div>Temp: ${weatherData.daily.temperature_2m_max[index+1]}°C</div>
                    <div>Wind: ${weatherData.daily.windspeed_10m_max[index+1]} m/s</div>
                    <div>Humidity: ${weatherData.daily.relative_humidity_2m_max[index+1]}%</div>
                </div>
            `).join('');
    }

    // Event Handlers
    searchBtn.addEventListener('click', async () => {
        if (!cityInput.value.trim()) return alert('Please enter a city name');
        
        const cityData = await getCoordinates(cityInput.value.trim());
        if (!cityData) return;
        
        const weatherData = await getWeather(cityData.lat, cityData.lon);
        if (weatherData) updateWeatherUI(weatherData, cityData);
    });

    locationBtn.addEventListener('click', async () => {
        if (!navigator.geolocation) {
            return alert('Geolocation is not supported by your browser');
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const weatherData = await getWeather(
                position.coords.latitude,
                position.coords.longitude
            );
            
            if (weatherData) {
                const cityData = { city: 'Your Location', name: 'Current Location' };
                updateWeatherUI(weatherData, cityData);
            }
        }, (error) => {
            alert('Unable to retrieve your location: ' + error.message);
        });
    });

    // Initial load with default city
    (async function init() {
        const defaultCity = 'London';
        const cityData = await getCoordinates(defaultCity);
        if (!cityData) return;
        const weatherData = await getWeather(cityData.lat, cityData.lon);
        if (weatherData) updateWeatherUI(weatherData, cityData);
    })();
});