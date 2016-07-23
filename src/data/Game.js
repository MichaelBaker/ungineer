import I           from 'immutable'
import _           from 'lodash'
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

export let cycleColor = U.curry((squareId, game) => {
  return game.update('lab', World.cycleColor(squareId))
})

export let react = U.curry((exceptSquareIds, game) => {
  return game.update('lab', World.react(exceptSquareIds))
})

export let actuateSquare = (squareId) => {
  return U.compose([cycleColor(squareId), react([squareId])])
}

export let experiment = ({world}) => I.fromJS({
  mode:       Mode.Experiment,
  cleanWorld: world,
  lab:        world,
})

export let challenge = ({world, seed}) => {
  const startingSeed      = seed
  const primingIterations = U.randomInt(0)(20)(startingSeed).value
  const clicks            = U.randomInt(4)(8)(startingSeed).value
  const squareIds         = world.get('squares').keySeq()

  let primedWorld = world

  _.times(primingIterations, () => {
    const { value, newSeed } = U.randomElement(squareIds)(seed)
    seed        = newSeed
    primedWorld = World.actuateSquare(value)(primedWorld)
  })

  let clickedWorld = primedWorld

  _.times(clicks, () => {
    const { value, newSeed } = U.randomElement(squareIds)(seed)
    seed         = newSeed
    clickedWorld = World.actuateSquare(value)(clickedWorld)
  })

  return I.fromJS({
    seed,
    clicks,
    startingSeed,
    primingIterations,
    victory:    false,
    mode:       Mode.Challenge,
    cleanWorld: world,
    lab:        primedWorld,
    challenge:  clickedWorld,
  })
}
