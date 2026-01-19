// import { create } from 'zustand';
import { useCounterStore } from '../store/useCounterStore';

export default function ZustandLearn() {
  const { count, increment, decrement } = useCounterStore();
  return (
    <div>
      <h1>Zustand 学习</h1>
      <p>当前计数: {count}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={increment}>增加</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={decrement}>减少</button>
    </div>
  );
}