import { stringifyQuery } from './src/query'
import { getPagesList } from '@lib/util/util'

// bug
const throttle = (fn, time = 500) => {
  let lock
  return function(...args) {
    if (!lock) {
      fn.apply(this, args)
      lock = setTimeout(() => {
        lock = null
      }, time)
    }
  }
}

// 页面堆栈长度 小程序默认最大支持10层
let pageStackLen = 1

const maxStackLen = 10

const routeDatas = {}

function parseUrl(location, isPush) {
  if (typeof location === 'string') return `/modules${location}`

  const { path, query, data } = location
  const queryStr = stringifyQuery(query)

  const reallyPath = `/modules${path}`

  try {
    if (data) {
      routeDatas[reallyPath] = JSON.parse(JSON.stringify(data))
    }
  } catch (error) {}

  return `${reallyPath}${queryStr}`
}

function parseRoute($mp) {
  const _mp = $mp || {}
  const path = _mp.page && _mp.page.route
  const parseQuery = {}
  const tempQuery = _mp.query

  for (let k in tempQuery) {
    let cur = tempQuery[k]

    try {
      // 解决长整型丢失精度
      const transfer = JSON.parse(tempQuery[k])

      if (!(typeof transfer === 'number')) {
        cur = transfer
      }
    } catch (e) {}

    parseQuery[k] = cur
  }
  const url = {
    path: `/${path}`,
    query: parseQuery
  }

  return {
    ...url,
    params: routeDatas[url.path] || {},
    hash: '',
    fullPath: parseUrl(url),
    name: path && path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase())
  }
}

const _throttle = throttle(_push, 1000)

export function push(...args) {
  _throttle.apply(null, args)
}

export function _push(location, complete, fail, success) {
  pageStackLen = getPagesList().length + 1

  const url = parseUrl(location, true)

  const _success = function() {
    pageStackLen = getPagesList().length + 1
    success && success()
  }

  const params = { url, complete, fail, success: _success }
  if (location.isTab) {
    wx.switchTab(params)

    pageStackLen = 1
  } else if (location.reLaunch) {
    wx.reLaunch(params)

    pageStackLen = 1
  } else {
    if (pageStackLen >= maxStackLen) {
      wx.redirectTo(params)
      return
    }

    wx.navigateTo(params)
  }
}

export function replace(location, complete, fail, success) {
  const url = parseUrl(location)

  wx.redirectTo({
    url,
    complete,
    fail,
    success
  })
}

function go(delta) {
  wx.navigateBack({
    delta
  })
}

export function back() {
  wx.navigateBack()
}

export default {
  install(Vue) {
    if (this.installed) return

    this.installed = true

    let _route = {}

    const _router = {
      mode: 'history',
      currentRoute: _route,
      push,
      replace,
      go,
      back
    }

    Vue.mixin({
      onShow() {
        if (this.$parent) return
        const { $mp } = this.$root

        _route = parseRoute($mp)
        _router.app = this
      }
    })

    const $router = {
      get() {
        return _router
      }
    }

    const $route = {
      get() {
        return _route
      }
    }

    Object.defineProperty(Vue.prototype, '$router', $router)

    Object.defineProperty(Vue.prototype, '$route', $route)
  }
}
