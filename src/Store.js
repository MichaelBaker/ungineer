import { createStore } from 'redux'
import * as Game       from './data/Game'
import * as U          from './Utils'

export const Action = {
  ToggleMode: () => { return { type: 'ToggleMode' } },
  SelectSquare: ({ id }) => { return { type: 'SelectSquare', id } },
}

export const emptyStore = createStore((state = Game.emptyGame, action) => {
  if (action.type === 'ToggleMode' ) {
    if (state.get('mode') === Game.Mode.Experiment) {
      return state.set('mode', Game.Mode.Challenge)
    } else {
      return state.set('mode', Game.Mode.Experiment)
    }
  } else if (action.type === 'SelectSquare' ) {
    return U.compose([Game.cycleColor(action.id), Game.react([action.id])])(state)
  } else {
    return state
  }
})
