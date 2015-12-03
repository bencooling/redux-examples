// composable reducers to transform different parts of the state tree

// receives & returns todos array (transforms state.todos)
const addTodo = (todos, action) => [ ...todos, { id: action.id, text: action.text, completed: false } ];
const toggleCompletedTodo = (todos, action) => todos.map( todo => (todo.id !== action.id) ?
  todo :
  Object.assign({}, todo, { completed: !todo.completed })
);
// receives & returns state object (transforms state.refine)
const refineTodos = (state, action) => Object.assign({}, state, { refine: action.refine });


// reducer can be identified by its function signature; accepts state and action
// all app actions types are managed within single reducer (giant switch statement)
const reducer = (state = { refine: 'ALL', todos: [] }, action) => {
  switch (action.type){
    case 'ADD_TODO':
      return Object.assign({}, state, {todos: addTodo(state.todos, action)});
      break;
    case 'TOGGLE_COMPLETED_TODO':
      return Object.assign({}, state, {todos: toggleCompletedTodo(state.todos, action)});
      break;
    case 'REFINE_TODOS':
      return refineTodos(state, action);
      break;
    default:
      return state;
  }
};
