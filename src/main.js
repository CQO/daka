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

function getData (url, callBack) {
  fetch(`http://127.0.0.1:8007/${url}`).then((response) => {return response.json();}).then((res) => {
    if (res.err === 0) {
      callBack(res.data)
    } else {
      switch (res.err) {
        case 100:
          owo.tool.toast('认证过期!')
          owo.go('login/view-loginContent=login/moveToLeft/moveFromRight//moveToRight/moveFromLeft')
          break
        default:
          owo.tool.toast(res.message)
      }
    }
  })
}
