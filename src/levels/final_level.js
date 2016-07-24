import * as Game       from './data/Game'
import * as World      from './data/World'
import * as Square     from './data/Square'

const world = World.createWorld({
  squares: {
    0: Square.createSquare({ id: '0', colors: ['red', 'blue', 'green', 'yellow'], reaction: (squares) => {
      const otherOne = squares.get('1')
      const otherTwo = squares.get('2')
      if (Square.currentColor(otherOne) === 'blue') {
        return 'red'
      } else if (Square.currentColor(otherTwo) === 'red' || Square.currentColor(otherTwo) === 'yellow') {
        return 'green'
      } else {
        return Square.currentColor(squares.get('3'))
      }
    } }),
    1: Square.createSquare({ id: '1', colors: ['blue', 'green', 'yellow', 'red'], reaction: (squares) => {
      const other = squares.get('3')
      if (Square.currentColor(other) === 'green') {
        return 'blue'
      } else if (Square.currentColor(other) === 'blue') {
        return 'red'
      } else if (Square.currentColor(other) === 'red') {
        return 'green'
      } else {
        return 'yellow'
      }
    } }),
    2: Square.createSquare({ id: '2', colors: ['green', 'yellow', 'red', 'blue'], reaction: (squares) => {
      const otherOne   = squares.get('1')
      const otherTwo   = squares.get('3')
      const otherThree = squares.get('0')
      if (Square.currentColor(otherOne) === 'yellow') {
        return 'blue'
      } else if(Square.currentColor(otherTwo) === 'yellow') {
        return 'green'
      } else if(Square.currentColor(otherThree) === 'yellow') {
        return 'red'
      }
    } }),
    3: Square.createSquare({ id: '3', colors: ['yellow', 'red', 'blue', 'green'], reaction: (squares) => {
      const otherOne = squares.get('0')
      const otherTwo = squares.get('1')
      if (Square.currentColor(otherOne) === 'red' && Square.currentColor(otherTwo) === 'blue') {
        return 'blue'
      }
    } }),
  }
})

const createChallenge = (world) => {
  const seed = U.randomSeed()
  const game = Game.challenge({ world, seed })

  if (isVictory(game)) {
    return createChallenge(world)
  } else {
    return game
  }
}

const isVictory = (game) => I.is(game.get('lab'), game.get('challenge'))

const handleChallengeAction = (action, state) => {
  if (action.type === 'SelectSquare' ) {
    const newGame = Game.actuateSquare(action.id)(state)
    if (isVictory(newGame)) {
      return newGame.set('victory', true)
    } else {
      return newGame
    }
  } else {
    return state
  }
}

