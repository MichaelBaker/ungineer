import React         from 'react'
import Redux         from 'redux'
import { render }    from 'react-dom'
import App           from './components/App'
import { emptyGame } from './data/Game'

const store = Redux.createStore((state = emptyGame, action) => {
  switch (action.type) {
    default:
      return state
  }
})

const renderApp = (game) => {
  render(
    <App game={game} />,
    document.getElementById('root')
  )
}

store.subscribe(() => renderApp(store.getState()))
