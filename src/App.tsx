import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import TodoPage from './TodoPage';
import WeatherPage from './WeatherPage';
import AxiosWeatherPage from './AxiosWeatherPage';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ZustandLearn from './Zustand-learn';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {/* 需要登录才能访问的路由 */}
        <Route path="/" element={<PrivateRoute><TodoPage /></PrivateRoute>} />
        <Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
        <Route path="/axios-weather" element={<PrivateRoute><AxiosWeatherPage /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/zustand-learn" element={<PrivateRoute><ZustandLearn /></PrivateRoute>} />
        {/* 不需要登录的路由 */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
