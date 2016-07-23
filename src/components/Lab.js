import React, {Component} from 'react'
import { Action }         from '../Store'
import Square             from './Square'

export default class Lab extends Component {
  render() {
    const squares = this.props.lab.get('squares').toArray()
    return (
      <div>
        {squares.map((square) => {
          return <Square key={square.get('id')} square={square} />
        })}
      </div>
    )
  }
}
