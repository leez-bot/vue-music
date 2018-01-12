/* 
* @Author: anchen
* @Date:   2017-09-28 21:29:06
* @Last Modified by:   leeZ
* @Last Modified time: 2018-01-11 17:05:11
*/
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
// 歌曲类
// 
export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}){
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
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
export function createSong(musicData){
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
        // 2018.1月播放地址 vkey为随机生成
        url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a??fromtag=38&vkey=A33EF139195273E11EAFA3A9190962244E47EC31442EE6670CBE75331B23A44107A47E52F0509DD354D964FA35342E9ACC69D3D56C764D04&guid=4843775074`
        // 通用播放地址
        // url:`http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
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