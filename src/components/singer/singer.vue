<template>
  <div class="singer" ref='singer'>
      <!-- 监听公共组件派发的点击事件 -->
      <listView :data='singers' @select='selectSinger' ref='list'></listView>
      <router-view></router-view>
  </div>
  
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listView/listView'
  // vuex语法糖:对mutaions进行的封装
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_NAME_LEN = 10

  export default {
    mixins: [playlistMixin],
    data(){
      return {
        singers:[]
      }
    },
    created(){
      this._getSingerList();
    },
    methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      // 监听到派发的事件
      selectSinger(singer){
        // 进入子路由
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 实现mutation数据提交
        this.setSinger(singer)
      },
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list);
            // console.log(this._normalizeSinger(this.singers));
          }
        })
      },
      // 歌手数据重组
      _normalizeSinger(list){
        let map = {
          hot:{
            title:HOT_NAME,
            items:[]
          }
        }
        list.forEach((item,index)=>{
          if(index < HOT_NAME_LEN){
            map.hot.items.push(new Singer({
              id:item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }
          const key = item.Findex
          if(!map[key]){
            map[key] = {
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
              id:item.Fsinger_mid,
              name: item.Fsinger_name
            }));
        })
        // 为了得到有序列表，需要处理map
        let hot = []
        let ret = []
        for(let key in map){
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if (val.title === HOT_NAME){
            hot.push(val)
          }
        }
        // 对字母数组进行排序
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret);
      },
      // 和mutation操作类型进行映射
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })

    },
    components: {
      ListView
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .singer
    position:fixed
    top:88px
    bottom:0
    width:100%
</style>