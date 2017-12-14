/* 
* @Author: leeZ
* @Date:   2017-11-17 23:08:29
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-29 21:58:35
*/
// 如果多个组件均需要进行相同操作，则抽象出mixin直接调用
// 这里需要解决当有mini播放器时，本身的列表需要重新计算底部距离，将底部内容空出来
import {mapGetters,mapMutations,mapActions} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  // dom加载完成触发
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  // keepAlive触发
  activated() {
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    }
  },
  methods: {
    // 定义组件必须在钩子中调用这个函数，如果没有调用，则抛出异常
    handlePlaylist() {
      throw new Error('component must inplement handlePlaylist method')
    }
  }
}


// 引入播放模式
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// 播放界面和播放列表界面抽象出来的mixin
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'playing',
      'favoriteList'
    ])
  },
  methods: {
    // 切换播放状态
    changeMode () {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if(mode === playMode.random) {
        list = shuffle(this.sequenceList)
      }else {
        list = this.sequenceList;
      }
      // 这里应该先重置当前播放歌曲的index为列表中的index，再将列表更新。否则先更新列表，再重置index会导致切换状态错误
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    // 更改播放列表后，当前播放歌曲位置会发生改变。需要手动将当前播放歌曲索引改为新的播放列表索引
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index);
    },
    // 收藏及取消收藏
    getFavoriteIcon(song) {
      if(this._isFavorite(song)) {
        return 'icon-favorite'
      }else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if(this._isFavorite(song)) {
        this.deleteFavoriteList(song);
      }else {
        this.saveFavoriteList(song);
      }
    },
    _isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setFavoriteList: 'SET_FAVORITE_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

// 搜索相关mixin
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
 methods: {
    // 点击热门搜索自动填充搜索内容
    addQeury(query) {
      this.$refs.searchBox.setQuery(query);
    },
    // 父组件监听子组件派发的关键词改变事件，并将监听到的值再传递给搜索组件
    onQueryChange(query) {
      this.query = query;
      // console.log(query);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    // 保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
 } 
}