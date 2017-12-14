/* 
* @Author: leeZ
* @Date:   2017-11-15 20:39:07
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-15 20:44:18
*/

import axios from 'axios'
import {commonParams} from './config'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    format: 'json'
  })

  return axios.get(url,{
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}