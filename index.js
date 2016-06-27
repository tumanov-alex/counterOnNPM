import sha256 from 'sha256'
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const SET_SHAPES = 'SET_SHAPES',
  BROKEN_LINK = 'BROKEN_LINK'

const rootReducer = (state = [], action) => {
  switch(action.type){
    case SET_SHAPES:
      return [
        ...action.playload
      ]
    case BROKEN_LINK:
      console.error('The link is broken. Error: ' + action.err)
      return [
        action.err
      ]
    default:
      console.log('default')
  }
}

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

// ERROR #1
const getLink = () => {
  return new Promise(resolve =>
    resolve('erondondon')
    // fetch('https://www.github.com', {mode: 'no-cors'})
  )
}

const setShapes = (txt) => {
  let msg = sha256(txt).replace(/\D+/g, '')

  for(let i = msg.length; i > 0; i--){
    if(msg[i] > 4 && msg[i] < 100){
      msg = msg[i]
      break
    }
  }

  let arr = []
  while(msg > 0){
    arr.push(Math.floor(Math.random() * 99) + 1)
    msg--
  }

  return {
    type: SET_SHAPES,
    playload: arr
  }
}

const brokenLink = err => {
  return {
    type: BROKEN_LINK,
    err: err
  }
}

// ERROR #2
const getShapes = () => {
  return dispatch => {
    return getLink().then(
      link => dispatch(setShapes(link)),
      err => dispatch(brokenLink(err))
    ).then(
      data => {store.dispatch(data)
      // console.log(data)
      }
    )
  }
}

store.dispatch(
  getShapes()
)

const App = (
  shapes
) => (
  <div>
    <svg>
      <g>
        <circle r="50" cx="100" cy="100" fill="#333" stroke="black" />
      </g>
    </svg>
  </div>
)

const render = () => {
  ReactDOM.render(
    <App shapes={store.getState()} />,
    document.getElementById('root')
  )
}

store.subscribe(render)
render()