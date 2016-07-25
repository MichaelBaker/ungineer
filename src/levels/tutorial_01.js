import * as Level      from '../data/Level'
import * as World      from '../data/World'
import * as Square     from '../data/Square'
import * as Game       from '../data/Game'

const world = World.createWorld({
  squares: {
    0: Square.createSquare({ id: '0', colors: ['red', 'blue', 'green', 'yellow'], reaction: (squares) => {
      const other      = squares.get('1')
      const otherColor = Square.currentColor(other)
      if (otherColor === 'blue') {
        return 'red'
      }
    } }),
    1: Square.createSquare({ id: '1', colors: ['blue', 'green', 'yellow', 'red'], reaction: (squares) => {
      const other      = squares.get('0')
      const otherColor = Square.currentColor(other)
      if (otherColor === 'yellow') {
        return 'green'
      }
    } }),
  }
})

const game = Game.experiment({ world })

export default Level.createLevel({
  game,
  canToggle: true,
  canUndo:   true,
  title:     "Constraints",
  startText: "Here is a simple binary system. The colors of these two widgets are governed by some simple constraints. Figure out what the rules are by changing one of the widgets and noting how the other one changes. Once you understand the rules of the system, you should be able to predict what will happen before you actually click on a widget. You can click 'Undo' to go back one click. Once you think you've figured it out, click 'Test' to test your predictive power.",
  endText:   "Ok, you've either figured out how the system works or you've guessed your way to victory. Either way, a more complicated challenge awaits you.",
  generateChallenges: (game) => {
    return [
      { start: { 0: 'red',   1: 'red'   }, goal: { 0: 'blue',   1: 'red'   }, maxClicks: 1 },
      { start: { 0: 'red',   1: 'blue'  }, goal: { 0: 'red',    1: 'green' }, maxClicks: 1 },
      { start: { 0: 'blue',  1: 'red'   }, goal: { 0: 'red',    1: 'blue'  }, maxClicks: 1 },
      { start: { 0: 'green', 1: 'red'   }, goal: { 0: 'yellow', 1: 'green' }, maxClicks: 1 },
      { start: { 0: 'green', 1: 'green' }, goal: { 0: 'red',    1: 'blue'  }, maxClicks: 3 },
    ]
  },
  isVictory: (game) => {
    return game.get('mode') === Game.Mode.Challenge
      && game.get('remainingChallenges').count() === 0
  }
})
