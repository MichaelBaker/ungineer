import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Level              from './Level'
import * as Game          from '../data/Game'
import * as LevelD        from '../data/Level'
import * as Prog          from '../data/Progression'
import * as Const         from '../Constants'

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

  tildes(text) {
    let tildes = ""
    for (var i = 0; i < text.length-4; i++) {
      tildes = tildes + "~"
    }
    return tildes
  }

  renderNavigation(isVictory, prevLevel, nextLevel) {
    const back = (() => {
      if (prevLevel) {
        return <button style={{...Const.ButtonStyle, textAlign: 'left'}} onClick={this.regress.bind(this)}>{prevLevel.get('title')}<br/>{"<" + this.tildes(prevLevel.get('title'))}</button>
      } else {
        return <div></div>
      }
    })()

    const forward = (() => {
      if (isVictory && nextLevel) {
        return <button style={{...Const.ButtonStyle, textAlign: 'right'}} onClick={this.progress.bind(this)}>{nextLevel.get('title')}{this.tildes(nextLevel.get('title')) + ">"}</button>
      } else if (nextLevel && localStorage.getItem(nextLevel.get('key'))) {
        return <button style={{...Const.ButtonStyle, textAlign: 'right'}} onClick={this.progress.bind(this)}>{nextLevel.get('title')}<br/>{this.tildes(nextLevel.get('title')) + ">"}</button>
      } else {
        return <div></div>
      }
    })()

    return (
      <div style={navigationStyle}>
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
      <div style={appStyle}>
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

const appStyle = {
  display:       'flex',
  flexDirection: 'column',
  padding:       40,
  margin:        'auto',
  width:         (Const.SquareSize * 2) + Const.SquareSpacing,
}

const titleStyle = {
  textAlign:    'center',
  fontSize:     48,
  fontFamily:   'JunctionRegular',
  marginBottom: 40,
}

const navigationStyle = {
  display:        'flex',
  flexDirection:  'row',
  justifyContent: 'space-between',
  marginBottom:    40,
}
