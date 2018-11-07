export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function getFormatBySecond (t = 0) {
  var hourst = Math.floor(t / 3600)
  var hours = ''
  if (hourst === 0) {
    hours = '00'
  } else {
    if (hourst < 10) hours = '0' + hourst
    else hours = '' + hourst
  }
  var minst = Math.floor((t - hourst * 3600) / 60)
  var secondt = Math.floor((t - hourst * 3600) % 60)
  var mins = ''
  var sens = ''
  if (minst === 0) {
    mins = '00'
  } else if (minst < 10) {
    mins = '0' + minst
  } else {
    mins = '' + minst
  }
  if (secondt === 0) {
    sens = '00'
  } else if (secondt < 10) {
    sens = '0' + secondt
  } else {
    sens = '' + secondt
  }
  return hours + ':' + mins + ':' + sens
}

export function equalArray (oriArr, tarArr) {
  if (!tarArr) return false
  if (oriArr.length !== tarArr.length) return false
  oriArr.sort()
  tarArr.sort()
  for (var i = 0, l = oriArr.length; i < l; i++) {
    // Check if we have nested arrays
    if (oriArr[i] instanceof Array && tarArr[i] instanceof Array) {
      // recurse into the nested arrays
      if (!oriArr[i].equals(tarArr[i])) return false
    } else if (oriArr[i] !== tarArr[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
