import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

// 定义天气数据接口
interface WeatherData {
  city: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
  time: string;
}

// 定义地理编码API响应接口
interface GeoResponse {
  results: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

// 定义天气API响应接口
interface WeatherAPIResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: number;
    weathercode: number;
    time: string;
  };
}

export default function AxiosWeatherPage() {
  const location = useLocation();
  
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('当前路由:', location.pathname);
    
    // 配置axios拦截器（可选）
    const requestInterceptor = axios.interceptors.request.use(
      (config: any) => {
        console.log('发送请求:', config.url);
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log('收到响应:', response.status, response.config.url);
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // 清理拦截器
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [location.pathname]);

  async function searchWeather() {
    if (!city.trim()) {
      setError('请输入城市名');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 使用axios的get方法替代fetch
      const geoResponse = await axios.get<GeoResponse>(
        `https://geocoding-api.open-meteo.com/v1/search`,
        {
          params: {
            name: city,
            count: 1,
            language: 'en',
            format: 'json'
          },
          // 可以添加axios配置
          timeout: 10000 // 10秒超时
        }
      );

      const geoData = geoResponse.data;

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('城市未找到');
      }

      const { latitude, longitude, name } = geoData.results[0];

      // 使用axios的get方法替代fetch
      const weatherResponse = await axios.get<WeatherAPIResponse>(
        `https://api.open-meteo.com/v1/forecast`,
        {
          params: {
            latitude: latitude,
            longitude: longitude,
            current_weather: true
          },
          timeout: 10000
        }
      );

      const weatherData = weatherResponse.data;
      console.log(weatherData);
      
      const formattedWeather: WeatherData = {
        city: name,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        winddirection: weatherData.current_weather.winddirection,
        is_day: weatherData.current_weather.is_day,
        weathercode: weatherData.current_weather.weathercode,
        time: weatherData.current_weather.time,
      };
      
      setWeather(formattedWeather);

    } catch (error) {
      console.error('请求错误:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ECONNABORTED') {
          setError('请求超时，请重试');
        } else if (axiosError.response) {
          // 服务器返回错误状态码
          setError(`请求失败: ${axiosError.response.status}`);
        } else if (axiosError.request) {
          // 请求已发送但没有收到响应
          setError('网络错误，请检查网络连接');
        } else {
          // 请求配置错误或其他错误
          setError(axiosError.message || '城市未找到');
        }
      } else {
        // 非axios错误
        setError((error as Error).message || '城市未找到');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      searchWeather();
    }
  }

  function getWindDirectionText(degrees: number): string {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>🌤️ 天气查询 (Axios版)</h2>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          onKeyDown={handleKeyPress} 
          placeholder="请输入城市名" 
          style={{ 
            width: '70%', 
            padding: '8px', 
            boxSizing: 'border-box', 
            marginRight: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }} 
        />
        <button 
          onClick={searchWeather} 
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '查询中...' : '查询天气'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          ❌ {error}
        </div>
      )}

      {weather && (
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
      )}

    </div>
  );
}
