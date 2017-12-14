/* 
* @Author: anchen
* @Date:   2017-09-12 21:55:41
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-18 00:23:35
*/

export const commonParams = {
    g_tk:5381,
    inCharset:'utf-8',
    outCharset:'utf-8',
    notice:0,
    format:'jsonp'
}

export const options = {
    param: 'jsopCallback'
}

// 现在需要prefix属性表示callback返回的名字
export const options1 = {
    param: 'jsonpCallback',
    prefix: 'playlistinfoCallback'
}
export const options2 = {
    param: 'jsonpCallback',
    prefix: 'getPlaylist'
}
export const ERR_OK = 0;