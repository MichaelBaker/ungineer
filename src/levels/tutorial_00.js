import _                  from 'lodash'
import * as U             from '../Utils'
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
    "Ungineering is about building mental models of implicit relationships.",
    "What is the relationship between the current color and the next color?",
    "You test how good your mental model is by making predictions.",
    "If I give you a color, can you predict what color will come after it?",
    "Click \"Start Test\" once you think you've got it.",
  ],
  test: [
    "Select the widget on the right that comes after the widget on the left.",
  ],
  failure: [
    "Nope.",
    "Your mental model is out of sync with reality.",
    "This is the power of prediction.",
    "A successful prediction gives you a bit of evidence that the world as you see it is the same as the world in reality.",
    "A failed prediction tells you that your view of reality is distorted and needs to be corrected.",
    "Click \"Experiment\" to go back and gain a better understanding of the widget.",
  ],
  experiment: [
    "Experimentation is how you gather the data that informs your model.",
    "Prediction is how you test the model for correctness.",
    "Try to visualize the different color transitions.",
    "Test yourself before starting the formal test. Predict the next color, click on the widget, and see if you're right.",
    "Once you're right every time, you're ready to take the test again.",
    "Click \"Start Test\" once you think you've got it.",
  ],
  followUps: [
    "Nice. Can you do it nine more times in a row?",
  ],
  finish: [
    "It seems like you've got it.",
    "There is only a 1 in 1,048,576 chance that you succeeded by guessing randomly.",
    "If you identified the general pattern, but not the specific ordering involved, then you still only had a 1 in 24 chance of guessing correctly.",
    "This is strong evidence that you really understand the basic rules that govern a single widget.",
    "Now for something a bit more difficult and a lot more fun.",
  ],
}

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
      step:     ({opacity}) => dispatch(Action.UpdateLevelData({ animation: { opacity } })),
      finish:   () => {
        const nextParagraph =  paragraph + 1
        if (nextParagraph < paragraphs.length) {
          dispatch(Action.UpdateLevelData({
            animation: { paragraph: nextParagraph, opacity: 0.0 }
          }))
        }
      },
    })
  },
}

export class LevelComponent extends Component {

  handleClick(square) {
    const newSquare = Square.cycleColor(square)
    this.context.dispatch(Action.UpdateLevelData({ square: newSquare }))
  }

  handleGuess(square) {
    const startSquare   = this.props.data.get('square')
    const nextSquare    = Square.cycleColor(startSquare)
    const expectedColor = Square.currentColor(nextSquare)
    const selection     = Square.currentColor(square)
    const phase         = this.getPhase()
    const completed     = this.props.data.getIn(['score', 'completed'])
    const total         = this.props.data.getIn(['score', 'total'])

    if (completed + 1 === total && completed !== undefined) {
      this.context.dispatch(Action.SetLevelData({
        phase:  'finish',
        square: nextSquare,
        animation: {
          opacity:    0.0,
          paragraph:  0,
          paragraphs: 'finish',
        },
      }))
    } else if (expectedColor === selection && phase === 'test') {
      this.context.dispatch(Action.UpdateLevelData({
        phase:  'followUps',
        square: nextSquare,
        score: {
          completed: completed + 1,
        },
        animation: {
          opacity:    0.0,
          paragraph:  0,
          paragraphs: 'followUps',
        },
      }))
    } else if (expectedColor === selection && phase === 'followUps') {
      this.context.dispatch(Action.UpdateLevelData({
        square: nextSquare,
        score:  { completed: completed + 1 },
      }))
    } else {
      this.context.dispatch(Action.SetLevelData({
        phase:  'failure',
        square: startSquare,
        animation: {
          opacity:    0.0,
          paragraph:  0,
          paragraphs: 'failure',
        },
      }))
    }
  }

  getPhase() {
    return this.props.data.get('phase')
  }

  startAnimation() {
    const animation = animations.paragraph(this, this.props.data, this.context.dispatch)
    this.setState({ animation: animation })
  }

  componentDidMount() {
    this.startAnimation()
  }

  componentWillUnmount() {
    if (this.state.animation) {
      this.state.animation.dispose()
    }
  }

