import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Lab                from './Lab'
import * as LevelD        from '../data/Level'
import * as Game          from '../data/Game'
import * as Const         from '../Constants'

export default class Level extends Component {
  toggleMode() {
    this.context.store.dispatch(Action.ToggleMode())
  }

  undo() {
    this.context.store.dispatch(Action.Undo())
  }

  renderText(isVictory, startText, endText) {
    if (isVictory) {
      return <div style={textStyle}>{endText}</div>
    } else {
      return <div style={textStyle}>{startText}</div>
    }
  }

  renderControls(isVictory, canToggle, game, level) {
    if (isVictory) return <div />

    let buttons = []

    const mode    = game.get('mode')
    const canUndo = level.get('canUndo')
    if (mode === Game.Mode.Experiment && canUndo) {
      const style = {
        ...buttonStyle,
        color: game.get('history').count() > 0 ? 'black' : 'ccc'
      }
      buttons.push(<button key="undo" style={style} onClick={this.undo.bind(this)}>Undo</button>)
    }

    if (!canToggle) {
    } else if (Game.gameMode(game) === Game.Mode.Experiment) {
      buttons.push(<button key="toggle" style={buttonStyle} onClick={this.toggleMode.bind(this)}>Start Test</button>)
    } else if (Game.gameMode(game) === Game.Mode.Challenge) {
      buttons.push(<button key="toggle" style={buttonStyle} onClick={this.toggleMode.bind(this)}>Go Experiment</button>)
    }

    const justify = buttons.length > 1 ? 'space-between' : 'center'

    return (
      <div style={controlStyle(justify)}>
        {buttons}
      </div>
    )
  }

  renderWidgets(isVictory, game) {
    const lab       = game.get('lab')
    const challenge = game.get('challenge')
    const mode      = Game.gameMode(game)

    if (mode === Game.Mode.Challenge && challenge) {
      return (
        <div style={widgetsStyle('space-between')}>
          <Lab squareSize = {Const.SquareSize} spacing = {Const.SquareSpacing} canActuate = {!isVictory} lab = {lab} />
          <Lab squareSize = {Const.SquareSize} spacing = {Const.SquareSpacing} canActuate = {false} lab = {challenge} />
        </div>
      )
    } else if (mode === Game.Mode.Experiment) {
      return (
        <div style={widgetsStyle('center')}>
          <Lab squareSize = {Const.SquareSize} spacing = {Const.SquareSpacing} canActuate = {!isVictory} lab = {lab} />
        </div>
      )
    }
  }

  renderStatus(game) {
    const mode = Game.gameMode(game)

    if (mode === Game.Mode.Challenge) {
      return (
        <div style={statusStyle}>
          <div style={status}>Tests<br/>{game.get('remainingChallenges').count()}</div>
          <div style={status}>Clicks<br/>{game.get('clicksRemaining')}</div>
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
      <div style={levelStyle}>
        {this.renderText(isVictory, level.get('startText'), level.get('endText'))}
        {this.renderControls(isVictory, canToggle, game, level)}
        {this.renderStatus(game)}
        {this.renderWidgets(isVictory, game)}
      </div>
    )
  }
}

Level.contextTypes = {
  store: React.PropTypes.object
}

const levelStyle = {
  display:       'flex',
  flexDirection: 'column',
}

const widgetsStyle = (justify) => {
  return {
    display:        'flex',
    flexDirection:  'row',
    justifyContent: justify,
  }
}

const textStyle = {
  marginBottom: 40,
  textAlign: 'justify',
}

const controlStyle = (justify) => {
  return {
    display:       'flex',
    flexDirection: 'row',
    justifyContent: justify,
    marginBottom:   40,
  }
}

const buttonStyle = {
  background: 'none',
  border:     'none',
  outline:    'none',
  cursor:     'default',
  flex:       '1 1',
}

const statusStyle = {
  marginBottom:  40,
  display:       'flex',
  flexDirection: 'row',
  textAlign:     'center',
  justify:       'space-between',
}

const status = {
  flex: '1 1',
}
