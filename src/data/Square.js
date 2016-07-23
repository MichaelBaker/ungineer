import I      from 'immutable'
import * as U from '../Utils'

export let createSquare = ({id, colors, reaction}) => {
  return I.fromJS({
    id:       id,
    colors:   colors,
    reaction: reaction,
  })
}

export let cycleColor = (square) => {
  const colors = square.get('colors')
  const color  = colors.first()
  return square.set('colors', colors.shift().push(color))
}

export let cycleToColor = U.curry((color, square) => {
  if (currentColor(square) === color) {
    return square
  } else {
    return cycleToColor(color)(cycleColor(square))
  }
})

export let currentColor = (square) => square.getIn(['colors', 0])
