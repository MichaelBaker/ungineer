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

export let saveHistory = (game) => {
  return game.update('history', (history) => {
    if (history.count() >= game.get('maxHistory')) {
      return history.shift().push(game.get('lab'))
    } else {
      return history.push(game.get('lab'))
    }
  })
}

export let undo = (game) => {
  const history = game.get('history')

  if (history.count() === 0) {
    return game
  } else {
    const lastLab    = history.last()
    const newHistory = history.pop()
    return game.set('lab', lastLab).set('history', newHistory)
  }
}

export let actuateSquare = (squareId) => {
  return U.compose([saveHistory, cycleColor(squareId), react([squareId])])
}

export let randomChallenge = ({world, seed}) => {
  const startingSeed      = seed
  const primingIterations = U.randomInt(100)(1000)(startingSeed).value
  const clicks            = U.randomInt(10)(20)(startingSeed).value
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
    history:    I.fromJS([]),
    maxHistory: 1000,
  })
}

export let challenge = ({world, challenges}) => {
  return I.fromJS({
    mode:                Mode.Challenge,
    cleanWorld:          world,
    lab:                 world,
    challenge:           undefined,
    challenges:          challenges,
    remainingChallenges: challenges,
    history:             [],
    maxHistory:          1000,
  })
}

export let experiment = ({ world, challenges }) => {
  return I.fromJS({
    mode:                Mode.Experiment,
    cleanWorld:          world,
    lab:                 world,
    challenge:           undefined,
    challenges:          challenges,
    remainingChallenges: challenges,
    history:             [],
    maxHistory:          1000,
  })
}

export let activateChallenge = (game) => {
  if (gameMode(game) !== Mode.Challenge)             return game
  if (game.get('remainingChallenges').count() === 0) return game

  const challenge = game.getIn(['remainingChallenges', 0])

  return game
    .set('lab',       World.setColors(challenge.get('start'))(game.get('cleanWorld')))
    .set('challenge', World.setColors(challenge.get('goal'))(game.get('cleanWorld')))
    .set('clicksRemaining', challenge.get('maxClicks'))
}

export let toggleMode = (game) => {
  if (gameMode(game) === Mode.Experiment) {
    return activateChallenge(game
      .set('lab', game.get('cleanWorld'))
      .set('mode', Mode.Challenge)
      .set('remainingChallenges', game.get('challenges'))
      .set('history', I.fromJS([])))
  } else if (gameMode(game) === Mode.Challenge) {
    return game
      .set('lab', game.get('cleanWorld'))
      .set('mode', Mode.Experiment)
      .set('remainingChallenges', I.fromJS([]))
      .set('history', I.fromJS([]))
  } else {
    return game
  }
}

export let tryChallengeComplete = (game) => {
  const lab       = game.get('lab')
  const challenge = game.get('challenge')

  if (!challenge) return game
  if (I.is(lab, challenge)) {
    return activateChallenge(game.update('remainingChallenges', (a) => a.shift()))
  } else {
    return game
  }
}
