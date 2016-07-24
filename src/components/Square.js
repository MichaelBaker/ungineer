import React, {Component} from 'react'
import { Action }         from '../Store'

export default class Square extends Component {
  select() {
    if (this.props.canActuate) {
      const action = Action.SelectSquare({ squareId: this.props.square.get('id') })
      this.context.store.dispatch(action)
    }
  }

  render() {
    const square = this.props.square
    const style = {
      marginBottom: this.props.spacing,
      width:        this.props.size,
      height:       this.props.size,
      background:   square.get('colors').get(0),
    }

    return <div style={style} onClick={this.select.bind(this)}/>
  }
}

Square.contextTypes = {
  store: React.PropTypes.object
}
