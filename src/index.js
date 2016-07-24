import React           from 'react'
import { render }      from 'react-dom'
import App             from './components/App'
import { emptyStore }  from './Store'

const store = emptyStore

const renderApp = (store, state) => {
  render(
    <App store={store} state={state} />,
    document.getElementById('root')
  )
}

store.subscribe(() => renderApp(store, store.getState()))
renderApp(store, store.getState())
