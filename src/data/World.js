import I from 'immutable'

export let createWorld = ({squares}) => {
  return I.fromJS({squares})
}
