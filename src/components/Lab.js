import React, {Component} from 'react'
import { Action }         from '../Store'
import Square             from './Square'

export default class Lab extends Component {
  render() {
    const squares    = this.props.lab.get('squares').toArray()
    const canActuate = this.props.canActuate

    return (
      <div>
        {squares.map((square) => {
          return <Square
            canActuate = {canActuate}
            key        = {square.get('id')}
            square     = {square} />
        })}
      </div>
    )
  }
}
