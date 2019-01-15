export function stringifyQuery(obj) {
  const res = obj
    ? Object.keys(obj)
        .map(key => {
          let val = obj[key]

          if ([Array, Object].indexOf(val.constructor) > -1) {
            val = JSON.stringify(obj[key])
          }
          return `${key}=${val}`
        })
        // .filter(x => x.length > 0)
        .filter(Boolean)
        .join('&')
    : null

  return res ? `?${res}` : ''
}
