import I               from 'immutable'
import { createStore } from 'redux'
import * as U          from './Utils'
import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'
import * as Prog       from './data/Progression'
import Tutorial00      from './levels/tutorial_00'


const startState = Prog.createProgression({
  progression: [
    { level: Tutorial00 },
    { level: Tutorial00 },
  ],
})

export const Action = {
  SelectSquare: ({squareId}) => { return { type: 'SelectSquare', squareId } },
  Progress: () => { return { type: 'Progress' } },
  Regress: () => { return { type: 'Regress' } },
}

export const emptyStore = createStore((state = startState, action) => {
  if (action.type === 'SelectSquare' ) {
    return state.updateIn(['level', 'game'], (game) => {
      return Game.actuateSquare(action.squareId)(game)
    })
  } else if (action.type === 'Progress') {
    return Prog.progress(state)
  } else if (action.type === 'Regress') {
    return Prog.regress(state)
  } else {
    return state
  }
})
