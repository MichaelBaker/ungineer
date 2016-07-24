import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Level              from './Level'
import * as Game          from '../data/Game'
import * as LevelD        from '../data/Level'
import * as Prog          from '../data/Progression'

const SquareSize    = 100
const SquareSpacing = 20

const appStyle = {
  display:       'flex',
  flexDirection: 'column',
  margin:        'auto',
  alignItems:    'center',
  width:         (SquareSize * 2) + SquareSpacing,
}

const titleStyle = {
  textAlign:    'center',
  marginTop:    40,
  marginBottom: 40,
  fontSize:     64,
}

const statusStyle = {
  textAlign:      'center',
  marginTop:      40,
  marginBottom:   20,
  fontSize:       18,
  display:        'flex',
  flexDirection:  'row',
  justifyContent: 'center',
}

const labsStyle = (justify) => {
  return {
    display:        'flex',
    flexDirection:  'row',
    marginTop:      40,
    marginBottom:   40,
    justifyContent: justify,
    width:          '100%',
  }
}

const button = {
  cursor:     'default',
  background: 'none',
  border:     'none',
  outline:    'none',
}

const guidanceText = {
  marginTop:      40,
  marginBottom:   20,
  fontSize:       16,
}

export default class App extends Component {
  getChildContext() {
    return { store: this.props.store }
  }

  progress() {
    this.props.store.dispatch(Action.Progress())
  }

  regress() {
    this.props.store.dispatch(Action.Regress())
  }

  renderExperiment(game) {
    return (
      <div style={appStyle}>
        <div>
          <div style={titleStyle}>Ungineer</div>
          <div style={{ ...statusStyle, justifyContent: 'space-between' }}>
            <button style={button}  onClick={this.toggleMode.bind(this)}>Start Challenge</button>
            {this.renderUndo(game)}
          </div>
        </div>
        <div style={labsStyle('center')}>
          <Lab spacing={SquareSpacing} squareSize={SquareSize} canActuate={true} lab={game.get('lab')} />
        </div>
      </div>
    )
  }

  renderChallenge(game) {
    const isVictory = game.get('victory')
    return (
      <div style={appStyle}>
        <div>
          <div style={titleStyle}>Ungineer</div>
          <div style={statusStyle}>
            <button style={button} onClick={this.toggleMode.bind(this)}>Go Experiment</button>
          </div>
        </div>
        <div style={guidanceText}>{isVictory ? "Nice" : "Make the left and right sides match"}</div>
        <div style={labsStyle('space-between')}>
          <Lab spacing={SquareSpacing} squareSize={SquareSize} canActuate={!isVictory} lab={game.get('lab')} />
          <Lab spacing={SquareSpacing} squareSize={SquareSize} canActuate={false} lab={game.get('challenge')} />
        </div>
      </div>
    )
  }

  renderNavigation(isVictory, prevLevel, nextLevel) {
    const back = (() => {
      if (prevLevel) {
        return <div onClick={this.regress.bind(this)}>Go back to: {prevLevel.get('title')}</div>
      } else {
        return <div></div>
      }
    })()

    const forward = (() => {
      if (isVictory && nextLevel) {
        return <div onClick={this.progress.bind(this)}>Continue to: {nextLevel.get('title')}</div>
      } else {
        return <div></div>
      }
    })()

    return (
      <div>
        {back}
        {forward}
      </div>
    )
  }

  render() {
    const state = this.props.state
    const level = state.get('level')
    const { level: nextLevel } = Prog.nextLevel(state)
    const { level: prevLevel } = Prog.previousLevel(state)

    return (
      <div>
        <div style={titleStyle}>Ungineer</div>
        {this.renderNavigation(LevelD.isVictory(level), prevLevel, nextLevel)}
        <Level level={level} />
      </div>
    )
  }
}

App.childContextTypes = {
  store: React.PropTypes.object
}
