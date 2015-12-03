// in development:
// nodemon --exec babel-node entry.js
import { createStore } from 'redux';

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
const render = () => console.log(store.getState());

// subscriber
store.subscribe(render);
render();

// dispatcher
store.dispatch({ type: 'DECREMENT' });
