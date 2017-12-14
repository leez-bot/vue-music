/* 
* @Author: leeZ
* @Date:   2017-11-23 21:37:54
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-24 20:25:12
*/

import jsonp from 'common/js/jsonp'
import {commonParams,options1} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options1);
}

export function search(query, page, zhida, perpage) {
  // query: 搜索关键字
  // page: 搜索第几页
  // zhida: 搜索结果是否包含歌手信息
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const data = Object.assign({}, commonParams,{
    w: query,
    p: page,
    zhidaqu: zhida ? 1 : 0,
    catZhida: zhida ? 1 : 0,
    perpage:perpage,
    n:perpage,
    t:0,
    flag:1,
    ie:'utf-8',
    sem:1,
    aggr:0,
    remoteplace:'txt.mqq.all',
    uid: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options1);
}