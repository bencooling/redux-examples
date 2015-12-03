import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// reducers for different parts of the state tree
const refine = (state = 'ALL', action) => (action.type === 'REFINE_TODOS') ? action.refine : state;

const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      return [ ...state, { id: (state.length + 1), text: action.text, completed: false } ];
      break;
    case 'TOGGLE_COMPLETED_TODO':
      return state.map( todo => (todo.id !== action.id) ?
        todo :
        Object.assign({}, todo, { completed: !todo.completed })
      );
      break;
    default:
      return state;
  }
};

// reducer can be identified by its function signature; accepts state and action
const reducer = combineReducers({
  refine, // es6 shorthand equivalent to refine: refine
  todos
});

// alert('changed!');

const Items = ({text}) => <li>{text}</li>;

const TodoApp = ({addTodo}) => {
  const items = store.getState().todos.map( todo => <Items key={todo.id} text={todo.text} /> );
  console.log(store.getState());
  return (
    <div>
      <ul>{items}</ul>
      <button onClick={ addTodo }>Add Todo</button>
    </div>
  );
};



// create store with reducer as argument
const store = createStore(reducer);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Walk Zahnee'
});
store.dispatch({
  type: 'ADD_TODO',
  text: 'Feed Zahnee'
});

// // Update UI
const render = () => {
  ReactDOM.render(
    <TodoApp onClick={ () => store.dispatch({ type: 'ADD_TODO', text: 'Breathe'}) } />,
    document.getElementById('root')
  );
};

// subscriber
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
