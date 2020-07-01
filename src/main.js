function scrollIntoView () {
  window.scrollTo(0, 0)
}

// 阻止微信拖动
// document.body.addEventListener('touchmove', function (e) {
//   e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
// }, {passive: false})


function getNowTime() {
  var myDate = new Date();
  return (myDate.getHours() * 3600) + (myDate.getMinutes() * 60)
}

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
      if (callBack) callBack(res.data)
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
        case 102:
          window.userInfo = res.data
          setCookie("userInfo", JSON.stringify(res.data))
          if (callBack) callBack(res.data)
          console.log('用户数据已更新!')
          break
        case 103:
          owo.tool.toast('您的余额不足!')
          owo.go('wallet')
          break
        case 104:
          owo.tool.toast('补签卡数量不足!')
          owo.go('myCard')
          break
        default:
          owo.tool.toast(res.message)
      }
    }
  })
}

setTimeout(() => {
  const urlPram = _owo.getQueryVariable()
  if (urlPram.code) {
    owo.go('outherLogin')
  }
}, 1000);

function weixinPay (payInfo) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', payInfo, function(res) {
      if(res.err_msg == "get_brand_wcpay_request:ok" ) {
        getData(`getOrder?trade=${owo.script.recharge.data.payInfo.out_trade_no}&userID=${userInfo.id}&token=${userInfo.token}`, (userInfo) => {
          owo.tool.toast('支付成功!')
        })
      }
    }
  ); 
}

// 如果有用户信息自动更新用户信息
let storUserInfo = getCookie('userInfo')
if (storUserInfo) {
  window.userInfo = JSON.parse(storUserInfo)
  if (userInfo.token && userInfo.id) {
    getData(`getUserInfo?token=${userInfo.token}&userID=${userInfo.id}`, (userInfo) => {
      owo.tool.toast('登陆成功!')
    })
  }
} else {
  window.userInfo = null
}

// 获取轮播图
getData('getSwiper', (data) => {
  let newHtml = ``
  data.forEach(element => {
    newHtml += `<div class="swiper-slide"><a href="${element.url}"><img src="${element.image}"><div class="text">${element.description}</div></a></div>`
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

//设置cookie
function setCookie(c_name, value) {
  var exdate = new Date()
  var expiredays = 356 * 24 * 60 * 60 * 1000
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name+ "=" + escape(value) + ";expires=" + exdate.toGMTString()
}

//取回cookie
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1) { 
      c_start = c_start + c_name.length + 1 
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}