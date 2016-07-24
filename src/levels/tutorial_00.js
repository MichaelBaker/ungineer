import * as Level      from '../data/Level'
import * as World      from '../data/World'
import * as Square     from '../data/Square'
import * as Game       from '../data/Game'

const world = World.createWorld({
  squares: {
    0: Square.createSquare({ id: '0', colors: ['red', 'blue', 'green', 'yellow'], reaction: (squares) => {} }),
  }
})

const game = Game.experiment({ world })

export default Level.createLevel({
  game,
  title:     "Widgets",
  startText: "Welcome to Ungineer, the game of reverse engineering. This is a widget. Your first task is to figure out how to make the widget yellow.",
  endText:   "Now that you've done that, what have you learned about the way widgets work? What rule governs how the widget changes color?",
  isVictory: (game) => game.getIn(['lab', 'squares', '0', 'colors', 0]) === 'yellow'
})
