/* 
* @Author: anchen
* @Date:   2017-09-12 21:37:06
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-12 23:32:06
*/

import originJSONP from 'jsonp'

export default function jsonp(url,data,option){
    url += (url.indexOf('?') < 0 ? '?' : '&')+param(data);

    return new Promise((resolve,reject) => {
        // resolve成功回调
        originJSONP(url,option,(err,data) => {
            if(!err){
                resolve(data);
            }else{
                reject(err)
            }
        })
        // reject失败回调
    });
}

function param(data){
    let url = '';
    for(var k in data){
        let value = data[k] !== undefined ? data[k] : '';
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : '';
}