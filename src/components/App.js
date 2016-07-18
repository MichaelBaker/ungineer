import React, {Component} from 'react'
import Redux              from 'redux'
import { Mode }           from '../data/Game'
import { Action }         from '../Store'

export default class App extends Component {
  toggleMode() {
    this.props.store.dispatch(Action.ToggleMode())
  }

  renderExperiment(game) {
    return (
      <div>
        Experiment
        <div onClick={this.toggleMode.bind(this)}>
          Start Challenge
        </div>
      </div>
    )
  }

  renderChallenge(game) {
    return (
      <div>
        Challenge
        <div onClick={this.toggleMode.bind(this)}>
          Experiment
        </div>
      </div>
    )
  }

  render() {
    const game = this.props.game
    const mode = game.get('mode')

    if (mode === Mode.Experiment) {
      return this.renderExperiment(game)
    } else if (mode === Mode.Challenge) {
      return this.renderChallenge(game)
    }
  }
}
