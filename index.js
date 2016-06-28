import sha256 from 'sha256'
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import createLogger from 'redux-logger';

const logger = createLogger();
const SET_SHAPES = 'SET_SHAPES',
  BROKEN_LINK = 'BROKEN_LINK'

const rootReducer = (state = [], action) => {
  switch (action.type) {
    case SET_SHAPES:
      return [
        ...action.payload
      ]
    case BROKEN_LINK:
      console.error('The link is broken. Error: ' + action.err)
      return [
        action.err
      ]
  }
}

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
)

const getLink = () => {
  return fetch('https://api.shamandev.com').then(
    data => data.text(),
    error => console.error(error)
  )
}

const setShapes = (txt) => {
  let msg = sha256(txt).replace(/\D+/g, '')

  for (let i = msg.length; i > 0; i--) {
    if (msg[i] > 4 && msg[i] < 100) {
      msg = msg[i]
      break
    }
  }

  let arr = []
  while (msg > 0) {
    arr.push(Math.floor(Math.random() * 99) + 1)
    msg--
  }

  return {
    type: SET_SHAPES,
    payload: arr
  }
}

const brokenLink = err => {
  return {
    type: BROKEN_LINK,
    err: err
  }
}

const sortShapes = function (){
  console.log('in sortShapes')
  return {
    type: SET_SHAPES,
    payload: arguments[0].slice().sort()
  }
}

const getShapes = () => {
  return dispatch => {
    return getLink().then(
      link => dispatch(setShapes(link)),
      err => dispatch(brokenLink(err))
    )
  }
}

store.dispatch(
  getShapes()
)

const App = (
  props
) => {
  let result,
    sum = -190,
    viewBox = '',
    sortHandler = store.dispatch.bind(null, sortShapes.bind(null, props.shapes))

  if (props.shapes) {
    result = props.shapes.map((radius, i)=> {
      sum += radius + 200
      return <circle key={i} r={radius} cx={sum} cy="100" fill="#333" stroke="black"><span class="radius" style={{color: 'white'}}>{radius}</span></circle>
    })
  }
  sum *= 1.1
  sum = Math.abs(sum)
  viewBox += '0 0 ' + sum.toString() + ' 200'

  return (
    <div>
      <svg viewBox={viewBox}>
        <g>
          {result}
        </g>
      </svg>
      <button onClick={sortHandler}>SORT</button>
    </div>
  )
}

const render = () => {
  ReactDOM.render(
    <App shapes={store.getState()} />,
    document.getElementById('root')
  )
}

store.subscribe(render)
render()

