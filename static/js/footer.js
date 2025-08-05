if (location.host.indexOf('360.cn') < 0) {
  // 底部footer配置
  $('.menu').hide()
  var map = {
    'www.xiaoyisysreset.com': 'Copyright©2005- 2024 XiaoYisysreset.COM All Rights Reserved 北京万博科思征信服务有限公司 京ICP备2023007724号[京ICP备2023007724号-1] 京公网安备 11010502052170号',
  }
  $('.footer-container').html(map[location.host])

  // 顶部导航配置
  var navs = [
    'www.xiaoyisysreset.com',
  ]
  // 顶部导航logo配置
  var logoMap = {
    'soft.stywru.cn': 'http://p0.qhimg.com/t01a030d25d61dbbc13.png', 
    'ruanjian.stywru.cn': 'http://p0.qhimg.com/t01a030d25d61dbbc13.png', 
    'singdown.com': 'http://p0.qhimg.com/t0191b68c47f3a2bfda.png',
  }
  if (navs.indexOf(location.host) > -1) {
    if (logoMap[location.host]) {
       $('.dlcnheader-wrap .dlcnheader .headerInner a img.logo').attr('src', logoMap[location.host])
       $('.dlcnheader-wrap .dlcnheader .headerInner ul.header-tab').hide()
       $('.dlcnheader-wrap .dlcnheader .headerInner div.headerLinkGroup').hide()
    }
    $('.dlcnheader').show()
    $('.dlcnheader-wrap').show()
    $('.dlcnheader-wrap + .app-container .header-container').hide()
    // $('.dlcnheader-wrap + .banner .banner-logo').css('opacity', 0)
  }
}