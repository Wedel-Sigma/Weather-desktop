const WeatherCard = ({ weather, date }) => {
    return (
      <div className="bg-blue-100 rounded p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Location (Date: {date})</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind: {weather.windspeed} m/s</p>
        </div>
        <div className="text-blue-700 font-medium">
          {weather.weathercode === 61 ? "Moderate rain" : "Clear / Cloudy"}
        </div>
      </div>
    );
  };
  
  export default WeatherCard;
  