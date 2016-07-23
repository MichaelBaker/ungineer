import I           from 'immutable'
import * as Square from './Square'
import * as U      from '../Utils'
import * as World  from './World'

export let Mode = {
  Experiment: "experiment",
  Challenge:  "challenge",
}

export let gameMode = (game) => {
  return game.get('mode')
}

export let experiment = ({world}) => I.fromJS({
  mode:       Mode.Experiment,
  cleanWorld: world,
  lab:        world,
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
