import React, { useEffect, useState } from 'react';
import {
  getDefaultWeather,
  getWeatherByCity,
  getWeatherByCurrentLocation
} from './assets/api';

const App = () => {
  const [cityInput, setCityInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  const loadDefault = async () => {
    try {
      const { weather, location } = await getDefaultWeather();
      setWeather(weather);
      setLocation(location);
      setError('');
    } catch (err) {
      setError('Nie udało się załadować pogody dla Warszawy');
    }
  };

  const handleSearch = async () => {
    if (!cityInput) return;
    try {
      const { weather, location } = await getWeatherByCity(cityInput);
      setWeather(weather);
      setLocation(location);
      setError('');
    } catch (err) {
      setError('Nie znaleziono miasta lub błąd pobierania danych');
    }
  };

  const handleGeolocation = async () => {
    try {
      const { weather, location } = await getWeatherByCurrentLocation();
      setWeather(weather);
      setLocation(location);
      setError('');
    } catch (err) {
      setError('Nie udało się pobrać lokalizacji');
    }
  };

  useEffect(() => {
    loadDefault();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Pogoda</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Wpisz miasto..."
            className="flex-1 border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Szukaj
          </button>
          <button
            onClick={handleGeolocation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Moja lokalizacja
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {location && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Lokalizacja: {location.city || location.name}</h2>
            <p>🌍 {location.lat.toFixed(2)}, {location.lon.toFixed(2)}</p>
          </div>
        )}

        {weather && weather.current && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Aktualna pogoda</h3>
            <p>🌡️ Temperatura: {weather.current.temperature_2m}°C</p>
            <p>💨 Wiatr: {weather.current.wind_speed_10m} km/h</p>
            <p>💧 Wilgotność: {weather.current.relative_humidity_2m}%</p>
          </div>
        )}

        {weather && weather.daily && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Prognoza (7 dni)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {weather.daily.time.map((date, i) => (
                <div key={i} className="bg-gray-200 p-3 rounded">
                  <p className="font-semibold">{date}</p>
                  <p>🌡️ {weather.daily.temperature_2m_min[i]}°C - {weather.daily.temperature_2m_max[i]}°C</p>
                  <p>☔ {weather.daily.precipitation_sum[i]} mm</p>
                  <p>💨 {weather.daily.wind_speed_10m_max[i]} km/h</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
