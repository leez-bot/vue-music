/* 
* @Author: anchen
* @Date:   2017-09-28 21:29:06
* @Last Modified by:   leeZ
* @Last Modified time: 2018-06-22 10:57:19
*/
import {getLyric} from 'api/song'
import {getSongVkey} from 'api/singer'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
var vkey = ''
// 歌曲类
// 
export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url, vkey}){
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
        this.vkey = vkey
    }
    // 调用接口，获取歌词信息并将信息加入到歌曲类中
    getLyric() {
        if(this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resove, reject) => {
            getLyric(this.mid).then((res) => {
                if(res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric);
                    resove(this.lyric)
                    // console.log(this.lyric)
                }else {
                    reject('no lyric')
                }
            })
        })
    }
}


// 创建歌曲对象
export function createSong(musicData, vkey){
    // console.log(vkey)
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer:filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,// 播放时长
        // 歌曲图片地址
        image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // 歌曲播放地址
        // 初版播放地址
        // url:`http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
        // 通用播放地址 2018/6月不可用，需要加vkey
        // url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=32`
        // vkey:F478812E0533A8FE0B8B9F78F5FB60BFBCD9680E903A83C0DB07D315507D22A82AB387911B4B7D8005A87DD1678F2E08057A45FB4FB46D31
        // 2018.1月播放地址 vkey为随机生成 (2018/6月添加vkey参数)
        url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=4843775074&vkey=CD54FB287B5ADDC3B8C7AFAB42C9EADB662780A1522534CF02F4D2A340CFB77BE641244B441ADC626751370ECFD3915D287F37CCB08A5CF5&uin=855&fromtag=38`
    })
}

// 处理歌曲数组为字符串
function filterSinger(singer){
    let ret = []
    if(!singer){
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}