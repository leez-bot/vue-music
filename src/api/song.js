/* 
* @Author: leeZ
* @Date:   2017-11-15 20:39:07
* @Last Modified by:   leeZ
* @Last Modified time: 2018-06-22 10:21:10
*/

import axios from 'axios'
import {commonParams} from './config'

const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid) {
  const url = debug ? '/api/lyric' : `http://${window.location.host}/api/lyric`;

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