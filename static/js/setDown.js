// DOM 元素
var jDownload = $('.J_downloadUrlAll');
var commonDown = $('.J_commonDown');

// URL 参数
var urlParams = {
    keyID: Infoc.queryString('keyID') || '',
    sfrom: Infoc.queryString('sfrom') || '166',
    bdVid: Infoc.queryString('bd_vid') || '',
    qihuOcpc: Infoc.queryString('oqh') || '0',
    qihuOcpcId: Infoc.queryString('qhclickid') || '',
    msOcpcId: Infoc.queryString('msclkid') || ''
};
var keyIDStr = 'od' + urlParams.keyID;

// 通用工具函数
var utils = {
    isDefined: function(value) {
        return value && value.trim() !== '';
    },
    
    getOcpcType: function(returnType) {
        returnType = returnType || 'num';
        var conditions = [
            { key: urlParams.bdVid, type: 1 },
            { key: urlParams.qihuOcpcId, type: 2 },
            { key: urlParams.msOcpcId, type: 3 }
        ];
        
        for (var i = 0; i < conditions.length; i++) {
            if (this.isDefined(conditions[i].key)) {
                return returnType === 'str' ? conditions[i].key : conditions[i].type;
            }
        }
        return returnType === 'str' ? '' : 0;
    },
    
    checkDownUrl: function(url, addStr) {
        var slashArr = url.split('/');
        var fileName = slashArr[slashArr.length - 1];
        var urlArr = url.split(fileName);
        var exeArr = fileName.split('.exe');
        var odIndex = fileName.indexOf(keyIDStr);
        
        if (odIndex > 0) {
            var lineArr = fileName.split('_' + keyIDStr);
            return urlArr[0] + lineArr[0] + '_' + keyIDStr + '_' + addStr + lineArr[1];
        }
        return urlArr[0] + exeArr[0] + '_' + addStr + '.exe';
    },
    // 提取pageID的新方法，支持f336.html和f336-***.html格式
    extractPageID: function(filename) {
        // 去掉文件扩展名，获取主文件名
        var mainName = filename.split('.')[0];
        // 去掉开头的'f'
        var nameWithoutF = mainName.substring(1);
        // 如果包含'-'，只取'-'前面的数字部分
        var pageID = nameWithoutF.split('-')[0];
        return pageID.toString();
    }
};

// 页面信息
var pathnameArr = window.location.pathname.split('/');
var pageName = utils.extractPageID(pathnameArr[pathnameArr.length-1]);

// OCPC 类型
var ocpcTypeStr = utils.getOcpcType('str');
var ocpcTypeNum = utils.getOcpcType('num');

// 埋点功能
var ocpcInfoc = {
    infoc: null,
    
    reportData: function(flowType) {
        if (this.infoc) {
            this.infoc.report({
                business_index: 8351,
                version: 2,
                product_id: typeof productId !== 'undefined' ? productId : 1,
                flow_type: flowType || 0,
                error_code: '',
                def_string: '',
                def_int: 0,
                account_type: ocpcTypeNum
            });
        }
    },
    
    init: function() {
        this.infoc = Infoc.b('db');
        this.bindEvents();
        this.reportData(1);
    },
    
    bindEvents: function() {
        var self = this;
        $('body').on('click', '.J_ocpcBtn', function() {
            bdVidHandler.copy();
            self.reportData(6);
        });
    }
};

// 百度 VID 处理
var bdVidHandler = {
    shortCode: '',
    
    init: function() {
        var self = this;
        if (urlParams.qihuOcpcId || urlParams.bdVid || urlParams.msOcpcId) {
            ocpcInfoc.reportData(2);
            self.getShortCode();
        } else {
            ocpcInfoc.reportData(3);
        }
    },
    
    getShortCode: function() {
        var self = this;
        try {
            var pid = '0';
            var postUrl = '//newvip.duba.net/api/v2/ocpc/get_short_code'; // 毒霸
            
            if (typeof productId !== 'undefined') {
                if (productId !== 1) {
                    pid = productId.toString();
                }
                if (productId === 2) {
                    postUrl = '//dgvip.duba.net/api/sdk/ocpc/get_short_code'; // 驱动精灵
                }
            }
            
            $.ajax({
                url: postUrl,
                headers: { Accept: 'application/json' },
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "common": {},
                    "source_url": window.location.href,
                    "long_code": ocpcTypeStr,
                    "payload": '',
                    "pid": pid,
                    "account_type": String(ocpcTypeNum)
                }),
                timeout: 10000,
                success: function(response) {
                    if (response && response.resp_common && response.resp_common.ret === 0) {
                        self.shortCode = response.short_code;
                        ocpcInfoc.reportData(4);
                        self.updateDownloadUrl();
                    } else {
                        ocpcInfoc.reportData(5);
                    }
                },
                error: function(error) {
                    if (window.console && console.error) {
                        console.error('获取短码失败:', error);
                    }
                    ocpcInfoc.reportData(5);
                }
            });
        } catch (error) {
            if (window.console && console.error) {
                console.error('获取短码失败:', error);
            }
            ocpcInfoc.reportData(5);
        }
    },
    
    copy: function() {
        var ocpcValue;
        if (this.shortCode === '') {
            ocpcValue = JSON.stringify({ "bdVid": ocpcTypeStr });
        } else {
            ocpcValue = JSON.stringify({ "cfBdVid": this.shortCode });
        }
        
        try {
            var input = document.createElement('input');
            input.value = ocpcValue;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            ocpcInfoc.reportData(9);
        } catch (error) {
            if (window.console && console.error) {
                console.error('复制到剪贴板失败:', error);
            }
            ocpcInfoc.reportData(10);
        }
    },
    
    updateDownloadUrl: function() {
        var $ocpcBtn = $('.J_ocpcBtn');
        var originalUrl = $ocpcBtn.attr('href');
        var newUrl = utils.checkDownUrl(originalUrl, 'b' + this.shortCode + 'd');
        $ocpcBtn.attr('href', newUrl);
        ocpcInfoc.reportData(7);
    }
};

