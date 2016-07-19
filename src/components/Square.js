import React, {Component} from 'react'
import { Action }         from '../Store'

export default class Square extends Component {
  select() {
    const action = Action.SelectSquare({ id: this.props.square.get('id') })
    this.context.store.dispatch(action)
  }

  render() {
    const square = this.props.square
    const style = {
      margin:     20,
      width:      100,
      height:     100,
      background: square.get('colors').get(0),
    }

    return <div style={style} onClick={this.select.bind(this)}/>
  }
}

Square.contextTypes = {
  store: React.PropTypes.object
}
