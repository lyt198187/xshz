$(function () {
  // 提取pageID的新方法，支持f336.html和f336-***.html格式
  function extractPageID(filename) {
    // 去掉文件扩展名，获取主文件名
    var mainName = filename.split('.')[0];
    // 去掉开头的'f'
    var nameWithoutF = mainName.substring(1);
    // 如果包含'-'，只取'-'前面的数字部分
    var pageID = nameWithoutF.split('-')[0];
    return pageID.toString();
  }

  var keyID = Infoc.queryString('keyID') || 90759; // keyID
  var sfrom = Infoc.queryString('sfrom') || 166; // sfrom
  var pathnameArr = window.location.pathname.split('/'); // pathname
  var pageID = extractPageID(pathnameArr[pathnameArr.length - 1]); // pageID
  var msclkid = Infoc.queryString('msclkid') || ''; // msclkid

  var infocFun = {
    infoc: Infoc.b('daohang'),
    infoConfig: {
      business_index: 188, // dhsite_sem_db
      stat: 0, //网页状态：0访问1点击
      source: 19, // 专题类型， 19为 软件定制模板
      clickbutton: 0, //点击网页的按钮上报
      shichang: 0, // 时长
      feedback: '', // 反馈
      contactqq: msclkid || '', // 联系qq
      channel: pageID, // 渠道
      reserve: parseInt(keyID) || 0, //保留字段1
      reserve2: sfrom || '' //保留字段2
    },
    init: function () {
      // 展示埋点
      infocFun.infoc.report(infocFun.infoConfig);

      $('body').on('click', '.J_downloadUrlAll, .J_commonDown', function () {
        infocFun.infoConfig.stat = 1; // 网页状态：0访问1点击
        var status = $(this).attr('status') || 0; // 点击网页的按钮上报
        infocFun.infoConfig.clickbutton = status; // 赋值
        infocFun.infoc.report(infocFun.infoConfig);
      });
    }
  }
  infocFun.init()

  /* 
   DTS=1(隐藏双按钮)
   DTS=0或者别的值或者不填(显示双按钮) */
  var downTypeShow = Infoc.queryString('DTS') || ''
  if (downTypeShow == 9) {
    // 根据 DTS=9 隐藏下载区域
    // 1. 找到文本为“普通下载”的 a 标签
    var $normalDownLink = $('a').filter(function () {
      return $.trim($(this).text()) === '普通下载';
    }).first();

    if ($normalDownLink.length) {
      // 2. 获取 a 标签所属的父级元素（假设为普通下载按钮容器）
      var $normalParent = $normalDownLink.parent();
      // 3. 在其兄弟元素中查找是否包含 class="J_downloadUrlAll" 的安全下载按钮
      var $secureSibling = $normalParent.siblings().filter(function () {
        return $(this).find('.J_downloadUrlAll').length > 0;
      }).first();

      if ($secureSibling.length) {
        // 4. 获取能够同时包含普通下载和安全下载两个按钮模块的共同父级并隐藏
        var $wrapper = $normalParent.parent();
        if ($wrapper.length) {
          $wrapper.hide();
        }
      }
    }
  }

  $(window).on('load', function () {
    setTimeout(function () { // 延时确保 loadEventEnd 已更新
      var loadTime;

      // 检查是否支持 performance.timing API
      if (window.performance && window.performance.timing) {
        // 使用 performance.timing API 获取更精确的结果
        var timing = window.performance.timing;
        loadTime = (timing.loadEventEnd - timing.navigationStart);
      } else {
        // 备用方案：使用 Date 获取大致的加载时长
        var endTime = new Date().getTime();
        loadTime = (endTime - globalStartTime);
      }
      // 输出页面加载时长
      infocFun.infoConfig.stat = 78;
      infocFun.infoConfig.feedback = loadTime.toString() || '';
      infocFun.infoc.report(infocFun.infoConfig);
    }, 0);
  });

})

$(function(){
  var sfromNum = Infoc.queryString('sfrom') || '225';
  var pathNameArr = window.location.pathname.split('/');
  var pageNameID = pathNameArr[pathNameArr.length-1].split('.')[0].substring(1).toString();

  if (sfromNum === '196') {
      (function (w, d, t, r, u) {
          var f, n, i;
          w[u] = w[u] || [], f = function () {
              var o = {
                  ti: "187124716",
                  enableAutoSpaTracking: true
              };
              o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
          }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () {
              var s = this.readyState;
              s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
          }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
      })(window, document, "script", "//bat.bing.com/bat.js", "uetq");

      function uet_report_conversion() {
          window.uetq = window.uetq || [];
          window.uetq.push('event', 'other', {"event_value":pageNameID});
      }
      $(".J_downloadUrlAll").click(function () {
          if (sfromNum === '196') {
              uet_report_conversion()
          }
      })
  }

  (function (b, a, e, h, f, c, g, s) {
    b[h] = b[h] || function () {
        (b[h].c = b[h].c || []).push(arguments)
    };
    b[h].s = !!c;
    g = a.getElementsByTagName(e)[0];
    s = a.createElement(e);
    s.src = "//s.union.360.cn/" + f + ".js";
    s.defer = !0;
    s.async = !0;
    g.parentNode.insertBefore(s, g)
  })(window, document, "script", "_qha", 572149, false);
  
})
