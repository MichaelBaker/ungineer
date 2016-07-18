import { createStore }     from 'redux'
import { emptyGame, Mode } from './data/Game'

export const Action = {
  ToggleMode: () => { return { type: 'ToggleMode' } }
}

export const emptyStore = createStore((state = emptyGame, action) => {
  if (action.type === 'ToggleMode' ) {
    if (state.get('mode') === Mode.Experiment) {
      return state.set('mode', Mode.Challenge)
    } else {
      return state.set('mode', Mode.Experiment)
    }
  } else {
    return state
  }
})
