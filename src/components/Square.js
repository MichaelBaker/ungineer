import React, {Component} from 'react'

export default class Square extends Component {
  select() {
    if (this.props.canActuate) {
      this.props.onClick(this.props.square)
    }
  }

  render() {
    const square = this.props.square
    const style = {
      ...this.props.style_,
      width:        this.props.size || 100,
      height:       this.props.size || 100,
      background:   square.get('colors').get(0),
      cursor:       'pointer',
      border:       'none',
      display:      'block',
      outline:      0,
    }

    return <button key={square.get('id')} style={style} onClick={this.select.bind(this)}/>
  }
}
