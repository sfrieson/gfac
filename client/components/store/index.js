import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const countState = {
  clickCount: 0
};

const clickCount = function(state = 0, action) {
  switch (action.type) {
    case 'CLICK':
      console.log('Click heard!', state);
      return state + 1;
    default:
      return state;
  }
}
const me = function (state = {}, action) {
  switch (action.type) {
    case 'FETCH_ME_END':
      return {
        ...state,
        ...action.res
      };
    default:
      return state;
  }
};

const fetches = function (state = {}, action) {
  if (!/^FETCH_/.test(action.type)) return state;
  switch (action.type) {
    case 'FETCH_USER_END':
      return {
        ...state,
        me: action.res
      };
    default:
      return state;
  }
};

const mainReducer = combineReducers({clickCount, fetches, me});

const middleware = applyMiddleware(logger);
const store = createStore(mainReducer, middleware);

export default store;
export const dispatch = store.dispatch;



//
// function focusTab(keyCode){
//   //   // Down key
//   if (keyCode == 40) {
//     console.log('DOWN key pressed');
//     var activeResults = document.querySelectorAll("#search-results")[0].getElementsByClassName("active");
//     console.log(activeResults.length, 'blaaaaaaa');
//     if(document.querySelectorAll('#search-results')[0].getElementsByClassName('active').length != 0){
//       console.log('there is active');
//       let storeTarget = document.getElementById('search-results').getElementsByClassName('active')[0].nextSibling
//       document.getElementById('search-results').getElementsByClassName('active')[0].classList.remove('active')
//       console.log('storeTarget',storeTarget);
//       storeTarget.focus()
//       storeTarget.classList.add('active')
//     }
//     else{
//       console.log('no active');
//       document.getElementById('search-results').firstChild.focus()
//       document.getElementById('search-results').firstChild.classList.add('active')
//     }
//   }
//   // Up key
//   if (keyCode == 38) {
//     console.log('UP key pressed')
//   }
//   return
// }
