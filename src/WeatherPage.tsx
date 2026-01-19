import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Weather {
  city: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
  time: string;
}

export default function WeatherPage() {
  const location = useLocation();

  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('当前路由:', location.pathname);
  }, [location.pathname]);

  async function searchWeather() {
    if (!city.trim()) {
      setError('请输入城市名');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const getResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await getResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('城市未找到');
      }

      const { latitude, longitude, name } = geoData.results[0];

      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherResponse.json();
      console.log(JSON.parse(JSON.stringify(weatherData)));
      setWeather({
        city: name as string,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        winddirection: weatherData.current_weather.winddirection,
        is_day: weatherData.current_weather.is_day,
        weathercode: weatherData.current_weather.weathercode,
        time: weatherData.current_weather.time,
      });

    } catch (error) {
      setError((error as Error).message || '城市未找到');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      searchWeather();
    }
  }

  function getWindDirectionText(degrees: number) {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>🌤️ 天气查询</h2>

      <div style={{ marginBottom: '20px' }}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={handleKeyPress} placeholder="请输入城市名" style={{ width: '70%', padding: '8px', boxSizing: 'border-box', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <button onClick={searchWeather} style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>{loading ? '查询中...' : '查询天气'}</button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          ❌ {error}
        </div>
      )}

      {
        weather && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{weather.city}</h3>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>
              {Math.round(weather.temperature)}°C
            </p>
            <p>风速：{weather.windspeed} km/h</p>
            <p>风向：{weather.winddirection}° ({getWindDirectionText(weather.winddirection)})</p>
            <p>{weather.is_day ? '☀️ 白天' : '🌙 夜晚'}</p>
            <p>查询时间：{new Date(weather.time).toLocaleString()}</p>
          </div>
        )
      }

    </div>
  )
}
