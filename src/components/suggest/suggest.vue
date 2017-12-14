<template>
  <scroll class="suggest" :data='result' :pullup='pullup' :beforeScroll='beforeScroll' @scrollToEnd='searchMore' ref='suggest' @beforeScroll='listScroll'>
    <ul class="suggest-list">
      <li @click='selectItem(item)' class="suggest-item" v-for='item in result'>
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show='hasMore' title=''></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title='抱歉，暂无搜索结果'></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import NoResult from 'base/no-result/no-result'
  import {mapMutations, mapActions} from 'vuex'


  const TYPE_SINGER = 'siner'
  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      // 搜索结果是否显示歌手
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        // 是否开启上拉加载更多
        pullup: true,
        // 滚动前是否让输入框失去焦点
        beforeScroll: true,
        result: [],
        hasMore: true
      }
    },
    methods: {
      getIconCls(item) {
        if(item.type === TYPE_SINGER) {
          return 'icon-mine'
        }else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername
        }else {
          return `${item.name} - ${item.singer}`
        }
      },
      refresh(){
        this.$refs.suggest.refresh();
      },
      // 加载更多
      searchMore() {
        if(!this.hasMore) {
          return;
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if(res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data));
            this._checkMore(res.data);
          }
        })
      },
      // 选中歌手歌者歌曲 
      selectItem(item) {
        if(item.type === TYPE_SINGER) {
          // 构建歌手对象
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          // 将歌手的信息进行构造之后，调用mapmutations的方法，进行当前歌手信息设置
          this.$router.push({
            path: `search/${singer.id}`
          })
          this.setSinger(singer);
        }else {
          this.insertSong(item)
        }

        // 派发选择事件，存储搜索历史
        this.$emit('select');
      },
      listScroll() {
        this.$emit('listScroll');
      },
      // 服务端搜索数据
      _search() {
        this.hasMore = true;
        this.page = 1;
        this.$refs.suggest.scrollTo(0, 0);
        // 每当搜索关键词发生变化时，都需要重新进行搜索。这时都应该把scrll组件重新滚动到顶部，并把搜索页码重置为1；
        search(this.query, this.page, this.showSinger,perpage).then((res) => {
          if(res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            // console.log(this.result)
            this._checkMore(res.data);
          }
        })
      },
      _checkMore(data) {
        const song = data.song;
        if(!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      _genResult(data) {
        let ret = []
        if(data.zhida && data.zhida.singerid) {
          // 将zhida这个对象添加到ret里面，并给它再添加一个名为type的属性
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if(data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if(musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        'setSinger' : 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this._search();
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>