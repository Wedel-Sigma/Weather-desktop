const ForecastCard = ({ date, temp, wind, humidity, code }) => {
    return (
      <div className="bg-gray-100 rounded p-3 shadow text-center">
        <p className="font-semibold mb-1">{date}</p>
        <p>Temp: {temp}°C</p>
        <p>Wind: {wind} m/s</p>
        <p>Humidity: {humidity}%</p>
        <p className="text-sm text-gray-600 mt-1">
          {code === 61 ? "Rain" : code === 0 ? "Sunny" : "Cloudy"}
        </p>
      </div>
    );
  };
  
  export default ForecastCard;
  