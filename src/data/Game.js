import I from 'immutable'

export let Mode = {
  Experiment: "experiment",
  Challenge:  "challenge",
}

export let emptyGame = I.fromJS({
  mode: Mode.Experiment,
})
