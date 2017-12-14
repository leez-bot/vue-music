<template>
  <div class="search">
    <div class="serach-box-wrapper">
      <search-box ref='searchBox' @query='onQueryChange'></search-box>
    </div>

    <div class="shortcut-wrapper" v-show='!query' ref='shorcutWrapper'>
      <scroll :refreshDelay="refreshDelay" class="shortcut" :data='shortcut' ref='shortcut'>
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for='item in hotKey' @click='addQeury(item.k)'>
                <span v-text='item.k'></span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click='showConfirm'>
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches='searchHistory' @select='addQeury' @delete='deleteOne'></search-list>
          </div>
        </div>
      </scroll>
    </div>



    <div class="search-result" v-show='query' ref='searchResult'>
      <suggest ref='suggest' :query='query' @listScroll='blurInput' @select='saveSearch'></suggest>
    </div>

    <confirm ref='confirm' title='确定要清空搜索历史吗?' @confirm='deleteAll' :confirmBtnText="'清空'"></confirm>

    <router-view></router-view>

  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import {mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin,searchMixin} from 'common/js/mixin'

  export default {
    mixins:[playlistMixin, searchMixin],
    created() {
      this._getHotKey();
    },
    data() {
      return {
        hotKey: []
      }
    },
    computed: {
      // 当热搜和历史发生变化时，计算属性shorcat高度发生变化，scroll组件重新计算高度
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    watch: {
      query(newQuery) {
        if(!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20)
        }
      }
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.shorcutWrapper.style.bottom = bottom;
        this.$refs.shortcut.refresh();

        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();
      },
      deleteOne(item) {
        this.deleteSearchHistory(item);
      },
      showConfirm(){
        this.$refs.confirm.show();
      },
      deleteAll() {
        this.clearSearchHistory();
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if(res.code === ERR_OK) {
            // 截取前10条数据
            this.hotKey = res.data.hotkey.slice(0,10);
          }
        })
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlignt-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>