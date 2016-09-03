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
  UpdateLevel: (data) => { return { type: 'UpdateLevel', data: I.fromJS(data) } },
  // SelectSquare: ({squareId}) => { return { type: 'SelectSquare', squareId } },
  // Progress: () => { return { type: 'Progress' } },
  // Regress: () => { return { type: 'Regress' } },
  // ToggleMode: () => { return { type: 'ToggleMode' } },
  // Undo: () => { return { type: 'Undo' } },
}

export const emptyStore = createStore((state = startState, action) => {
  if (action.type === 'UpdateLevel') {
    return state.updateIn(['level', 'state'], (state) => state.mergeDeep(action.data))
  } else {
    return state
  }
})
