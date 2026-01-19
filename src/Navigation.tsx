import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // 检查登录状态
  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('username');
    if (loggedIn) {
      setIsLoggedIn(true);
      setUsername(user ?? '');
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  // 组件挂载时检查登录状态
  useEffect(() => {
    checkLoginStatus();

    // 监听localStorage变化
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // 添加事件监听器
    window.addEventListener('storage', handleStorageChange);

    // 清理事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  function handleNavClick(to: string) {
    console.log('即将跳转到:', to);
  }

  // 退出登录函数
  const handleLogout = () => {
    // 清除localStorage中的登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    // 更新状态
    setIsLoggedIn(false);
    setUsername('');
    // 跳转到登录页面
    navigate('/login');
  };

  return (
    <nav className="bg-gray-500 p-4 flex justify-between items-center">
      <ul className="list-none flex justify-center gap-5 m-0 p-0">
        {isLoggedIn ? (
          // 已登录状态显示的导航项
          [
            <li key="1">
              <NavLink
                to="/"
                onClick={() => handleNavClick('/')}
                className={({ isActive }) => `text-white no-underline text-lg px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition-colors`}
              >
                📝 待办事项
              </NavLink>
            </li>,
            <li key="2">
              <NavLink
                to="/weather"
                onClick={() => handleNavClick('/weather')}
                className={({ isActive }) => `text-white no-underline text-lg px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition-colors`}
              >
                🌤️ 天气查询
              </NavLink>
            </li>,
            <li key="3">
              <NavLink
                to="/axios-weather"
                onClick={() => handleNavClick('/axios-weather')}
                className={({ isActive }) => `text-white no-underline text-lg px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition-colors`}
              >
                🌤️ 天气查询 (Axios版)
              </NavLink>
            </li>,
            <li key="4">
              <NavLink
                to="/products"
                onClick={() => handleNavClick('/products')}
                className={({ isActive }) => `text-white no-underline text-lg px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition-colors`}
              >
                🛍️ 商品列表
              </NavLink>
            </li>,
            <li key="5">
              <NavLink
                to="/zustand-learn"
                onClick={() => handleNavClick('/zustand-learn')}
                className={({ isActive }) => `text-white no-underline text-lg px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition-colors`}
              >
                🧠 Zustand 学习
              </NavLink>
            </li>
          ]
        ) : (
          // 未登录状态显示的导航项
          <li>
            <NavLink
              to="/login"
              onClick={() => handleNavClick('/login')}
              className={({ isActive }) => `text-white no-underline text-lg px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'hover:bg-gray-700'} transition-colors`}
            >
              🔒 登录
            </NavLink>
          </li>
        )}
      </ul>

      {isLoggedIn && (
        <div className="flex items-center gap-3 text-white">
          <span>欢迎, {username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      )}
    </nav>
  );
}
