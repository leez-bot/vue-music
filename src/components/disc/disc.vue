<template>
  <transition name="slide">
    <music-list :title='title' :bgImage='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs:[]
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        // 如果在子路由刷新页面，获取不到当前歌单传递的dissid，因此直接跳回父路由
        if(!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        }
        getSongList(this.disc.dissid).then((res) => {
          // console.log(res);
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((musicData) => {
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