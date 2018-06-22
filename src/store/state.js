/* 
* @Author: anchen
* @Date:   2017-09-25 22:27:30
* @Last Modified by:   leeZ
* @Last Modified time: 2018-06-22 13:55:19
*/

import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/catch'

// vuex状态
// 
const state = {
    singer: {},

    // 播放器状态参数
    playing: false,
    fullScreen: false,
    playlist: [],// 当前播放列表
    sequenceList: [],// 原始列表
    mode: playMode.sequence, // 默认顺序播放
    currentSong: {}, //当前播放歌曲
    currentIndex : -1, //当前播放索引
    disc: {},// 当前选择的歌单对象
    topList: {},// 当前选择的榜单信息
    searchHistory: loadSearch(),// 搜索历史
    playHistory: loadPlay(), // 播放历史
    favoriteList: loadFavorite() // 收藏列表
}

export default state