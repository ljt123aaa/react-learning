import { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { todoReducer } from './todoReducer';
import TodoItem from './TodoItem';

export default function TodoPage() {
  const location = useLocation();
  
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to parse todos', error);
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    console.log('当前路由:', location.pathname);
  }, [location.pathname]);

  function addTodo() {
    if (input.trim()) {
      dispatch({
        type: 'add',
        id: String(Date.now()),
        text: input.trim(),
      });
      setInput('');
    }
  }

  const toggleTodo = useCallback((id: string) => {
    dispatch({
      type: 'toggle',
      id,
      text: ''
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({
      type: 'delete',
      id,
      text: ''
    });
  }, []);

  const [editingState, editDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'start':
        return {
          editingId: action.id,
          editText: action.text
        };
      case 'updateText':
        return {
          ...state,
          editText: action.text
        };
      case 'clear':
        return {
          editingId: null,
          editText: ''
        };
      default:
        return state;
    }
  }, {
    editingId: null,
    editText: ''
  });

  function startEdit(todo: { id: string; text: string; }) {
    editDispatch({
      type: 'start',
      id: todo.id,
      text: todo.text
    });
  }

  const saveEdit = useCallback(() => {
    if (editingState.editingId !== null && editingState.editText.trim()) {
      dispatch({
        type: 'edit',
        id: editingState.editingId,
        text: editingState.editText.trim(),
      });
    }
    editDispatch({ type: 'clear' });
  }, [editingState.editingId, editingState.editText]);

  const cancelEdit = useCallback(() => {
    editDispatch({ type: 'clear' });
  }, []);

  const onUpdateEditText = useCallback((text: any) => {
    editDispatch({
      type: 'updateText',
      text
    });
  }, []);

  const completedCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const incompleteCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">我的待办事项列表</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">总计：{todos.length} 个任务</p>
        <p className="text-sm text-gray-600">已完成：{completedCount} 个</p>
        <p className="text-sm text-gray-600">未完成：{incompleteCount} 个</p>
      </div>

      <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} placeholder='请输入新任务...' className="w-80 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors">添加</button>

        <ul className="mt-4 space-y-1">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onStartEdit={startEdit}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              editingId={editingState.editingId}
              editText={editingState.editText}
              onUpdateEditText={onUpdateEditText}
            />
          ))}
        </ul>

        {todos.length === 0 && <p className="mt-4 text-gray-500 text-center">暂无待办事项</p>}
      </div>
    </div>
  )
}
