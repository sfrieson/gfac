import { createStore } from 'redux';
const reducer = function (state = {}, action) {
  switch (action.type) {
    case 'CLICK':
      console.log('Click heard!');
      return Object.assign({}, state, {clickCount: (state.clickCount || 0) + 1});
      break;
    default:
      return state;
  }
}
const store = createStore(reducer);

export default store;