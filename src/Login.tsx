import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: { username: string; password: string }) => {
    setLoading(true);
    console.log('登录信息:', data);

    // 保存登录状态到localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', data.username);

    // 模拟登录延迟
    setTimeout(() => {
      setLoading(false);
      // 跳转到首页
      navigate('/');
      // 触发自定义事件，通知其他组件登录状态已更改
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'isLoggedIn',
        newValue: 'true'
      }));
    }, 1000);
  };

  return (
    <form className="w-80 p-4 bg-white rounded-md shadow-md mx-auto flex flex-col gap-4 mt-10" onSubmit={handleSubmit(onSubmit as any)}>
      <h2 className="text-2xl font-bold mb-4">用户登录</h2>
      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type="text"
        {...register('username', { required: true })}
        placeholder="用户名"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      {errors.username && <span className="text-red-500">用户名不能为空</span>}

      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type="password"
        {...register('password', { required: true, minLength: { value: 6, message: '密码长度不能小于6位' } })}
        placeholder="密码"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {errors.password && <span className="text-red-500">{String(errors.password.message)}</span>}

      <button
        className="w-full p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
        type="submit"
        disabled={loading}
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}