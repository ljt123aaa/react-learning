export function todoReducer(todos: { id: string; text: string; completed: boolean }[], action: { type: string; id: string; text: string; }) {
    switch (action.type) {
        case 'add':
            return [...todos, {
                id: action.id,
                text: action.text,
                completed: false
            }];
        case 'toggle':
            return todos.map(todo =>
                todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
            );
        case 'delete':
            return todos.filter(todo => todo.id !== action.id);
        case 'edit':
            return todos.map(todo =>
                todo.id === action.id ? { ...todo, text: action.text } : todo
            );
        default:
            throw new Error('Unknown action type' + action.type);
    }
}
