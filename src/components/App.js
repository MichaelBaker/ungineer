import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Lab                from './Lab'
import * as Game          from '../data/Game'

const appStyle = {
  display:       'flex',
  flexDirection: 'column',
  margin:        'auto',
  alignItems:    'center',
}

export default class App extends Component {
  toggleMode() {
    this.props.store.dispatch(Action.ToggleMode())
  }

  getChildContext() {
    return { store: this.props.store }
  }

  renderHeader(mode, toggle) {
    return (
      <div>
        <div>Mode: {mode}</div>
        <div onClick={this.toggleMode.bind(this)}>{toggle}</div>
      </div>
    )
  }

  renderExperiment(game) {
    return (
      <div style={appStyle}>
        {this.renderHeader('Experiment', 'Start Challenge')}
        <Lab canActuate={true} lab={game.get('lab')} />
      </div>
    )
  }

  renderChallenge(game) {
    const isVictory = game.get('victory')
    const modeText  = isVictory ? 'Victory' : 'Challenge'
    return (
      <div style={appStyle}>
        {this.renderHeader(modeText, 'Experiment')}
        <div>Make the left side match the right side</div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Lab canActuate={!isVictory} lab={game.get('lab')} />
          <Lab canActuate={false} lab={game.get('challenge')} />
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
