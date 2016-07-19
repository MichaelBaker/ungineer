import I                from 'immutable'
import { createSquare } from './Square.js'

export let Mode = {
  Experiment: "experiment",
  Challenge:  "challenge",
}

export let emptyGame = I.fromJS({
  mode: Mode.Experiment,
  squares: {
    0: createSquare({ id: '0', colors: ['red', 'blue', 'green', 'yellow'] }),
    1: createSquare({ id: '1', colors: ['blue', 'green', 'yellow', 'red'] }),
    2: createSquare({ id: '2', colors: ['green', 'yellow', 'red', 'blue'] }),
    3: createSquare({ id: '3', colors: ['yellow', 'red', 'blue', 'green'] }),
  },
})
