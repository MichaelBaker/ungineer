import I               from 'immutable'
import * as Transit    from 'transit-immutable-js'
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

const defaultState = Prog.createProgression({
  progression: [
    { level: Tutorial00 },
    { level: Tutorial01 },
    { level: FinalLevel },
  ],
})

export const Action = {
  UpdateLevelData: (data) => { return { type: 'UpdateLevelData', data: I.fromJS(data) } },
  SetLevelData:    (data) => { return { type: 'SetLevelData',    data: I.fromJS(data) } },
  // SelectSquare: ({squareId}) => { return { type: 'SelectSquare', squareId } },
  // Progress: () => { return { type: 'Progress' } },
  // Regress: () => { return { type: 'Regress' } },
  // ToggleMode: () => { return { type: 'ToggleMode' } },
  // Undo: () => { return { type: 'Undo' } },
}

export const makeStore = (startState) => {
  const initialState = startState || defaultState
  return createStore((state = initialState, action) => {
    const newState = (() => {
      if (action.type === 'UpdateLevelData') {
        return state.updateIn(['level', 'state'], (state) => state.mergeDeep(action.data))
      } else if (action.type === 'SetLevelData') {
        return state.setIn(['level', 'state'], action.data)
      } else {
        return state
      }
    })()

    localStorage.setItem('gameState', Transit.toJSON(newState))
    return newState
  })
}
