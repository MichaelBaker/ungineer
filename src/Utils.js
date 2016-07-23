import I from 'immutable'

export let curry = (f) => {
  if (f.length <= 1) {
    return f
  } else {
    return makeCurry(f.length, I.fromJS([]), f)
  }
}

export let compose = (fs) => {
  const imutFs  = I.fromJS(fs)
  const reducer = (result, f) => f(result)
  return (a) => imutFs.reduce(reducer, a)
}

export let id = (a) => a

const makeCurry = (numArgs, args, f) => {
  if (numArgs === 1) {
    return (a) => {
      return f.apply(undefined, args.push(a).toArray())
    }
  } else {
    return (a) => {
      return makeCurry(numArgs - 1, args.push(a), f)
    }
  }
}
