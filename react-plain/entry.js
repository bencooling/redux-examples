import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

// component as pure function
const Counter = ({count, onIncrement, onDecrement}) => (
  <div>
    <h1>{count}</h1>
    <button onClick={ onIncrement }>+</button>
    <button onClick={ onDecrement }>-</button>
  </div>
);

// app state
// single plain object (read-only)
const initialState = 99;

// TODO: Add tests
const actions = {
  INCREMENT (state) { return state + 1; },
  DECREMENT (state) { return state - 1; }
};

// reducer
// pure function return new state from previous state + action
const reducer = (state = initialState, action) => {
  const key = action.type;
  if (actions[key]){
    return actions[key](state);
  }
  return state;
};

// create store with reducer as argument
const store = createStore(reducer);

// Update UI
const render = () => {
  ReactDOM.render(
    <Counter
      count={ store.getState() }
      onIncrement={ () => store.dispatch({ type: 'INCREMENT' }) }
      onDecrement={ () => store.dispatch({ type: 'DECREMENT' }) }
    />,
    document.getElementById('root')
  );
};

// subscriber
store.subscribe(render);
render();
