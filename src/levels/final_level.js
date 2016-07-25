import _               from 'lodash'
import * as Game       from '../data/Game'
import * as World      from '../data/World'
import * as Square     from '../data/Square'
import * as Level      from '../data/Level'
import * as U          from '../Utils'

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

export let randomChallenge = ({world, seed}) => {
  const startingSeed      = seed
  const primingIterations = U.randomInt(20)(100)(startingSeed).value
  const clicks            = U.randomInt(5)(20)(startingSeed).value
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

  return {
    maxClicks: clicks,
    start: squareIds.reduce((acc, id) => {
      acc[id] = Square.currentColor(primedWorld.getIn(['squares', id]))
      return acc
    }, {}),
    goal: squareIds.reduce((acc, id) => {
      acc[id] = Square.currentColor(clickedWorld.getIn(['squares', id]))
      return acc
    }, {}),
  }
}

export default Level.createLevel({
  game:      Game.experiment({ world }),
  canToggle: true,
  canUndo:   true,
  title:     "Quaternary",
  startText: "This is the real deal. When you start a test, 10 random challenges will be generated and they'll be different every time.",
  endText:   "Welp. I haven't written any more content than this. If you want to take another test, go to experiment mode and click 'Test' again. That will generate a new set of challenges.",
  generateChallenges: (game) => {
    return _.times(10, () => {
      const seed = U.randomSeed()
      return randomChallenge({world: game.get('cleanWorld'), seed})
    })
  },
  isVictory: (game) => {
    return game.get('mode') === Game.Mode.Challenge
      && game.get('remainingChallenges').count() === 0
  }
})
