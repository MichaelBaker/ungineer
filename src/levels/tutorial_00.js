import I                  from 'immutable'
import React, {Component} from 'react'
import { Action }         from '../Store'
import SquareComp         from '../components/Square'
import * as Utils         from '../Utils'
import * as Square        from '../data/Square'

const paragraphSets = {
  start: [
    "Welcome to Ungineer, the game of reverse engineering.",
    "This is a widget.",
    "Your first task is to figure out how to make the widget yellow.",
  ],
  second: [
    "Now make the widget blue.",
    "How do you make the widget change color?",
  ],
  third: [
    "Do you know what the pattern is?",
    "Ungineering is about building mental models of unseen relationships.",
    "You test your mental model by making predictions.",
    "If I give you a color, can you predict what color will come after it?",
    "Click \"Start Test\" once you think you've got it.",
  ],
}

// TODO
// * Add dispatch to the context
// * Replace UpdateState with SetState
// * What is the pattern?
// * Click "test" when you're ready.

const animations = {
  paragraph: (self, state, dispatch) => {
    const startOpacity = state.getIn(['animation', 'opacity'])
    const paragraphs   = paragraphSets[state.getIn(['animation', 'paragraphs'])]
    const paragraph    = state.getIn(['animation', 'paragraph'])

    return Utils.animate({
      from:     { opacity: startOpacity },
      to:       { opacity: 1.0 },
      duration: 1000,
      easing:   'easeInQuad',
      step:     ({opacity}) => dispatch(Action.UpdateLevel({ animation: { opacity } })),
      finish:   () => {
        const nextParagraph =  paragraph + 1
        if (nextParagraph < paragraphs.length) {
          dispatch(Action.UpdateLevel({
            animation: {
              paragraph:  nextParagraph,
              opacity:    0.0,
              name:       'paragraph',
            }
          }))
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

  componentWillReceiveProps(nextProps) {
    const phase        = this.props.data.get('phase')
    const currentColor = Square.currentColor(this.props.data.get('square'))
    const nextColor    = Square.currentColor(nextProps.data.get('square'))

    if (phase == 0 && currentColor !== 'yellow' && nextColor === 'yellow') {
      this.context.store.dispatch(Action.UpdateLevel({
        phase:     1,
        animation: {
          paragraphs: 'second',
          opacity:    0.0,
          paragraph:  0,
        },
      }))
    } else if (phase == 1 && currentColor !== 'blue' && nextColor === 'blue') {
      this.context.store.dispatch(Action.UpdateLevel({
        phase:     2,
        animation: {
          paragraphs: 'third',
          opacity:    0.0,
          paragraph:  0,
        },
      }))
    }
  }

  componentDidUpdate(prevProps) {
    const oldPhase         = prevProps.data.get('phase')
    const newPhase         = this.props.data.get('phase')
    const oldParagraph     = prevProps.data.getIn(['animation', 'paragraph'])
    const newParagraph     = this.props.data.getIn(['animation', 'paragraph'])
    const oldAnimationName = prevProps.data.getIn(['animation', 'name'])
    const newAnimationName = this.props.data.getIn(['animation', 'name'])

    if (oldPhase !== newPhase) {
      this.startAnimation(newAnimationName)
    } else if (oldAnimationName !== newAnimationName) {
      this.startAnimation(newAnimationName)
    } else if (newAnimationName && oldParagraph !== newParagraph) {
      this.startAnimation(newAnimationName)
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
      width:        '100%',
      marginBottom: 20,
    }

    return <div key={i} style={style}>{p}</div>
  }

  renderParagraphs() {
    const paragraphs = paragraphSets[this.props.data.getIn(['animation', 'paragraphs'])]
    if (!paragraphs) return
    return paragraphs.map(this.renderParagraph.bind(this))
  }

  renderTest() {
    const phase      = this.props.data.get('phase')
    const paragraphs = paragraphSets[this.props.data.getIn(['animation', 'paragraphs'])]
    const paragraph  = this.props.data.getIn(['animation', 'paragraph'])

    if (phase === 2 && paragraph == paragraphs.length - 1) {
      const style ={
        margin:       'auto',
        display:      'block',
        marginTop:    40,
        border:       'none',
        background:   'none',
        borderBottom: '1px solid black',
        cursor:       'pointer',
        opacity:      this.props.data.getIn(['animation', 'opacity']),
        outline:      0,
      }
      return <button style={style}>Start Test</button>
    }
  }

  render() {
    const square = this.props.data.get('square')

    return (
      <div>
        <SquareComp style_={{ margin: '20 auto 60' }} square={square} canActuate={true} onClick={this.handleClick.bind(this)}/>
        {this.renderParagraphs()}
        {this.renderTest()}
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
      paragraphs: 'start',
      name:       'paragraph',
      paragraph:  0,
      opacity:    0.0,
    },
  }
})
