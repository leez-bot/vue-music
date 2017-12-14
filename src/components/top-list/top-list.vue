<template>
  <transition name="slide">
    <music-list :rank='rank' :title='title' :bgImage='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if(this.songs.length) {
          return this.songs[0].image;
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs:[],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        // 如果在子路由刷新页面，获取不到当前歌单传递的dissid，因此直接跳回父路由
        if(!this.topList.id) {
          this.$router.push('/rank');
          return;
        }
        getMusicList(this.topList.id).then((res) => {
          // console.log(res);
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.songlist);

            console.log(this.songs);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          const musicData = item.data;
          if(musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        }) 
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>