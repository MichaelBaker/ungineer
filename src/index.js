import React          from 'react'
import { render }     from 'react-dom'
import * as Transit   from 'transit-immutable-js'
import App            from './components/App'
import { makeStore }  from './Store'

const initialState = (() => {
  const startState = localStorage.getItem('gameState')
  if (startState) {
    return Transit.fromJSON(startState)
  }
})()

const store = makeStore(initialState)

const renderApp = (store, state) => {
  render(
    <App store={store} state={state} />,
    document.getElementById('root')
  )
}

store.subscribe(() => renderApp(store, store.getState()))
renderApp(store, store.getState())
