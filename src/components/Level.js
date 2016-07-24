import React, {Component} from 'react'
import Redux              from 'redux'
import { Action }         from '../Store'
import Lab                from './Lab'
import * as LevelD        from '../data/Level'

const SquareSize    = 100
const SquareSpacing = 20

export default class Level extends Component {
  renderText(isVictory, startText, endText) {
    if (isVictory) {
      return <div>{endText}</div>
    } else {
      return <div>{startText}</div>
    }
  }

  render() {
    const level     = this.props.level
    const lab       = level.getIn(['game', 'lab'])
    const isVictory = LevelD.isVictory(level)

    return (
      <div>
        {this.renderText(isVictory, level.get('startText'), level.get('endText'))}
        <Lab
          squareSize = {SquareSize}
          spacing    = {SquareSpacing}
          canActuate = {!isVictory}
          lab        = {lab}
        />
      </div>
    )
  }
}

Level.childContextTypes = {
  store: React.PropTypes.object
}
