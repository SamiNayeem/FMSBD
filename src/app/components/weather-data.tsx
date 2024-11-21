'use client';
import React, { useEffect, useState } from 'react';

const WeatherComponent = () => {
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
    weather: {
      main: string;
      description: string;
    }[];
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=23.6850&lon=90.3563&appid=0503081eb57f64e7fce53bbdde738d54&units=metric`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
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

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!weatherData) {
    return <p className="text-center">Loading weather data...</p>;
  }

  // Extract required data
  const { temp, feels_like, humidity, pressure } = weatherData.main;
  const windSpeed = weatherData.wind.speed;
  const windDirection = weatherData.wind.deg;
  const weatherMain = weatherData.weather[0].main;
  const weatherDescription = weatherData.weather[0].description;
  const today = new Date();
  const formattedDate = `${today.toLocaleString('en-US', { weekday: 'long' })}, ${today.toLocaleDateString()}`;

  return (
    <div className="w-full lg:px-40 py-16 container flex flex-col lg:flex-row items-center gap-8">
      {/* Main Weather Display */}
      <div className="w-full lg:w-full relative rounded-lg overflow-hidden bg-cover bg-center shadow-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 to-blue-800/70"></div>
        <div className="relative p-8 text-white">
          <div className="mb-6 w-full">
            <h2 className="font-bold text-4xl">{today.toLocaleString('en-US', { weekday: 'long' })}</h2>
            <p className="opacity-75 text-lg">{formattedDate}</p>
            <p className="flex items-center mt-2 opacity-80">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 425.963 425.963">
                {/* SVG path here */}
              </svg>
              Bangladesh
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <svg className="w-60 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129">
                {/* SVG path for weather icon */}
              </svg>
            </div>
            <div className='px-10'>
              <p className=" float-left text-5xl font-extrabold">{temp}°C</p>
              <p className="text-xl font-semibold">{weatherMain}</p>
              <p className="opacity-75 capitalize">{weatherDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Section */}
      <div className="w-full lg:w-1/2 bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between border-b border-gray-700 pb-4 mb-4">
          <span className="uppercase font-semibold text-sm">Feels Like</span>
          <span className="text-lg font-medium">{feels_like}°C</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-4 mb-4">
          <span className="uppercase font-semibold text-sm">Humidity</span>
          <span className="text-lg font-medium">{humidity}%</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-4 mb-4">
          <span className="uppercase font-semibold text-sm">Wind</span>
          <span className="text-lg font-medium">{windSpeed} m/s ({windDirection}°)</span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase font-semibold text-sm">Pressure</span>
          <span className="text-lg font-medium">{pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
