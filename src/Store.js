import I               from 'immutable'
import { createStore } from 'redux'
import * as U          from './Utils'
import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'

const handleExperimentAction = (action, state) => {
  if (action.type === 'SelectSquare' ) {
    return Game.actuateSquare(action.id)(state)
  } else {
    return state
  }
}

const handleChallengeAction = (action, state) => {
  if (action.type === 'SelectSquare' ) {
    const newGame = Game.actuateSquare(action.id)(state)
    if (I.is(newGame.get('lab'), newGame.get('challenge'))) {
      return newGame.set('victory', true)
    } else {
      return newGame
    }
  } else {
    return state
  }
}

export const Action = {
  ToggleMode: () => { return { type: 'ToggleMode' } },
  SelectSquare: ({ id }) => { return { type: 'SelectSquare', id } },
}

const world = World.createWorld({
  squares: {
    0: Square.createSquare({ id: '0', colors: ['red', 'blue', 'green', 'yellow'], reaction: (squares) => {
      const other = squares.get('1')
      if (Square.currentColor(other) === 'blue') {
        return 'red'
      } else {
        return 'blue'
      }
    } }),
    1: Square.createSquare({ id: '1', colors: ['blue', 'green', 'yellow', 'red'], reaction: (squares) => {
      const other = squares.get('3')
      if (Square.currentColor(other) === 'green') {
        return 'blue'
      } else {
        return 'yellow'
      }
    } }),
    2: Square.createSquare({ id: '2', colors: ['green', 'yellow', 'red', 'blue'], reaction: (squares) => {
      const otherOne = squares.get('1')
      const otherTwo = squares.get('3')
      if (Square.currentColor(otherOne) === 'yellow') {
        return 'blue'
      } else if(Square.currentColor(otherTwo) === 'yellow') {
        return 'green'
      }
    } }),
    3: Square.createSquare({ id: '3', colors: ['yellow', 'red', 'blue', 'green'], reaction: (squares) => {
      const otherOne = squares.get('0')
      const otherTwo = squares.get('1')
      if (Square.currentColor(otherOne) === 'red' && Square.currentColor(otherTwo) === 'blue') {
        return 'blue'
      }
    } }),
  }
})


export const emptyStore = createStore((state = Game.experiment({ world }), action) => {
  if (action.type === 'ToggleMode' ) {
    if (Game.gameMode(state) === Game.Mode.Experiment) {
      const world = state.get('cleanWorld')
      const seed  = U.randomSeed()
      return Game.challenge({ world, seed })
    } else if (Game.gameMode(state) === Game.Mode.Challenge) {
      const world = state.get('cleanWorld')
      return Game.experiment({ world })
    }
  } else if (Game.gameMode(state) === Game.Mode.Challenge) {
    return handleChallengeAction(action, state)
  } else if (Game.gameMode(state) === Game.Mode.Experiment) {
    return handleExperimentAction(action, state)
  } else {
    return state
  }
})
