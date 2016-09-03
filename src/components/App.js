import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import * as Const         from '../Constants'

export default class App extends Component {
  getChildContext() {
    return { store: this.props.store }
  }

  render() {
    const state      = this.props.state
    const Level      = state.getIn(['level', 'component'])
    const levelState = state.getIn(['level', 'state'])

    return (
      <div style={appStyle}>
        <div style={titleStyle}>Ungineer</div>
        <Level data={levelState} />
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
