import Vue from 'mpvue'
import mpRouter from './../src'

Vue.use(mpRouter)

let $router
let $push
let matchMiddlewares = {}

async function pushMiddware(...args) {
  $push(...args)
}

const compose = middlewares => (...args) => {
  function dispatch(i) {
    return !middlewares[i]
      ? Promise.resolve('no arguments')
      : Promise.resolve(
          middlewares[i](...args, function() {
            return dispatch(++i)
          })
        )
  }

  return dispatch(0)
}

function getMatchMiddlewares(path) {
  return matchMiddlewares.hasOwnProperty(path) ? matchMiddlewares[path] : []
}

export default {
  install(Vue, { triggerAll, triggerMatch }) {
    $router = Vue.prototype.$router
    $push = $router.push
    matchMiddlewares = Object.assign({}, triggerMatch)

    // eslint-disable-next-line
    $router.push = async (...args) => {
      const path = typeof args[0] === 'string' ? args[0] : args[0].path

      await compose([triggerAll, ...getMatchMiddlewares(path), pushMiddware])(
        ...args
      )
    }
  }
}
