import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Lab                from './Lab'
import * as LevelD        from '../data/Level'
import * as Game          from '../data/Game'

const SquareSize    = 100
const SquareSpacing = 20

export default class Level extends Component {
  toggleMode() {
    this.context.store.dispatch(Action.ToggleMode())
  }

  undo() {
    this.context.store.dispatch(Action.Undo())
  }

  renderText(isVictory, startText, endText) {
    if (isVictory) {
      return <div>{endText}</div>
    } else {
      return <div>{startText}</div>
    }
  }

  renderControls(isVictory, canToggle, game, level) {
    if (isVictory) return <div />

    const toggle = (() => {
      const mode = game.get('mode')
      if (!canToggle) {
        return <div />
      } else if (Game.gameMode(game) === Game.Mode.Experiment) {
        return <button onClick={this.toggleMode.bind(this)}>Start Test</button>
      } else if (Game.gameMode(game) === Game.Mode.Challenge) {
        return <button onClick={this.toggleMode.bind(this)}>Go Experiment</button>
      }
    })()

    const undo = (() => {
      const mode    = game.get('mode')
      const canUndo = level.get('canUndo')
      if (mode === Game.Mode.Experiment && canUndo) {
        return <button onClick={this.undo.bind(this)}>Undo</button>
      } else {
        return <div />
      }
    })()

    return (
      <div>
        {toggle}
        {undo}
      </div>
    )
  }

  renderWidgets(isVictory, game) {
    const lab       = game.get('lab')
    const challenge = game.get('challenge')
    const mode      = Game.gameMode(game)

    if (mode === Game.Mode.Challenge && challenge) {
      return (
        <div>
          <div>Clicks Remaining: {game.get('clicksRemaining')}</div>
          <div>Tests Remaining:  {game.get('remainingChallenges').count()}</div>
          <Lab squareSize = {SquareSize} spacing = {SquareSpacing} canActuate = {!isVictory} lab = {lab} />
          <Lab squareSize = {SquareSize} spacing = {SquareSpacing} canActuate = {false} lab = {challenge} />
        </div>
      )
    } else if (mode === Game.Mode.Experiment) {
      return (
        <div>
          <Lab squareSize = {SquareSize} spacing = {SquareSpacing} canActuate = {!isVictory} lab = {lab} />
        </div>
      )
    }
  }

  render() {
    const level     = this.props.level
    const game      = level.get('game')
    const lab       = game.get('lab')
    const isVictory = LevelD.isVictory(level)
    const canToggle = level.get('canToggle')

    return (
      <div>
        {this.renderText(isVictory, level.get('startText'), level.get('endText'))}
        {this.renderControls(isVictory, canToggle, game, level)}
        {this.renderWidgets(isVictory, game)}
      </div>
    )
  }
}

Level.contextTypes = {
  store: React.PropTypes.object
}
