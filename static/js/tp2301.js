$(function () {

  var jDownload = $('.J_downloadUrlAll');
  var keyID = Infoc.queryString('keyID') || 90759;
  var sfrom = Infoc.queryString('sfrom') || 166;
  var commonDown = $('.J_commonDown');
  var pathnameArr = window.location.pathname.split('/');
  var f = pathnameArr[pathnameArr.length - 1].split('.')[0].substring(1).toString();

  var infocFun = {
    init: function () {
      //埋点
      var infoc = Infoc.b('daohang');
      var infoConfigShow = {
        business_index: 188, // dhsite_sem_db
        stat: 0, //网页状态：0访问 ，1点击
        source: 19, // 专题类型， 19为 软件定制模板
        clickbutton: 0, //点击网页的按钮上报
        shichang: 0,
        feedback: '',
        contactqq: '',
        channel: f,
        reserve: parseInt(keyID) || 0, //保留字段1
        reserve2: sfrom || '' //保留字段2
      };
      infoc.report(infoConfigShow);

      $('body').on('click', '.J_downloadUrlAll, .J_commonDown, #J_checkClose, #J_checkBtn, #J_checkTypeDownload, #J_checkBottomBtn, #J_question', function () {
        infoConfigShow.stat = 1;
        var status = $(this).attr('status')
        infoConfigShow.clickbutton = status;
        infoc.report(infoConfigShow);
      });
    }
  }
  infocFun.init()
  /* 
   DTS=1(隐藏双按钮)
   DTS=0或者别的值或者不填(显示双按钮) */
  var downTypeShow = Infoc.queryString('DTS') || ''
  if (downTypeShow == 9) {
    $('#J_downType').hide()
  } else {
    $('#J_downType').show()
  }
  // 弹窗
  $('body').on('click', '#J_commonBtn', function () {
    $('#J_alertBox').show();
  })
  $('body').on('click', '#J_alertClose', function () {
    $('#J_alertBox').hide();
  })
  //  确认
  var checkTypeShow = Infoc.queryString('check') || ''
  if (checkTypeShow == 1) {
    $('#J_checkBtn').show()
    $('#J_checkBottomBtn').show()
    $('#J_checkTypeDownload').show()
    $('.J_download').hide()
    $('.J_bottomDownload').hide()
    $('.J_typeDownload').hide()
  } else {
    $('#J_checkBtn').hide()
    $('#J_checkBottomBtn').hide()
    $('#J_checkTypeDownload').hide()
    $('.J_download').show()
    $('.J_bottomDownload').show()
    $('.J_typeDownload').show()
  }
  // 确认弹窗
  $('body').on('click', '#J_checkBtn, #J_checkBottomBtn, #J_checkTypeDownload', function () {
    $('#J_checkBox').show();
  })
  $('body').on('click', '#J_checkClose', function () {
    $('#J_checkBox').hide();
  })
  $('body').on('click', '#J_checkDown', function () {
    $('#J_checkBox').hide();
  })
  // 安全下载
  var safeHide = Infoc.queryString('safeH') || '0';
  if (safeHide !== '1') {
    var TFT = Infoc.queryString('TFT') || '1';
    var safeUrl = '/safedown.html?partner=' + TFT
    $('#J_question').attr('href', safeUrl)
  } else {
    $('#J_question').hide()
  }

  var sfromS = Infoc.queryString('sfrom') || '166';
  var sfromST = Infoc.queryString('sfromT') || '0';
  if (sfromS == '216' && sfromST == '1') {
    $('#J_tips').show()
    $('body').on('click', '#J_tipsClose', function () {
      $('#J_tips').hide()
    })
  }
})