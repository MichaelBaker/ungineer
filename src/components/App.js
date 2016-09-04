import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import * as Const         from '../Constants'
import Levels             from '../Levels'

export default class App extends Component {
  getChildContext() {
    return { dispatch: this.props.store.dispatch }
  }

  render() {
    const state      = this.props.state
    const Comp       = Levels[state.getIn(['level', 'levelName'])].component
    const levelState = state.getIn(['level', 'state'])

    return (
      <div style={appStyle}>
        <div style={titleStyle}>Ungineer</div>
        <Comp data={levelState} />
      </div>
    )
  }
}

App.childContextTypes = {
  dispatch: React.PropTypes.func
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
