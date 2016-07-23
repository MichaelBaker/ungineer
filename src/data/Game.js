import I           from 'immutable'
import * as Square from './Square'
import * as U      from '../Utils'
import * as World  from './World'

export let Mode = {
  Experiment: "experiment",
  Challenge:  "challenge",
}

const cleanWorld = World.createWorld({
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

export let emptyGame = I.fromJS({
  mode:       Mode.Experiment,
  cleanWorld: cleanWorld,
  lab:        cleanWorld,
})

export let cycleColor = U.curry((squareId, game) => {
  return game.updateIn(['lab', 'squares', squareId], (square) => {
    return Square.cycleColor(square)
  })
})

export let react = U.curry((exceptSquareIds, originalGame) => {
  const imutIds = I.fromJS(exceptSquareIds)
  const squares = originalGame.getIn(['lab', 'squares'])
  return squares.keySeq().reduce((newGame, squareId) => {
    if (imutIds.includes(squareId)) {
      return newGame
    } else {
      return newGame.updateIn(['lab', 'squares', squareId], (square) => {
        const newColor = square.get('reaction')(squares)
        if (newColor) {
          return Square.cycleToColor(newColor)(square)
        } else {
          return square
        }
      })
    }
  }, originalGame)
})
