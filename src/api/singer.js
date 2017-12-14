/* 
* @Author: anchen
* @Date:   2017-09-19 22:07:11
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-25 23:50:32
*/

import jsonp from 'common/js/jsonp'
import {commonParams,options1} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({},commonParams,{
    channel:'singer',
    page:'list',
    key:'all_all_all',
    pagesize:100,
    pagenum:1,
    jsonpCallback:'',
    loginUin:0,
    hostUin:0,
    platform:'yqq',
    needNewCode:0
  })

  return jsonp(url,data,options1);
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({},commonParams,{
    platform:'yqq',
    singermid:singerId,
    order:'listen',
    begin:0,
    num:100,
    g_tk:56502623,
    loginUin:0,
    hostUin:0,
    needNewCode:0,
    songstatus:1
  })

  return jsonp(url,data,options1);
}