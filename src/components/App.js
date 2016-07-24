import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Lab                from './Lab'
import * as Game          from '../data/Game'

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
  toggleMode() {
    this.props.store.dispatch(Action.ToggleMode())
  }

  undo() {
    this.props.store.dispatch(Action.Undo())
  }

  getChildContext() {
    return { store: this.props.store }
  }

  renderUndo(game) {
    if (game.get('history').count() > 0) {
      return <button style={button}  onClick={this.undo.bind(this)}>Undo</button>
    } else {
      return <button style={{ ...button, color: '#ccc' }}>Undo</button>
    }
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
        <div style={guidanceText}>Make the left and right sides match</div>
        <div style={labsStyle('space-between')}>
          <Lab spacing={SquareSpacing} squareSize={SquareSize} canActuate={!isVictory} lab={game.get('lab')} />
          <Lab spacing={SquareSpacing} squareSize={SquareSize} canActuate={false} lab={game.get('challenge')} />
        </div>
      </div>
    )
  }

  render() {
    const game = this.props.game
    const mode = Game.gameMode(game)

    if (mode === Game.Mode.Experiment) {
      return this.renderExperiment(game)
    } else if (mode === Game.Mode.Challenge) {
      return this.renderChallenge(game)
    }
  }
}

App.childContextTypes = {
  store: React.PropTypes.object
}
