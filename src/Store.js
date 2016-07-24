import I               from 'immutable'
import { createStore } from 'redux'
import * as U          from './Utils'
import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'
import Tutorial00      from './levels/tutorial_00'

const progression = I.fromJS([
  { level: Tutorial00 },
  { level: Tutorial00 },
])

const startState = I.fromJS({
  level:       progression.getIn([0, 'level']),
  progression: progression,
  levelIndex:  0,
})

export const Action = {
  SelectSquare: ({squareId}) => { return { type: 'SelectSquare', squareId } },
  Progress: () => { return { type: 'Progress' } },
}

export const emptyStore = createStore((state = startState, action) => {
  if (action.type === 'SelectSquare' ) {
    return state.updateIn(['level', 'game'], (game) => {
      return Game.actuateSquare(action.squareId)(game)
    })
  } else if (action.type === 'Progress') {
    const nextLevelIndex = state.get('levelIndex') + 1
    const nextLevel      = state.getIn(['progression', nextLevelIndex, 'level'])

    if (nextLevel) {
      return state
        .set('level',      nextLevel)
        .set('levelIndex', nextLevelIndex)
    } else {
      return state
    }
  } else {
    return state
  }
})
