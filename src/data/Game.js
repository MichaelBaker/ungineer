import I from 'immutable-js'

export let Mode = {
  Experiment: "experiment",
  Challenge:  "challenge",
}

export let emptyGame = I.fromJS({
  mode: Mode.Experiment,
})
