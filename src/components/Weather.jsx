import React, { useEffect, useState } from 'react';
import './Weather.css';
import clear_icon from '../assets/clear.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';
import snow_icon from '../assets/snow.png';
import rain_icon from '../assets/rain.png';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [bgClass, setBgClass] = useState('bg-moderate'); // Default to moderate background
  const [error, setError] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(clear_icon);

  const search = async (city) => {
    if (!city) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);

      const temp = data.main.temp;
      const condition = data.weather[0].main.toLowerCase();

      // Update the background class based on the temperature and condition
      if (condition === 'snow') {
        setBgClass('bg-cold');
        setWeatherIcon(snow_icon);
      } else if (condition === 'rain' || condition === 'drizzle') {
        setBgClass('bg-rainy');
        setWeatherIcon(rain_icon);
      } else if (temp <= 10) {
        setBgClass('bg-cold');
        setWeatherIcon(snow_icon);
      } else if (temp > 10 && temp <= 25) {
        setBgClass('bg-moderate');
        setWeatherIcon(clear_icon);
      } else {
        setBgClass('bg-hot');
        setWeatherIcon(clear_icon);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again later.');
    }
  };

  useEffect(() => {
    if (city) search(city);
  }, [city]);

  useEffect(() => {
    // Update the body class whenever bgClass changes
    document.body.className = bgClass;
  }, [bgClass]);

  return (
    <div className="weather-container">
      <header>
        <h1>Météo Interactif</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Entrez une ville..."
            value={city}
            onChange={(e) => setCity(e.target.value)} // Update city state
          />
          <button onClick={() => search(city)}>Rechercher</button>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <>
          <img src={weatherIcon} alt="Current Weather" className="weather-icon" />
          <div className="location">{weatherData.name}, {weatherData.sys.country}</div>
          <div className="temperature">{Math.round(weatherData.main.temp)}°C</div>

          <div className="weather-data">
            <div className="col wind-speed">
              <img src={wind_icon} alt="Wind" />
              <div>
                {weatherData.wind.speed} km/h
                <span>Vitesse du vent</span>
              </div>
            </div>

            <div className="col humidity">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                {weatherData.main.humidity}%
                <span>Humidité</span>
              </div>
            </div>

            <div className="col">
              <img src={clear_icon} alt="Description" />
              <div>{weatherData.weather[0].description}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
