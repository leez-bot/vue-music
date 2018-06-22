/* 
* @Author: anchen
* @Date:   2017-09-25 22:28:08
* @Last Modified by:   leeZ
* @Last Modified time: 2018-06-22 13:56:54
*/

// vuex数据修改操作
// 获取所有操作常量
import * as types from './mutation-type'

const mutations = {
    [types.SET_SINGER](state, singer){
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state,flag) {
      state.playing = flag
    },
    [types.SET_FULL_SCREEN](state,flag) {
      state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state,list) {
      state.playlist = list
    },
    [types.SET_SEQUENCE_LIST](state,list) {
      state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state,mode) {
      state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state,index) {
      state.currentIndex = index
    },
    [types.SET_DISC](state,disc) {
      state.disc = disc
    },
    [types.SET_TOP_LIST](state,topList) {
      state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state,history) {
      state.searchHistory = history
    },
    [types.SET_PLAY_HISTORY](state,history) {
      state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state,list) {
      state.favoriteList = list
    },
    [types.SET_CURRENTSONG_URL](state, url) {
      state.currentSong.url = url
    }
}

export default mutations