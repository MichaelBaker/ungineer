import I from 'immutable'

export let createSquare = ({id, colors}) => {
  return I.fromJS({
    id:     id,
    colors: colors,
  })
}
