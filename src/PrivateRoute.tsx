import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 路由守卫组件，验证用户是否登录
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 检查localStorage中的登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // 如果未登录，重定向到登录页面
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  // 如果已登录，渲染子组件
  return children;
}