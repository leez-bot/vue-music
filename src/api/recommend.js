/* 
* @Author: anchen
* @Date:   2017-09-12 21:53:15
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-21 20:32:18
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options1} from './config'
import axios from 'axios'

export function getRecommend(){
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    const data = Object.assign({},commonParams,{
        platform: 'h5',
        uin:0,
        needNewCode:1
    })

    return jsonp(url,data,options1);
}

export function getDiscList(){
    const url = '/api/getDiscList';
    const data = Object.assign({},commonParams,{
        platform: 'yqq',
        uin:0,
        loginUin:0,
        hostUin:0,
        notice:0,
        sortId:5,
        sin:0,
        ein:29,
        needNewCode:0,
        categoryId:10000000,
        rnd:Math.random(),
        format:'json'
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    });
}

// 获取歌单详情
export function getSongList(disstid) {
    const url = '/api/getSongList'
    const data = Object.assign({},commonParams,{
        disstid,
        type:1,
        json:1,
        utf8:1,
        onlysong:0,
        g_tk:5381,
        loginUin:0,
        hostUin:0,
        format:'json',
        notice:0,
        platform:'yqq',
        needNewCode:0
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
        // console.log(res.data.cdlist.songlist);
        // console.log(JSON.parse(res.data));
    });
}
