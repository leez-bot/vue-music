/* 
* @Author: anchen
* @Date:   2017-09-25 22:28:58
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-29 20:50:08
*/

// 操作多个mutaions时，选择封闭方法
// 
// 
import * as types from './mutation-type'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/catch'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点选歌曲播放操作
// 
 export const selectPlay = function({commit, state},{list, index}) {
  // 设置顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 当切换为随机播放后，播放列表改变，index对应的歌曲下标对应变化,需要重新找到当前选中歌曲的新下标
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  // 设置当前播放歌曲索引
  commit(types.SET_CURRENT_INDEX, index)
  // 打开全屏播放器
  commit(types.SET_FULL_SCREEN, true)
  // 设置播放状态为正在播放
  commit(types.SET_PLAYING_STATE, true)
 }

// 随机播放全部
 export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST,randomList);
  commit(types.SET_CURRENT_INDEX,0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE,true);
 }

// 搜索过后，插入歌曲至当前播放列表
export const insertSong = function( {commit, state}, song) {
  // 获取当前播放列表及状态
  // 用slice()方法复制一个副本，实际的操作还是最后的commit进行提交的
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  // 记录当前列表
  let currentSong = playlist[currentIndex];
  // 先在当前播放列表中搜索是否已经有选择插入的歌曲并返回及索引
  let fpIndex = findIndex(playlist, song)
  // 将插入的歌曲放到播放列表中当前播放歌曲的后面
  currentIndex++;
  // 插入歌曲到当前索引位置
  playlist.splice(currentIndex, 0, song);
  // 如果已经有这首歌
  if(fpIndex > -1) {
    // 如果当前插入索引大于歌曲本身的序号
    if(currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--
    } else {
      playlist.splice(fpIndex+1, 1)
    }
  }

  // 计算出歌曲应该插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);

  sequenceList.splice(currentIndex, 0, song)

  if(fsIndex > -1) {
    if(currentIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    }else {
      sequenceList.splice(fsIndex+1, 1);
    }
  }

  commit(types.SET_PLAYLIST,playlist);
  commit(types.SET_SEQUENCE_LIST,sequenceList);
  commit(types.SET_CURRENT_INDEX,currentIndex);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_PLAYING_STATE,true);
}

// 将搜索结果插入到本地缓存中
export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

// 删除搜索记录
export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

export const clearSearchHistory = function({commit}){
  commit(types.SET_SEARCH_HISTORY, clearSearch());
}

export const deleteSong = function({commit, state}, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1);

  if(currentIndex > pIndex || currentIndex == playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 1;
  commit(types.SET_PLAYING_STATE, playingState);
}

export const deleteSongList = function({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 存储播放历史
export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 修改收藏列表相关

export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}