  componentWillReceiveProps(nextProps) {
    const phase        = this.getPhase()
    const currentColor = Square.currentColor(this.props.data.get('square'))
    const nextColor    = Square.currentColor(nextProps.data.get('square'))

    if (phase == 0 && currentColor !== 'yellow' && nextColor === 'yellow') {
      this.context.dispatch(Action.UpdateLevelData({
        phase:     1,
        animation: {
          paragraphs: 'second',
          opacity:    0.0,
          paragraph:  0,
        },
      }))
    } else if (phase == 1 && currentColor !== 'blue' && nextColor === 'blue') {
      this.context.dispatch(Action.UpdateLevelData({
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
    const newPhase         = this.getPhase()
    const oldParagraph     = prevProps.data.getIn(['animation', 'paragraph'])
    const newParagraph     = this.props.data.getIn(['animation', 'paragraph'])

    if (oldPhase !== newPhase) {
      this.startAnimation()
    } else if (oldParagraph !== newParagraph) {
      this.startAnimation()
    }
  }

  startTest() {
    const seed   = U.randomSeed()
    const cycles = U.randomInt(0)(3)(seed).value

    let square = Square.createSquare({ id: 0, colors: ['blue', 'green', 'yellow', 'red'], reaction: () => {} })

    _.times(cycles, () => { square = Square.cycleColor(square) })

    this.context.dispatch(Action.SetLevelData({
      phase:  'test',
      square: square,
      score:  {
        completed: 0,
        total:     10,
      },
      animation: {
        paragraphs: 'test',
        opacity:    0,
        paragraph:  0,
      }
    }))
  }

  experiment() {
    this.context.dispatch(Action.SetLevelData({
      phase:  'experiment',
      square: startSquare,
      animation: {
        opacity:    0.0,
        paragraph:  0,
        paragraphs: 'experiment',
      },
    }))
  }

  finish() {
    this.context.dispatch(Action.StartLevel("Tutorial01"))
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
      textAlign:    'justify',
    }

    return <p key={i} style={style}>{p}</p>
  }

  renderParagraphs() {
    const paragraphs = paragraphSets[this.props.data.getIn(['animation', 'paragraphs'])]
    if (!paragraphs) return
    return paragraphs.map(this.renderParagraph.bind(this))
  }

  renderButtons() {
    const phase      = this.getPhase()
    const paragraphs = paragraphSets[this.props.data.getIn(['animation', 'paragraphs'])]
    const paragraph  = this.props.data.getIn(['animation', 'paragraph'])

    const style ={
      margin:       'auto',
      display:      'block',
      marginTop:    40,
      border:       'none',
      background:   'none',
      borderBottom: '1px solid black',
      cursor:       'pointer',
      outline:      0,
      opacity:       this.props.data.getIn(['animation', 'opacity']),
    }

    if (phase === 2 && paragraph == paragraphs.length - 1) {
      return <button style={style} onClick={this.startTest.bind(this)}>Start Test</button>
    } else if (phase === "failure" && paragraph == paragraphs.length - 1) {
      return <button style={style} onClick={this.experiment.bind(this)}>Experiment</button>
    } else if (phase === "finish" && paragraph == paragraphs.length - 1) {
      return <button style={style} onClick={this.finish.bind(this)}>Finish Section</button>
    } else if (phase === "experiment") {
      return <button style={{ ...style, opacity: 1.0 }} onClick={this.startTest.bind(this)}>Start Test</button>
    }
  }

  renderTestWidgets() {
    const square  = this.props.data.get('square')
    const spacing = 20
    const size    = 80

    const divStyle = {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
    }

    const guessStyle = {
      flex:          '0 0 auto',
      display:       'flex',
      flexDirection: 'column',
    }

    const squareStyle = {
      flex:         '0 0 auto',
      marginBottom: spacing,
    }

    const options = [
      Square.createSquare({ id: 1, colors: ['red'],    reaction: () => {} }),
      Square.createSquare({ id: 3, colors: ['green'],  reaction: () => {} }),
      Square.createSquare({ id: 0, colors: ['yellow'], reaction: () => {} }),
      Square.createSquare({ id: 2, colors: ['blue'],   reaction: () => {} }),
    ]

    const components = options.map((square) => {
      return <SquareComp size={size} key={square.get('id')} style_={squareStyle} square={square} canActuate={true} onClick={this.handleGuess.bind(this)} />
    })

    return (
      <div style={divStyle}>
        <SquareComp style_={squareStyle} size={size} square={square} canActuate={false} />
        <div style={guessStyle}>
          {components}
        </div>
      </div>
    )
  }

  renderWidgets() {
    const square = this.props.data.get('square')
    const phase  = this.getPhase()

    if (phase < 3 || phase === 'experiment') {
      return <SquareComp style_={{ margin: '20 auto 60' }} square={square} canActuate={true} onClick={this.handleClick.bind(this)}/>
    } else if (phase === 'test' || phase === 'followUps') {
      return this.renderTestWidgets()
    }
  }

  renderScore() {
    const completed = this.props.data.getIn(['score', 'completed'])
    const total     = this.props.data.getIn(['score', 'total'])
    if (total) {
      return <div>{completed}/{total}</div>
    }
  }

  render() {
    const square = this.props.data.get('square')

    return (
      <div>
        {this.renderWidgets()}
        {this.renderScore()}
        {this.renderParagraphs()}
        {this.renderButtons()}
      </div>
    )
  }
}

LevelComponent.contextTypes = {
  dispatch: React.PropTypes.func
}

const startSquare = Square.createSquare({ id: 0, colors: ['red', 'blue', 'green', 'yellow'], reaction: () => {} })

export let startState = I.fromJS({
  levelName: 'Tutorial00',
  square:    startSquare,
  state: {
    phase:     0,
    square:    Square.createSquare({ id: 0, colors: ['red', 'blue', 'green', 'yellow'], reaction: () => {} }),
    animation: {
      paragraphs: 'start',
      paragraph:  0,
      opacity:    0.0,
    },
  }
})
