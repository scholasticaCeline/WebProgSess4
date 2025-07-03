"use client"

import { useState } from "react"
import {
  Sun,          
  Cloud,        
  CloudRain,    
  CloudSnow,     
  CloudLightning, 
  Droplet,     
  Wind,     
  Search, 
  AlertCircle
} from 'lucide-react';


type WeatherData = {
  location: {
    name: string
    region: string
    country: string
  }
  current: {
    temperature: number
    weather_descriptions: string[]
    weather_icons: string[] // We'll still receive this but primarily use Lucide for UI
  }
}

// Helper function to get Lucide icon component based on weather description
const getWeatherIcon = (description: string) => {
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes("clear") || lowerDesc.includes("sunny")) {
    return <Sun className="text-orange-400" />;
  } else if (lowerDesc.includes("cloud") || lowerDesc.includes("overcast")) {
    return <Cloud className="text-gray-500" />;
  } else if (lowerDesc.includes("rain") || lowerDesc.includes("drizzle") || lowerDesc.includes("shower")) {
    return <CloudRain className="text-blue-500" />;
  } else if (lowerDesc.includes("snow") || lowerDesc.includes("sleet")) {
    return <CloudSnow className="text-blue-300" />;
  } else if (lowerDesc.includes("thunder") || lowerDesc.includes("storm")) {
    return <CloudLightning className="text-yellow-600" />;
  } else if (lowerDesc.includes("mist") || lowerDesc.includes("fog")) {
    return <Droplet className="text-gray-400" />; // Using droplet for mist/fog
  } else if (lowerDesc.includes("wind")) {
    return <Wind className="text-gray-600" />;
  }
  // Default fallback icon if no match
  return <Cloud className="text-gray-400" />;
};


export default function Home() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchWeather = async () => {
    setHasSearched(true)
    if (!city) {
      setError("Please enter a city name.")
      setWeather(null)
      return
    }
    setLoading(true)
    setError(null)
    setWeather(null)

    try {
      const res = await fetch(`/api/weather?city=${city}`)
      const data = await res.json()

      if (res.ok) {
        if (data && data.location && data.current && data.current.weather_descriptions && data.current.weather_descriptions.length > 0) {
          setWeather(data)
        } else {
          setError("Could not retrieve weather data or valid description for this city. Please try another.")
          setWeather(null)
        }
      } else {
        setError(data.error?.info || "Failed to fetch weather data.")
        setWeather(null)
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("An unexpected error occurred while fetching weather.")
      setWeather(null)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-orange-200 flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-green-800 drop-shadow-md">Check ur Local Weather Here</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out text-lg"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchWeather()
              }
            }}
          />
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out text-sm font-semibold"
            onClick={fetchWeather}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Get Weather"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center" role="alert">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {weather && weather.current && weather.current.weather_descriptions && weather.current.weather_descriptions.length > 0 ? (
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{weather.location.name}</h2>
            <p className="text-gray-600 text-lg mb-4">{weather.location.region}, {weather.location.country}</p>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 mb-2 flex items-center justify-center">
                {getWeatherIcon(weather.current.weather_descriptions.at(0) || "")}
              </div>
              <p className="text-5xl font-extrabold text-orange-700 mb-1">{weather.current.temperature}°C</p>
              <p className="text-gray-700 text-xl font-medium capitalize">{weather.current.weather_descriptions.at(0)}</p>
            </div>
          </div>
        ) : (
          !loading && !error && !hasSearched && (
            <div className="text-center text-gray-500 text-lg py-4 flex items-center justify-center">
              <Search className="h-6 w-6 mr-2" /> Enter a city to see the weather.
            </div>
          )
        )}
      </div>
    </main>
  )
}