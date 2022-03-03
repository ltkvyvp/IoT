import React, {useEffect, useState} from 'react';
import axios from 'axios';

import WeatherWidget from './WeatherWidget';
import {Card} from "@blueprintjs/core";

const OPEN_WEATHER_MAP_KEY = '0fe402b9ca41b2f2b93d46f98848bdb7';

const cities = [
  {city: 'hanoi', label: 'Hanoi'},
  {city: 'taipei', label: '🇹🇼 Taipei'},
  {city: 'tokyo', label: '🇯🇵 Tokyo'},
  {city: 'moscow', label: '🇷🇺 Moscow'},
  {city: 'sydney', label: '🇦🇺 Sydney'},
  {city: 'london', label: '🇬🇧 London'},
  {city: 'paris', label: '🇫🇷 Paris'},
  {city: 'mexico', label: '🇲🇽 Mexico'},
  {city: 'seattle', label: '🇺🇸 Seattle'},
  {city: 'washington', label: '🇺🇸 Washington'},
  {city: 'beijing', label: '🇨🇳 Beijing'},
];

const Weather = () => {
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city_index');

  const [cityIndex, setCityIndex] = useState(city || 0);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const fetchWeatherAsync = async (cityId) => {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: cityId,
            lang: 'en',
            appid: OPEN_WEATHER_MAP_KEY,
            units: 'metric',
          },
        },
      );
      const transformData = await response.data.list.map((data) => ({
        dt: data.dt,
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
        desc: data.weather[0].description,
        clouds: data.clouds.all,
        wind: data.wind.speed,
      }));
      setForecast(transformData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWeatherAsync(cities[cityIndex].city);
  }, []); // notice the empty array here

  return (
    <Card style={{marginBottom: "20px"}}>
      {error.length === 0 ? (
        <WeatherWidget
          config={{
            location: cities[cityIndex].label,
            unit: 'metric',
            locale: 'en',
            onLocationClick: () => {
              if (cityIndex + 1 >= cities.length) {
                setCityIndex(0);
                fetchWeatherAsync(cities[0].city);
              } else {
                setCityIndex(cityIndex + 1);
                fetchWeatherAsync(cities[cityIndex + 1].city);
              }
            },
          }}
          forecast={forecast}
        />
      ) : (
        <div>
          <h2>Unable to fetch weather data!</h2>
          <pre>{error}</pre>
        </div>
      )}
    </Card>
  );
};

export default Weather;
