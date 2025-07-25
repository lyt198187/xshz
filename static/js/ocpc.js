var bdVidArr = window.location.href.split('bd_vid=');
var bdVid = bdVidArr.length > 1 ? bdVidArr[1].toString() : '';
if (bdVid.indexOf('&') > -1) {
  bdVid = bdVid.split('&')[0]
}
//埋点
// duba_semocpc_langpage:8181 version:byte product_id:int flow_type:int error_code:string def_string:string def_int:int

var ocpcInfocFun = {
  infoc: null,
  reportData: function (flowType) {
    this.infoc.report({
      business_index: 8181, // duba_semocpc_langpage
      version: 1, //版本号
      product_id: typeof productId != 'undefined' ? productId : 1, // 1-毒霸 2-精灵
      flow_type: flowType || 0, //1-落地页展示 2-落地页展示（获取长码成功） 3-落地页展示（获取长码失败）4-长码换短码成功5-长码换短码失败6-落地页点击7-短码写入安装链接成功8-短码写入安装链接失败7-短码写入剪贴板成功8-短码写入剪贴板失败
      error_code: '',
      def_string: '',
      def_int: 0
    });
  },
  init:function() {
    this.infoc = Infoc.b('db');
    this.bind();
    this.reportData(1);
  },
  bind:function () {
    var self = this;
    $('body').on('click','.J_ocpcBtn', function() {
      bdVidFun.copy(); // 触发拷贝
      self.reportData(6); // 落地页点击
    });
  }
};

var bdVidFun = {
  init: function () {
    var _this = this
    if (bdVid !== '') { // 获取长码成功
      ocpcInfocFun.reportData(2);
      _this.bind()
    } else {
      ocpcInfocFun.reportData(3);
    }
  },
  shortCode: '',
  bind: function () { // 处理短码
    var _this = this
    try {
      var pid = '0'
      var postUrl = '//newvip.duba.net/api/v2/ocpc/get_short_code' // 毒霸
      if (typeof productId != 'undefined') {
        if (productId !== 1) {
          pid = productId.toString()
        }
        if (productId == 2) {
          postUrl = '//dgvip.duba.net/api/sdk/ocpc/get_short_code' // 驱动精灵
        }
      }
      var data = JSON.stringify({
          "common": {},
          "source_url": window.location.href, 
          "long_code": bdVid,
          "payload": '',
          "pid": pid
        });
      
      $.ajax({
        url: postUrl, 
        headers: {
          Accept: 'application/json',
        },
        type: 'POST',
        contentType:'application/json',
        data: data,
        timeout: 10000,
        success: function (res) {
          if(res && res.resp_common.ret == 0){
            _this.shortCode = res.short_code
            ocpcInfocFun.reportData(4); // 长码换短码成功
            _this.setDownloadVid()
          } else {
            ocpcInfocFun.reportData(5); // 长码换短码失败
          }
        },
        error: function () {
          ocpcInfocFun.reportData(5); // 长码换短码失败
        }
      });
    }catch (e) {
      ocpcInfocFun.reportData(5); // 长码换短码失败
    }
  },
  copy: function () { // 处理剪切板
    var ocpcValue
    if (this.shortCode == '')  {
      ocpcValue = JSON.stringify({ "bdVid": bdVid });
    } else {
      ocpcValue = JSON.stringify({ "cfBdVid": this.shortCode });
    }
    var inputTest = document.createElement('input');
    inputTest.value = ocpcValue
    document.body.appendChild(inputTest);
    inputTest.select();
    document.execCommand('copy');
    inputTest.style.display = 'none';
    ocpcInfocFun.reportData(9); // 短码写入安装链接成功
  },
  setDownloadVid: function () { // 处理下载链接
    var originalDownloadUrl = $('.J_ocpcBtn').attr('href')
    originalDownloadUrl = this.checkDownUrl(originalDownloadUrl)
    $('.J_ocpcBtn').attr('href', originalDownloadUrl)
    ocpcInfocFun.reportData(7); // 短码写入安装链接成功
  },
  checkDownUrl: function (originalDownloadUrl) {
    var index = originalDownloadUrl.indexOf('_')
    if (index > 0) {
      var lineArr = originalDownloadUrl.split('_')
      var lineAfterStr = originalDownloadUrl.split(lineArr[0])
      return lineArr[0] + '_b' + this.shortCode + 'd' + lineAfterStr[1]
    } else {
      var exeArr = originalDownloadUrl.split('.exe')
      return exeArr[0] + '_b' + this.shortCode + 'd.exe'
    }
  }
}

