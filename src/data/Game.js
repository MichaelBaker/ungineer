import I           from 'immutable'
import * as Square from './Square.js'
import * as U      from '../Utils'

export let Mode = {
  Experiment: "experiment",
  Challenge:  "challenge",
}

export let emptyGame = I.fromJS({
  mode: Mode.Experiment,
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
  },
})

export let cycleColor = U.curry((squareId, game) => {
  return game.updateIn(['squares', squareId], (square) => {
    return Square.cycleColor(square)
  })
})

export let react = U.curry((exceptSquareIds, originalGame) => {
  const imutIds = I.fromJS(exceptSquareIds)
  const squares = originalGame.get('squares')
  return squares.keySeq().reduce((newGame, squareId) => {
    if (imutIds.includes(squareId)) {
      return newGame
    } else {
      return newGame.updateIn(['squares', squareId], (square) => {
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
