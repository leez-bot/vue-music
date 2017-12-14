/* 
* @Author: leeZ
* @Date:   2017-11-21 20:54:15
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-21 22:14:57
*/

import jsonp from 'common/js/jsonp'
import {commonParams,options1} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data,options1);
}

// 获取具体歌单数据
export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    platform: 'h5',
    needNewCode: 1,
    page: 'detail',
    type: 'top',
    tpl: 3
  })

  return jsonp(url, data,options1);
}