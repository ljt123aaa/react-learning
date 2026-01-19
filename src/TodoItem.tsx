import { memo } from 'react';

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  editingId,
  editText,
  onUpdateEditText
}: {
  todo: { id: string; text: string; completed: boolean };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (todo: { id: string; text: string; completed: boolean }) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: (id: string) => void;
  editingId: string | null;
  editText: string;
  onUpdateEditText: (text: string) => void;
}) {
  console.log('TodoItem 渲染:', todo.id);

  return (
    <li className={`flex items-center mb-2 ${todo.completed ? 'line-through opacity-60' : ''}`}>
      {editingId === todo.id ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => onUpdateEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSaveEdit(todo.id);
            } else if (e.key === 'Escape') {
              onCancelEdit(todo.id);
            }
          }}
          onBlur={() => onSaveEdit(todo.id)}
          autoFocus
          className="mr-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      ) : (
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-2"
          />
          <span className="text-lg">{todo.text}</span>
        </div>
      )}
      {editingId !== todo.id ? (
        <button
          onClick={() => onStartEdit(todo)}
          className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          编辑
        </button>
      ) : (
        <button
          onClick={() => onSaveEdit(todo.id)}
          className="ml-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
        >
          保存
        </button>
      )}
      <button
        onClick={() => onDelete(todo.id)}
        className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
      >
        删除
      </button>
    </li>
  );
});

export default TodoItem;
