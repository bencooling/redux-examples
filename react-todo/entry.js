import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import reactStamp from 'react-stamp';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const stamp = reactStamp(React);


// redux: reducers
// ---------------
// reducers for different parts of the state tree
// reducer function signature accepts a state and action
const refine = (state = 'All', action) => (action.type === 'REFINE_TODOS') ? action.refine : state;

const todos = (state = [], action) => {
  if (action.type === 'ADD_TODO') {
    return [ ...state, { id: (state.length + 1), text: action.text, completed: false } ];
  }
  if (action.type === 'TOGGLE_COMPLETED_TODO') {
    return state.map( todo => (todo.id !== action.id) ?
      todo :
      Object.assign({}, todo, { completed: !todo.completed })
    );
  }
  return state;
};

// root reducer
const reducer = combineReducers({
  refine, // es6 shorthand equivalent to refine: refine
  todos
});


// redux: action creators
// ----------------------
// pure functions for computing actions to be dispatched
const addTodo = text => { return { type: 'ADD_TODO', text }; };
const toggleCompletedTodo = id => { return {type: 'TOGGLE_COMPLETED_TODO', id}; };
const refineTodos = refine => { return {type: 'REFINE_TODOS', refine}; };


// react: functional components
// ----------------------------
// presentation/dumb component
const TodoList = ({todos, toggleCompletedTodo}) =>
  <ul>{todos.map(todo =>
    <li key={todo.id}
        onClick={() => toggleCompletedTodo(todo.id)}
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {todo.text}
    </li>)}
  </ul>;

// presentation/dumb component
const RefineList = ({refine, refineTodos}) =>
  <ul>{['All','Completed','Active'].map( (r, i) =>
    <li key={i}
        onClick={() => refineTodos(r) }
        style={{ textDecoration: r === refine ? 'underline' : 'none' }}>
      {r}
    </li>)}
  </ul>;

// presentation/dumb component w/ stamp for ref with form field SEE: Controlled Components
const TodoField = stamp.compose({
  render (){ return <input type="text" ref="input" onKeyDown={ event => {
    if (event.keyCode === 13) {
      const input = this.refs.input;
      this.props.addTodo(input.value.trim());
      input.value = '';
    }
  }} />;
  }
});

// non-react business logic function
const refinedTodos = (refine, todos) => todos.filter( t =>
  !((t.completed && refine === 'Active') || ((!t.completed) && refine === 'Completed') ));

// root react component
const App = ({ dispatch, todos, refine, toggleCompletedTodo, addTodo, refineTodos }) => {
return (<div>
  <TodoList todos={ refinedTodos(refine, todos) } toggleCompletedTodo={ toggleCompletedTodo } />
  <TodoField addTodo={ addTodo } />
  <div>Refine by: <RefineList refine={refine} refineTodos={refineTodos } /></div>
  <p> {todos.length - (refinedTodos('Completed', todos)).length} items left</p>
</div>
)};

const store = createStore(reducer);

// Wrap the component to inject dispatch and state into it
const TodoApp = connect(
  state => state,
  dispatch => {
    return {
      toggleCompletedTodo: id => dispatch(toggleCompletedTodo(id)),
      addTodo: text => dispatch(addTodo(text)),
      refineTodos: refine => dispatch(refineTodos(refine))
    };
  }
)(App);

render(
  <Provider store={store}><TodoApp /></Provider>,
  document.getElementById('root')
);


// initialise application
// ----------------------
// create store with reducer as argument
// const store = createStore(reducer);

// render UI on store changes
// const render = () => {
//   ReactDOM.render(<TodoApp
//     todos={store.getState().todos}
//     refine={store.getState().refine}
//   />, document.getElementById('root'));
// };
// store.subscribe(render);


// const testAddTodo = () => {
//   const stateBefore = deepFreeze({refine:'ALL', todos:[]});
//   const stateAfter = { refine:'ALL', todos:[ { id: 0, text: 'Walk dog', completed: false }] };
//   expect(reducer(undefined, {type: 'ADD_TODO', id: 0, text: 'Walk dog'})).toEqual(stateAfter);
// };
// testAddTodo();
//
// const testAddSecondTodo = () => {
//   const stateBefore = deepFreeze({ refine:'ALL', todos:[ { id: 0, text: 'Walk dog', completed: false }]});
//   const stateAfter = {
//     refine:'ALL',
//     todos:[
//       { id: 0, text: 'Walk dog', completed: false },
//       { id: 1, text: 'Feed dog', completed: false }
//     ]
//   };
//   expect(reducer(stateBefore, {type: 'ADD_TODO', id: 1, text: 'Feed dog'})).toEqual(stateAfter);
// };
// testAddSecondTodo();
//
//
// const testToggleTodos = () => {
//   const stateBefore = deepFreeze({ refine:'ALL', todos:[ { id: 0, text: 'Walk dog', completed: false }]});
//   const stateAfter = { refine:'ALL', todos:[ { id: 0, text: 'Walk dog', completed: true }]};
//   expect(reducer(stateBefore, { type: 'TOGGLE_COMPLETED_TODO', id:0 })).toEqual(stateAfter);
// };
// testToggleTodos();
//
// console.log('test passed');
