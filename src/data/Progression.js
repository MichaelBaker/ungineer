import I         from 'immutable'
import * as Game from './Game'

export let createProgression = ({ progression }) => {
  return I.fromJS({
    level:       progression[0]['level'],
    progression: progression,
    levelIndex:  0,
  })
}

export let nextLevel = (progression) => {
  const index = progression.get('levelIndex') + 1
  const level = progression.getIn(['progression', index, 'level'])

  if (level) {
    return { level, index }
  } else {
    return {}
  }
}

export let previousLevel = (progression) => {
  const index = progression.get('levelIndex') - 1
  const level = progression.getIn(['progression', index, 'level'])

  if (index >= 0 && level) {
    return { level, index }
  } else {
    return {}
  }
}

export let progress = (progression) => {
  const { level, index } = nextLevel(progression)

  if (level) {
    return progression
      .set('level',      level)
      .set('levelIndex', index)
  } else {
    return progression
  }
}

export let regress = (progression) => {
  const { level, index } = previousLevel(progression)

  if (level) {
    return progression
      .set('level',      level)
      .set('levelIndex', index)
  } else {
    return progression
  }
}

export let toggleMode = (progression) => {
  const level      = progression.get('level')
  const game       = level.get('game')
  const challenges = I.fromJS(level.get('generateChallenges')(game))

  return progression.updateIn(['level', 'game'], (game) => {
    return Game.toggleMode(game.set('challenges', challenges))
  })
}

export let undo = (progression) => {
  return progression.updateIn(['level', 'game'], (game) => {
    return Game.undo(game)
  })
}
