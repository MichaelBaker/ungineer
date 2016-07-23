import I      from 'immutable'
import Hashes from 'jshashes'

const sha = new Hashes.SHA256
const hashToInt = (num) => parseInt("0x" + sha.hex(num.toString()), 16)

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

export let randomSeed = () => {
  return hashToInt(Math.random())
}

export let randomInt = curry((lower, upper, seed) => {
  if (upper < lower) {
    throw new Error("The upper value of the range must be greater than or equal to the lower value: " + JSON.stringify({lower, upper}))
  }

  const hashValue = hashToInt(seed)
  const range     = upper + 1 - lower
  const value     = lower + (hashValue % range)
  return { value, newSeed: seed + 1 }
})

export let randomElement = curry((collection, seed) => {
  const { value, newSeed } = randomInt(0)(collection.count() - 1)(seed)
  return { value: collection.get(value), newSeed }
})
