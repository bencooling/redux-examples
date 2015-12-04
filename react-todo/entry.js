import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import reactStamp from 'react-stamp';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

const stamp = reactStamp(React);


// redux: reducers
// ---------------
// reducers for different parts of the state tree
// reducer function signature accepts a state and action
const refine = (state = 'ALL', action) => (action.type === 'REFINE_TODOS') ? action.refine : state;

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

const reducer = combineReducers({
  refine, // es6 shorthand equivalent to refine: refine
  todos
});


// react: functional components
// ----------------------------
const todoItems = (todos, refine) => todos.map( todo => {
  const toggleTodo = () => store.dispatch({ type: 'TOGGLE_COMPLETED_TODO', id: todo.id });
  const style = {
    textDecoration: todo.completed ? 'line-through' : 'none',
    display: ((todo.completed && refine === 'ACTIVE') || ((!todo.completed) && refine === 'COMPLETED')) ?
      'none' : 'block'
  };
  return <li key={todo.id} onClick={toggleTodo} style={style}>{todo.text}</li>;
});

const refinementItems = refinenment => ['all','completed','active'].map( (refine, i) => {
  const refineStateValue = refine.toUpperCase();
  const refineTodos = () => store.dispatch({ type: 'REFINE_TODOS', refine: refineStateValue });
  const style = { textDecoration: refinenment === refineStateValue ? 'underline' : 'none' };
  return <li key={i} onClick={refineTodos} style={style}>{refine}</li>;
});

const TodoApp = stamp.compose({
  addTodo () {
    const input = this.refs.input;
    store.dispatch({ type: 'ADD_TODO', text: input.value });
    input.value = '';
  },
  addTodoOnEnter (event) {
    if (event.keyCode === 13) {
      this.addTodo();
    }
  },
  render (){
    return (
      <div>
        <ul>{todoItems(this.props.todos, this.props.refine)}</ul>
        <input onKeyDown={ this.addTodoOnEnter.bind(this) } type="text" ref="input" />
        <button onClick={ this.addTodo.bind(this) }>Add Todo</button>
        <div>Refine by: <ul>{refinementItems(this.props.refine)}</ul></div>
      </div>
    );
  }
});


// initialise application
// ----------------------
// create store with reducer as argument
const store = createStore(reducer);

// render UI on store changes
const render = () => {
  ReactDOM.render(<TodoApp todos={store.getState().todos} refine={store.getState().refine} />, document.getElementById('root'));
};
store.subscribe(render);
render();


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
