import { createStore }     from 'redux'
import { emptyGame, Mode } from './data/Game'

export const Action = {
  ToggleMode: () => { return { type: 'ToggleMode' } },
  SelectSquare: ({ id }) => { return { type: 'SelectSquare', id } },
}

export const emptyStore = createStore((state = emptyGame, action) => {
  if (action.type === 'ToggleMode' ) {
    if (state.get('mode') === Mode.Experiment) {
      return state.set('mode', Mode.Challenge)
    } else {
      return state.set('mode', Mode.Experiment)
    }
  } else if (action.type === 'SelectSquare' ) {
    return state.updateIn(['squares', action.id, 'colors'], (colors) => {
      const color = colors.first()
      return colors.shift().push(color)
    })
  } else {
    return state
  }
})
