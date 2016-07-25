import I from 'immutable'

export let createLevel = ({game, startText, endText, isVictory, title, canToggle, generateChallenges, canUndo, key}) => {
  return I.fromJS({
    game,
    title,
    startText,
    endText,
    isVictory,
    canToggle,
    generateChallenges,
    canUndo,
    key,
  })
}

export let isVictory = (level) => {
  const game        = level.get('game')
  const victoryFunc = level.get('isVictory')
  return victoryFunc(game)
}
