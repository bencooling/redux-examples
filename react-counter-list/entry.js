import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// in development:
// nodemon --exec babel-node entry.js

// composable utility functions
const appendToArray = (arr, i) => [...arr, i];
const removeFromArrayByIndex = (arr, i) => [ ...arr.slice(0, i), ...arr.slice(i + 1) ];

// business logic
const addCounter = appendToArray;
const removeCounter = removeFromArrayByIndex;
const incrementCounter = (arr, i) => [
  ...arr.slice(0, i),
  arr[i] + 1,
  ...arr.slice(i + 1)
];
const toggleCompleted = todo => Object.assign({}, todo, { completed: !todo.completed });

// tests
const testToggleCompleted = () => {
  const beforeTodo = deepFreeze({ id: 0, text: 'Walk dog', completed: false });
  const afterTodo = { id: 0, text: 'Walk dog', completed: true };

  expect(toggleCompleted(beforeTodo)).toEqual(afterTodo);
};
testToggleCompleted();

const testIncrementCounter = () => {
  const beforeList = deepFreeze([1,1,1]);
  const afterList = [1,2,1];

  expect(incrementCounter(beforeList, 1)).toEqual(afterList);
};
testIncrementCounter();

const testRemoveCounter = () => {
  const beforeList = deepFreeze([1,2,3]);
  const afterList = [1,3];

  expect(removeFromArrayByIndex(beforeList, 1)).toEqual(afterList);
};
testRemoveCounter();

const testAddCounter = () => {
  const beforeList = deepFreeze([]);
  const afterList = [0];

  expect(appendToArray(beforeList, 0)).toEqual(afterList);
};
testAddCounter();

console.log('tests passed');

const reducers = {
  add (state, action) {
    const {id, text} = action;
    return [ ...state, { id, text, completed: false } ];
  },
  toggle (state, action) {
    return state.map( todo => (todo.id !== action.id) ?
      todo :
      Object.assign({}, todo, { completed: !todo.completed })
    );
  }
};

// reducer can be identified by its function signature; accepts state and action
const todos = (state = [], action) => {
  const reducerType = action.type.replace('_TODO', '').toLowerCase();
  const reducer = reducers[reducerType];
  if (reducer && typeof reducer === 'function'){
    state = reducer(state, action);
  }
  return state;
};

const testAddTodo = () => {
  const stateBefore = deepFreeze([]);
  const stateAfter = [
    {
      id: 0,
      text: 'Walk dog',
      completed: false
    }
  ];
  expect(todos(stateBefore, {type: 'ADD_TODO', id:0, text: 'Walk dog'})).toEqual(stateAfter);
};
testAddTodo();

const testToggleTodos = () => {
  const stateBefore = deepFreeze([
    { id: 0, text: 'Walk dog', completed: false },
    { id: 1, text: 'Feed dog', completed: false }
  ]);
  const stateAfter = [
    { id: 0, text: 'Walk dog', completed: false },
    { id: 1, text: 'Feed dog', completed: true }
  ];
  expect(todos(stateBefore, { type: 'TOGGLE_TODO', id:1 })).toEqual(stateAfter);
};
testToggleTodos();

// // component as pure function
// const Counter = ({count, onIncrement, onDecrement}) => (
//   <div>
//     <h1>{count}</h1>
//     <button onClick={ onIncrement }>+</button>
//     <button onClick={ onDecrement }>-</button>
//   </div>
// );
//
// // app state
// // single plain object (read-only)
// const initialState = 99;
//
// // TODO: Add tests
// const actions = {
//   INCREMENT (state) { return state + 1; },
//   DECREMENT (state) { return state - 1; }
// };
//
// // reducer
// // pure function return new state from previous state + action
// const reducer = (state = initialState, action) => {
//   const key = action.type;
//   if (actions[key]){
//     return actions[key](state);
//   }
//   return state;
// };
//
// // create store with reducer as argument
// const store = createStore(reducer);
//
// // Update UI
// const render = () => {
//   ReactDOM.render(
//     <Counter
//       count={ store.getState() }
//       onIncrement={ () => store.dispatch({ type: 'INCREMENT' }) }
//       onDecrement={ () => store.dispatch({ type: 'DECREMENT' }) }
//     />,
//     document.getElementById('root')
//   );
// };
//
// // subscriber
// store.subscribe(render);
// render();