// 繁星处理
var fanXingHandler = {
    init: function() {
        var self = this;
        var defaultLink = '//dubapkg.cmcmcdn.com/duba/' + urlParams.sfrom + 
                         '/kinst_' + urlParams.sfrom + '_f' + pageName + 
                         '_k' + urlParams.keyID + '.exe';
        var channelLink = defaultLink.replace('.exe', '_ch1.exe');
        
        try {
            $.ajax({
                url: '//fullstar.zhhainiao.com/inst/dlurls/all/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "soft_id": parseInt(pageName, 10),
                    "ch_id": parseInt(urlParams.sfrom, 10),
                    "key_id": parseInt(urlParams.keyID, 10)
                }),
                timeout: 10000,
                success: function(response) {
                    if (response && response.resp_common && response.resp_common.ret == 0) {
                        var urls = response.urls,
                            custom = urls.custom;
                        if(urls.def && urls.def != ''){
                            defaultLink = urls.def;
                        }
                        if(urls.ch && urls.ch != ''){
                            channelLink = urls.ch;
                        }

                        if(custom.def && custom.def != ''){
                            defaultLink = decodeURI(custom.def);
                        }
                        if(custom.ch && custom.ch != ''){
                            channelLink = decodeURI(custom.ch);
                        }
                        self.updateDownloadLinks(defaultLink, channelLink);
                    } else {
                        self.updateDownloadLinks(defaultLink, channelLink);
                    }
                },
                error: function(error) {
                    if (window.console && console.error) {
                        console.error('获取下载链接失败:', error);
                    }
                    self.updateDownloadLinks(defaultLink, channelLink);
                }
            });
        } catch (error) {
            if (window.console && console.error) {
                console.error('获取下载链接失败:', error);
            }
            self.updateDownloadLinks(defaultLink, channelLink);
        }
    },
    setKeyID: function () {
      var originalDownloadUrl = $('.J_ocpcBtn').attr('href')
      originalDownloadUrl = utils.checkDownUrl(originalDownloadUrl, keyIDStr)
  
      $('.J_ocpcBtn').attr('href', originalDownloadUrl)
    },
    judgeOcpc: function() {
        if (ocpcTypeNum !== 0) {
            if (ocpcTypeNum === 1) {
                return true;
            }
            if (ocpcTypeNum === 2) {
                var tianjiOcpc = window.location.pathname.indexOf('tianji') > -1 ? true : false;
                if (tianjiOcpc && urlParams.qihuOcpc == '1') {
                    return true;
                }
                if (!tianjiOcpc) {
                    return true;
                }
                return false;
            }
            if (ocpcTypeNum === 3) {
                if (urlParams.sfrom === '196') {
                    return true;
                }
                return false;
            }
        } 
        return false;
    },
    
    updateDownloadLinks: function(mainUrl, channelUrl) {
        // jDownload 使用带参数的链接，commonDown 使用原始链接
        mainUrl = setDownHost(mainUrl)
        jDownload.attr('href', mainUrl);
        if (channelUrl && commonDown.length) {
            commonDown.attr('href', setDownHost(channelUrl));
        }
        // todo
        if (urlParams.keyID !== '' && urlParams.sfrom !== '196') {
            this.setKeyID()
        }
        if (this.judgeOcpc()) {
            bdVidHandler.init();
            ocpcInfoc.init();
        }
    },
};

// 初始化
$(function() {
    if (jDownload.length > 0) {
        fanXingHandler.init();
    }
});