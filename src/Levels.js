import * as Tutorial00 from './levels/tutorial_00'
import * as Tutorial01 from './levels/tutorial_01'

export default {
  Tutorial00: {
    startState: Tutorial00.startState,
    component:  Tutorial00.LevelComponent,
  },
  Tutorial01: {
    startState: Tutorial01.startState,
    component:  Tutorial01.LevelComponent,
  },
}
