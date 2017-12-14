/* 
* @Author: leeZ
* @Date:   2017-11-24 21:56:23
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-29 22:00:32
*/

import storage from 'good-storage'
// 操作本地缓存相关操作
// 
//
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 插入数组通用方法
function insertArray(arr, val, compare, maxLen){
  const index = arr.findIndex(compare);
  // 搜索的词是最新的历史值
  if(index === 0) {
    return;
  }
  if(index > 0) {
    arr.splice(index, 1);
  }
  // 将值插入到数组最前面
  arr.unshift(val);

  // 如果长度大于最大值，则将最后一个值删除
  if(maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 删除数组元素通用方法
// 
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if(index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  // 获取本地存储的搜索历史，如果没有，则返回一个空数组
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches;
}

// 读取本地搜索历史缓存
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function deleteSearch(query) {
  // 获取本地存储的搜索历史，如果没有，则返回一个空数组
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return []
}

// 存储播放历史相关

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}


// 收藏列表相关
// 
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  },FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])

  deleteFromArray(songs, (item) => {
    return song.id === item.id;
  })
  storage.set(FAVORITE_KEY, songs);
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}