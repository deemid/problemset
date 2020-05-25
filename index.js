/*
  nvm use 8.16.0
  node index.js
*/
const { RandStream, asyncOp } = require('./lib/lib')

/*
  Problem #1 
  Create a function doAsync which accepts an array arr as input. Each element in the array can be either of type String or [String].
*/

const input = ['A', ['B', 'C'], 'D']

function* init(arr) {
  for (let item of arr) {
    yield item
  }
}

// Wrap the asyncOp in a Promise (by passing the resolve as the callback parameter)
const promisifyAsyncOp = (item) => {
  return new Promise((resolve) => {
    asyncOp(item, () => {
      resolve()
    })
  })
}

const doAsync = (arr) => {
  const iterable = init(arr)

  // recursion: run until iterable is done
  const runAsync = async () => {
    let { value, done } = iterable.next()
    if (done) {
      return
    }

    if (Array.isArray(value)) {
      // Use Promise.all to apply asyncOp to the items simultaneously
      let promises = value.map(async (v) => await promisifyAsyncOp(v))
      await Promise.all(promises)
    } else {
      await promisifyAsyncOp(value)
    }

    runAsync()
  }

  runAsync()
}

// ** note i did not do any more validation of the input (String or [String]).
doAsync(input)

