import I               from 'immutable'
import * as Transit    from 'transit-immutable-js'
import { createStore } from 'redux'
import * as U          from './Utils'
import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'
import * as Level      from './data/Level'
import Levels          from './Levels'

const defaultState = I.fromJS({
  level: Levels.Tutorial00.startState,
})

export const Action = {
  UpdateLevelData: (data)      => { return { type: 'UpdateLevelData', data: I.fromJS(data) } },
  SetLevelData:    (data)      => { return { type: 'SetLevelData',    data: I.fromJS(data) } },
  StartLevel:      (levelName) => { return { type: 'StartLevel', levelName } },
}

export const makeStore = (startState) => {
  const initialState = startState || defaultState
  return createStore((state = initialState, action) => {
    const newState = (() => {
      if (action.type === 'UpdateLevelData') {
        return state.updateIn(['level', 'state'], (state) => state.mergeDeep(action.data))
      } else if (action.type === 'SetLevelData') {
        return state.setIn(['level', 'state'], action.data)
      } else if (action.type === 'StartLevel') {
        return I.fromJS({ level: Levels[action.levelName].startState })
      } else {
        return state
      }
    })()

    localStorage.setItem('gameState', Transit.toJSON(newState))
    return newState
  })
}
