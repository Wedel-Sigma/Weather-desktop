const GEOAPIFY_API_KEY = "TWOJ_KLUCZ_GEOAPIFY"; // <-- wstaw tu swój klucz
const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

const DEFAULT_COORDS = {
  lat: 52.2297,
  lon: 21.0122,
  name: "Warszawa"
};

export async function getWeatherByCoords(lat, lon) {
  const url = `${OPEN_METEO_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Nie udało się pobrać danych pogodowych");
  const data = await res.json();
  return data;
}

export async function getWeatherByCity(city) {
  const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    city
  )}&apiKey=${GEOAPIFY_API_KEY}`;

  const res = await fetch(geoUrl);
  if (!res.ok) throw new Error("Nie udało się pobrać lokalizacji miasta");
  const geoData = await res.json();

  if (geoData.features.length === 0) {
    throw new Error("Nie znaleziono miasta");
  }

  const { lat, lon } = geoData.features[0].properties;
  const weather = await getWeatherByCoords(lat, lon);
  return { weather, location: geoData.features[0].properties };
}

export function getDefaultWeather() {
  return getWeatherByCoords(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon).then(
    (weather) => ({
      weather,
      location: {
        city: DEFAULT_COORDS.name,
        lat: DEFAULT_COORDS.lat,
        lon: DEFAULT_COORDS.lon,
      },
    })
  );
}

export function getWeatherByCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const weather = await getWeatherByCoords(latitude, longitude);
          resolve({
            weather,
            location: {
              lat: latitude,
              lon: longitude,
              city: "Twoja lokalizacja",
            },
          });
        } catch (err) {
          reject(err);
        }
      },
      (err) => reject(err)
    );
  });
}
