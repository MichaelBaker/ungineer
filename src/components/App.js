import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Lab                from './Lab'
import * as Game          from '../data/Game'

export default class App extends Component {
  toggleMode() {
    this.props.store.dispatch(Action.ToggleMode())
  }

  getChildContext() {
    return { store: this.props.store }
  }

  renderExperiment(game) {
    return (
      <div>
        Experiment
        <div onClick={this.toggleMode.bind(this)}>
          Start Challenge
        </div>
        <Lab canActuate={true} lab={game.get('lab')} />
      </div>
    )
  }

  renderChallenge(game) {
    const isVictory = game.get('victory')
    return (
      <div>
        {isVictory ? <div>Victory</div> : <div>Challenge</div>}
        <div onClick={this.toggleMode.bind(this)}>Experiment</div>
        <Lab canActuate={!isVictory} lab={game.get('lab')} />
        <Lab canActuate={false} lab={game.get('challenge')} />
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
