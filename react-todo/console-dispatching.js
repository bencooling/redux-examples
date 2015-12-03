console.log( store.getState() );

console.log('dispatching ADD');

store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Walk Zahnee'
});
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Feed Zahnee'
});

console.log( store.getState() );

console.log('dispatching TOGGLE');

store.dispatch({
  type: 'TOGGLE_COMPLETED_TODO',
  id: 0
});

console.log( store.getState() );

store.dispatch({
  type: 'REFINE_TODOS',
  refine: 'COMPLETED'
});

console.log( store.getState() );
