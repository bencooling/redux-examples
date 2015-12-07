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
// split reducers for different parts of the state tree
// reducer function signature accepts a state and action
const refine = (state = 'All', action) => (action.type === 'REFINE_TODOS') ? action.refine : state;

const todos = (state = [], action) => {
  if (action.type === 'ADD_TODO') {
    return [ { id: (state.length + 1), text: action.text, disabled: true, completed: false }, ...state ];
  }
  if (action.type === 'DELETE_TODO') {
    return state.filter(todo => todo.id !== action.id )
  }
  if (action.type === 'TOGGLE_COMPLETED_TODO') {
    return state.map( todo => (todo.id !== action.id) ?
      todo :
      Object.assign({}, todo, { completed: !todo.completed })
    );
  }
  if (action.type === 'EDIT_TODO') {
    return state.map( todo => (todo.id !== action.id) ?
      todo :
      Object.assign({}, todo, { disabled: action.disabled })
    );
  }
  return state;
};

// root reducer: shape of single state tree
const reducer = combineReducers({
  refine, // es6 shorthand equivalent to refine: refine
  todos
});


// redux: action creators
// ----------------------
// pure functions for computing actions to be dispatched
const addTodo = text => { return { type: 'ADD_TODO', text }; };
const toggleCompletedTodo = id => { return { type: 'TOGGLE_COMPLETED_TODO', id }; };
const deleteTodo = id => { return { type: 'DELETE_TODO', id }; };
const refineTodos = refine => { return { type: 'REFINE_TODOS', refine }; };
const editTodo = (id, disabled) => { return { type: 'EDIT_TODO', id, disabled }; }


// react: functional components
// ----------------------------
// all components are presentation/dumb components
// state and callbacks that dispatch actions to edit state are passed through as props
// this keyword for accessing mutable form fields in callbacks is provided by stamp composition (no new keyword)

const TodoInput = stamp.compose({
  render (){
    const {id, disabled, completed, text, readableTodo, writeableTodo} = this.props;
    return <input ref="input" disabled={ disabled } defaultValue={ text }
    style={ { textDecoration: (completed) ? 'line-through': 'none' } }
    onBlur={ () => { readableTodo(id) } }
    onDoubleClick={ () => { writeableTodo(id) } }
    onKeyDown= { (event) => {
      if (event.keyCode === 13) {
        this.refs.input.blur(); // <- why we need stamp.compose
      }
    }} />;
  }
});

const TodoCheckbox = ({id, completed, toggleCompletedTodo}) =>
  <input type="checkbox" checked={ completed } onClick={ () => toggleCompletedTodo(id) } />;

const TodoList = ({todos, events}) =>
  <ul>{todos.map(todo =>
    <li key={todo.id}>
      <TodoCheckbox { ...Object.assign({}, todo, events) }  />
      <TodoInput { ...Object.assign({}, todo, events) } />
      <div onClick={ () => { events.deleteTodo(todo.id); } }>&times;</div>
    </li>)}
  </ul>;

const RefineList = ({refine, refineTodos}) =>
  <ul>{['All','Completed','Active'].map( (r, i) =>
    <li key={i}
        onClick={() => refineTodos(r) }
        style={{ textDecoration: r === refine ? 'underline' : 'none' }}>
      {r}
    </li>)}
  </ul>;

const TodoField = stamp.compose({
  render (){
    return <input type="text" ref="input" onKeyDown={ event => {
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

// root component (still presentation/dumb!)
const App = ({ todos, refine, deleteTodo, toggleCompletedTodo, addTodo, refineTodos, writeableTodo, readableTodo }) =>
<div>
  <TodoList
    todos={ refinedTodos(refine, todos) }
    events={ { toggleCompletedTodo, writeableTodo, readableTodo, deleteTodo } }
  />
  <TodoField addTodo={ addTodo } />
  <div>Refine by: <RefineList refine={refine} refineTodos={refineTodos } /></div>
  <p> {todos.length - (refinedTodos('Completed', todos)).length} items left</p>
</div>;


// redux: inject into root component
// ---------------------------------
const store = createStore(reducer);

// Wrap the root component with connect to inject dispatch and state into it
// Considered a container component, aware of redux
const TodoApp = connect(
  state => state,
  dispatch => { return {
    toggleCompletedTodo: id => dispatch(toggleCompletedTodo(id)),
    addTodo: text => dispatch(addTodo(text)),
    deleteTodo: id => dispatch(deleteTodo(id)),
    refineTodos: refine => dispatch(refineTodos(refine)),
    writeableTodo: id => dispatch(editTodo(id, false)),
    readableTodo: id => dispatch(editTodo(id, true))
  }}
)(App);

render(
  <Provider store={store}><TodoApp /></Provider>,
  document.getElementById('root')
);


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
