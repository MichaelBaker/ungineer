import I               from 'immutable'
import { createStore } from 'redux'
import * as U          from './Utils'
import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'

const handleExperimentAction = (action, state) => {
  if (action.type === 'SelectSquare' ) {
    return Game.actuateSquare(action.id)(state)
  } else if (action.type === 'Undo' ) {
    return Game.undo(state)
  } else {
    return state
  }
}

const isVictory = (game) => I.is(game.get('lab'), game.get('challenge'))

const handleChallengeAction = (action, state) => {
  if (action.type === 'SelectSquare' ) {
    const newGame = Game.actuateSquare(action.id)(state)
    if (isVictory(newGame)) {
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
  Undo: () => { return { type: 'Undo' } },
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

const createChallenge = (world) => {
  const seed = U.randomSeed()
  const game = Game.challenge({ world, seed })

  if (isVictory(game)) {
    return createChallenge(world)
  } else {
    return game
  }
}

export const emptyStore = createStore((state = Game.experiment({ world }), action) => {
  if (action.type === 'ToggleMode' ) {
    if (Game.gameMode(state) === Game.Mode.Experiment) {
      return createChallenge(state.get('cleanWorld'))
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
