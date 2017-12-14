/* 
* @Author: anchen
* @Date:   2017-09-25 22:29:20
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-29 20:40:45
*/

// 通过getters进行数据与组件之前的传递
// 
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

// 当前播放歌曲
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

// 当前歌单详情
export const disc = state => state.disc;

// 当前榜单详情
export const topList = state => state.topList;

// 当前搜索历史
export const searchHistory = state => state.searchHistory;

// 当前播放历史
export const playHistory = state => state.playHistory;

// 收藏列表
export const favoriteList = state => state.favoriteList;