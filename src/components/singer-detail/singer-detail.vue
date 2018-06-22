<template>
  <transition name='slide'>
    <music-list :title='title' :bg-image='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getSingerDetail, getSongVkey} from 'api/singer'
  import {ERR_OK} from 'api/config'
  // 通过vuex语法糖取数据
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default {
    data(){
      return {
        // 歌曲列表
        songs:[]
      }
    },
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created(){
      this._getDetail();
    },
    methods:{
      _getDetail(){
        if(!this.singer.id) {
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      // 初始化歌曲信息列表
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          getSongVkey(musicData.songmid).then(res => {
            const vkey = res.data.items[0].vkey
            if(musicData.songid && musicData.albummid){
              ret.push(createSong(musicData, vkey))
            }
          })
        })
        return ret
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable';
  .singer-detail
    position:fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active,.slide-leave-active
    transition: all .3s

  .slide-enter,.slide-leave-to
    transform: translate3D(100%,0,0)
</style>