// 判断当前域名是否匹配正则，如果匹配则返回修改后的下载链接
function checkByReg(reg, url) { // 当前网页的域名匹配正则里面的任意一个则返回 true
    if (!url) return false

    for (var i = 0; i < reg.length; i++) {
        if (reg[i].test(url)) {
            return true
        }
    }
    return false
}

function tianJiYM(url) { // 判断下载链接的域名，如果匹配其中之一，则返回false，都不匹配则返回true
    if (url.indexOf('softcdn12.') !== -1 || url.indexOf('softcdn122.') !== -1) {
        return false
    }
    return true
}
/** 判断当前域名匹配特定域名结尾 并且 下载链接域名不是天极域名的的时候，替换下载链接的域名为合规域名 */
function setDownHost(url) { // url 为后台返回下载链接 
    var domainReg = [/.+\.mydown\.com$/, /.+\.tianjimedia\.com$/, /.+\.sootool\.net$/, /.+\.singdown\.com$/] // 匹配以.mydown.com、.tianjimedia.com、.sootool.net、.singdown.com结尾的字符串
    // console.log(checkByReg(domainReg, window.location.host));
    if (checkByReg(domainReg, window.location.host) && tianJiYM(url)) {
        var reg = /^([https:|http:]*\/\/)(.*?)(\/.*)/
        var softCdnDomain = 'softcdn12.mydown.com'
        var host = window.location.host.replace(/^[^\.]+/, '')
        // console.log(host);

        if (url.indexOf('dubapkg.cmcmcdn.com') !== -1) {
            softCdnDomain = 'softcdn12' + host
        }
        if (url.indexOf('soft-dl.v78q.com') !== -1) {
            softCdnDomain = 'softcdn122' + host
        }
        // console.log(softCdnDomain);
        return url.replace(reg, function (originUrl, matchA, matchB, matchC) {
            return '//' + softCdnDomain + matchC
        })
    }
    return url
}