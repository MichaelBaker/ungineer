import I           from 'immutable'
import * as U      from '../Utils'
import * as Square from './Square'

export let createWorld = ({squares}) => {
  return I.fromJS({squares})
}

export let cycleColor = U.curry((squareId, world) => {
  return world.updateIn(['squares', squareId], (square) => {
    return Square.cycleColor(square)
  })
})

export let react = U.curry((exceptSquareIds, originalWorld) => {
  const imutIds = I.fromJS(exceptSquareIds)
  const squares = originalWorld.get('squares')
  return squares.keySeq().reduce((newWorld, squareId) => {
    if (imutIds.includes(squareId)) {
      return newWorld
    } else {
      return newWorld.updateIn(['squares', squareId], (square) => {
        const newColor = square.get('reaction')(squares)
        if (newColor) {
          return Square.cycleToColor(newColor)(square)
        } else {
          return square
        }
      })
    }
  }, originalWorld)
})

export let actuateSquare = (squareId) => {
  return U.compose([cycleColor(squareId), react([squareId])])
}

export let setColors = U.curry((mapping, world) => {
  return mapping.reduce((acc, color, squareId) => {
    return acc.updateIn(['squares', squareId], (square) => {
      return Square.cycleToColor(color)(square)
    })
  }, world)
})
