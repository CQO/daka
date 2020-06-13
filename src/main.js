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
  let minute = num % 3600 / 60
  if (hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute
  return `${hour}:${minute}`
}
// const serverIP = 'http://127.0.0.1:8007'
const serverIP = 'http://154.8.196.163:8007'
function getData (url, callBack) {
  fetch(`${serverIP}/${url}`).then((response) => {return response.json();}).then((res) => {
    if (res.err === 0) {
      callBack(res.data)
    } else {
      switch (res.err) {
        case 100:
          owo.tool.toast('认证过期!')
          owo.go('login/view-loginContent=login/moveToLeft/moveFromRight//moveToRight/moveFromLeft')
          break
        case 101:
          owo.tool.toast(res.message)
          window.location.href = ''
          break
        default:
          owo.tool.toast(res.message)
      }
    }
  })
}
// setTimeout(() => {
//   const urlPram = _owo.getQueryVariable()
//   if (urlPram.code) {
//     owo.go('outherLogin')
//   }
// }, 1000);

function weixinPay (payInfo) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', payInfo, function(res) {
      if(res.err_msg == "get_brand_wcpay_request:ok" ) {
        alert(JSON.stringify(res))
        // 使用以上方式判断前端返回,微信团队郑重提示：
        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      } 
    }
  ); 
}

// 如果有用户信息自动更新用户信息
let storUserInfo = localStorage.getItem('userInfo')
if (storUserInfo) {
  window.userInfo = JSON.parse(storUserInfo)
  if (userInfo.token && userInfo.id) {
    getData(`getUserInfo?token=${userInfo.token}&userID=${userInfo.id}`, (data) => {
      if (data) {
        userInfo = data
        // 存储到本地数据库中
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
        console.log('用户数据已更新!')
      }
    })
  }
} else {
  window.userInfo = null
}

// 获取轮播图
getData('getSwiper', (data) => {
  let newHtml = ``
  data.forEach(element => {
    newHtml += `<div class="swiper-slide"><a href="${element.url}"><img src="${element.image}"><div class="text">${element.desc}</div></a></div>`
  })
  document.getElementsByClassName('swiper-wrapper')[0].innerHTML = newHtml
  // 轮播图展示区域swiper
  setTimeout(() => {
    new Swiper(document.getElementsByClassName('swiper-container')[0], {
      pagination: {
        el: document.getElementsByClassName('pagination')[0]
      },
      loop: true,
      autoplay: {},
      paginationClickable: true
    })
    console.log('轮播图初始化成功!')
  }, 0)
})