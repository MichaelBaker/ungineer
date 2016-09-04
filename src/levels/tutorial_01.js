import I                  from 'immutable'
import React, {Component} from 'react'

export class LevelComponent extends Component {
  render() {
    return (
      <div>Tutorial 01</div>
    )
  }
}

export let startState = I.fromJS({
  levelName: 'Tutorial01',
  state:     {}
})
