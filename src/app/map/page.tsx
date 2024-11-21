'use client';
// pages/windMap.js
import React, { useEffect, useState } from 'react';
import WeatherComponent from '../components/weather-data';

const WindMap = () => {
  interface WeatherData {
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    clouds: {
      all: number;
    };
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=23.6850&lon=90.3563&appid=0503081eb57f64e7fce53bbdde738d54&units=metric`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error: any) {
        console.error("Error fetching weather data:", error.message);
        setError(error.message);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Bangladesh Wind & Flood Information</h1>
      
      {/* Map Section */}
      <div className="w-full md:w-3/4 lg:w-2/3" style={{ height: '75vh' }}>
        <iframe
          src="https://embed.windy.com/embed2.html?lat=23.6850&lon=90.3563&detailLat=23.6850&detailLon=90.3563&width=650&height=450&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1&contour=true"
          width="100%"
          height="100%"
          className="w-full h-full rounded-md"
          style={{ border: 'none' }}
          title="Bangladesh Wind Map"
        ></iframe>
      </div>
        <div>
            <WeatherComponent />
        </div>
      {/* Weather Data Display */}
      <div className="w-full md:w-3/4 lg:w-2/3 mt-4 p-4 bg-white shadow rounded-md">
        <h2 className="text-xl font-semibold mb-2">Current Weather Details</h2>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : weatherData ? (
          <div>
            <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
            <p><strong>Feels Like:</strong> {weatherData.main.feels_like} °C</p>
            <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
            <p><strong>Pressure:</strong> {weatherData.main.pressure} hPa</p>
            <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
            <p><strong>Wind Direction:</strong> {weatherData.wind.deg}°</p>
            <p><strong>Cloudiness:</strong> {weatherData.clouds.all}%</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
};

export default WindMap;
