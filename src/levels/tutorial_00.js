import I                  from 'immutable'
import React, {Component} from 'react'
import { Action }         from '../Store'
import SquareComp         from '../components/Square'
import * as Utils         from '../Utils'
import * as Square        from '../data/Square'

const startParagraphs = [
  "Welcome to Ungineer, the game of reverse engineering.",
  "This is a widget.",
  "Your first task is to figure out how to make the widget yellow.",
]

// TODO
// * Then make it blue.
// * What is the pattern?
// * Click "test" when you're ready.

const animations = {
  paragraph: (self, state, dispatch) => {
    const startOpacity = state.getIn(['animation', 'opacity'])
    const paragraph    = state.getIn(['animation', 'paragraph'])

    return Utils.animate({
      from:     { opacity: startOpacity },
      to:       { opacity: 1.0 },
      duration: 1000,
      easing:   'easeInQuad',
      step:     ({opacity}) => dispatch(Action.UpdateLevel({ animation: { opacity } })),
      finish:   () => {
        const nextParagraph =  paragraph + 1
        if (nextParagraph < startParagraphs.length) {
          dispatch(Action.UpdateLevel({
            animation: {
              paragraph:  nextParagraph,
              opacity:    0.0,
              name:       'paragraph',
            }
          }))
          self.startAnimation('paragraph')
        }
      },
    })
  },
}

class LevelComponent extends Component {

  handleClick(square) {
    const newSquare = Square.cycleColor(square)
    this.context.store.dispatch(Action.UpdateLevel({ square: newSquare }))
  }

  startAnimation(animationName) {
    if (animationName) {
      const animation = animations[animationName](this, this.props.data, this.context.store.dispatch)
      this.setState({ animation: animation })
    }
  }

  componentDidMount() {
    this.startAnimation(this.props.data.getIn(['animation', 'name']))
  }

  componentWillUnmount() {
    if (this.state.animation) {
      this.state.animation.dispose()
    }
  }

  renderParagraph(p, i) {
    const opacity = (() => {
      const paragraph = this.props.data.getIn(['animation', 'paragraph'])
      if (paragraph === undefined) {
        return 0.0
      } else if (i < paragraph) {
        return 1.0
      } else if (i == paragraph) {
        return this.props.data.getIn(['animation', 'opacity'])
      } else {
        return 0.0
      }
    })()

    const style = {
      opacity:      opacity,
      marginBottom: 20,
    }

    return <div key={i} style={style}>{p}</div>
  }

  renderParagraphs() {
    if (this.props.data.get('section') === 0) {
      return startParagraphs.map(this.renderParagraph.bind(this))
    }
  }

  render() {
    const square = this.props.data.get('square')

    return (
      <div>
        {startParagraphs.map(this.renderParagraph.bind(this))}
        <SquareComp style_={{ margin: 'auto' }} square={square} canActuate={true} onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }
}

LevelComponent.contextTypes = {
  store: React.PropTypes.object
}

export default I.fromJS({
  component: LevelComponent,
  state: {
    phase:     0,
    square:    Square.createSquare({ id: 0, colors: ['red', 'blue', 'green', 'yellow'], reaction: () => {} }),
    animation: {
      name:      'paragraph',
      paragraph: 0,
      opacity:   0.0,
    },
  }
})
