import I from 'immutable'

export let createLevel = ({game, startText, endText, isVictory, title, canToggle}) => {
  return I.fromJS({
    game,
    title,
    startText,
    endText,
    isVictory,
    canToggle,
  })
}

export let isVictory = (level) => {
  const game        = level.get('game')
  const victoryFunc = level.get('isVictory')
  return victoryFunc(game)
}
