function scrollIntoView () {
  window.scrollTo(0, 0)
}

// 阻止微信拖动
// document.body.addEventListener('touchmove', function (e) {
//   e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
// }, {passive: false})

// 数据库时间转时间
function getTimeStr(num) {
  let hour = parseInt(num / 3600)
  let minute = num % 3600
  if (hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute
  return `${hour}:${minute}`
}