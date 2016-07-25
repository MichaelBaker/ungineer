import I               from 'immutable'
import { createStore } from 'redux'
import * as U          from './Utils'
import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'
import * as Prog       from './data/Progression'
import * as Level      from './data/Level'
import Tutorial00      from './levels/tutorial_00'
import Tutorial01      from './levels/tutorial_01'
import FinalLevel      from './levels/final_level'


const startState = Prog.createProgression({
  progression: [
    { level: Tutorial00 },
    { level: Tutorial01 },
    { level: FinalLevel },
  ],
})

export const Action = {
  SelectSquare: ({squareId}) => { return { type: 'SelectSquare', squareId } },
  Progress: () => { return { type: 'Progress' } },
  Regress: () => { return { type: 'Regress' } },
  ToggleMode: () => { return { type: 'ToggleMode' } },
  Undo: () => { return { type: 'Undo' } },
}

export const emptyStore = createStore((state = startState, action) => {
  if (action.type === 'SelectSquare' ) {
    const mode = Game.gameMode(state.getIn(['level', 'game']))
    if (mode === Game.Mode.Experiment) {
      return state.updateIn(['level', 'game'], (game) => {
        return Game.actuateSquare(action.squareId)(game)
      })
    } else if (mode === Game.Mode.Challenge) {
      return state.updateIn(['level', 'game'], (game) => {
        const clicksRemaining = game.get('clicksRemaining')
        if (clicksRemaining === 0) {
          return game
        } else if (!clicksRemaining) {
          return Game.tryChallengeComplete(Game.actuateSquare(action.squareId)(game))
        } else {
          const clickedGame = game.set('clicksRemaining', clicksRemaining - 1)
          return Game.tryChallengeComplete(Game.actuateSquare(action.squareId)(clickedGame))
        }
      })
    }
  } else if (action.type === 'Undo') {
    return Prog.undo(state)
  } else if (action.type === 'Progress') {
    return Prog.progress(state)
  } else if (action.type === 'Regress') {
    return Prog.regress(state)
  } else if (action.type === 'ToggleMode') {
    return Prog.toggleMode(state)
  } else {
    return state
  }
})
