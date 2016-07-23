import { createStore } from 'redux'
import * as Game       from './data/Game'
import * as U          from './Utils'

const handleExperimentAction = (action, state) => {
  if (action.type === 'SelectSquare' ) {
    return U.compose([Game.cycleColor(action.id), Game.react([action.id])])(state)
  } else {
    return state
  }
}

const handleChallengeAction = (action, state) => {
  return state
}

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
  } else if (state.get('mode') === Game.Mode.Challenge) {
    return handleChallengAction(action, state)
  } else if (state.get('mode') === Game.Mode.Experiment) {
    return handleExperimentAction(action, state)
  } else {
    return state
  }
})
