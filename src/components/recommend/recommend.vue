<template>
  <div class="recommend" ref='recommend'>
    <Scroll class="recommend-content" :data='discList' ref='scroll'>
      <div>
        <div class="slider-wrapper">
          <Slider v-if='recommends.length'>
            <div v-for='item in recommends'>
              <a :href='item.linkUrl'>
                <!-- 当better-scroll和fastclick发生冲突阻止点击事件时，给需要点击的区域加上‘needsclick'的class -->
                <img @load='loadImage' :src="item.picUrl" class="needsclick">
              </a>
            </div>
          </Slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
              <li @click='selectItem(item)' v-for='item in discList' class="item">
                  <div class="icon">
                      <img v-lazy="item.imgurl" width="60" height="60">
                  </div>
                  <div class="text">
                      <h2 class="name" v-html='item.creator.name'></h2>
                      <p class="desc" v-html='item.dissname'></p>
                  </div>
              </li>
          </ul>
        </div>
      </div><!-- 滚动区域 -->
      <div class="loadinig-container" v-show='!discList.length'>
        <loading></loading> 
      </div>
    </Scroll>

    <!-- 歌单详情子路由 -->
    <router-view></router-view>

  </div>
  
</template>

<script type="text/ecmascript-6">
  import loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll';
  import Slider from 'base/slider/slider';
  import {getRecommend,getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config';
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data(){
      return{
        recommends:[],// 推荐列表
        discList:[] // 歌单列表
      }
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item);
      },
      _getRecommend() {
        getRecommend().then((res) => {
          // 抓取轮播图信息
          // console.log(res);
          if(res.code === ERR_OK){
            // console.log(res.data.slider);
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res) => {
          // console.log(res);
          if(res.code === ERR_OK){
            this.discList = res.data.list;
            // console.log(res.data.list);
          }
        })
      },
      loadImage(){
        if(!this.checkLoaded){
          this.$refs.scroll.refresh();
          this.checkLoaded = true
        }
        
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components:{
      Slider, Scroll, loading
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";
  .recommend
    position:fixed
    width:100%
    top:88px
    bottom:0
    .recommend-content
      height:100%
      overflow:hidden
      .slider-wrapper
        position:relative
        width:100%
        overflow:hidden
      .recommend-list
        .list-title
          height:65px
          line-height:65px
          text-align:center
          font-size:$font-size-medium
          color:$color-theme
        .item
          display:flex
          box-sizing:border-box
          align-items:center
          padding:0 20px 20px 20px
          .icon
            flex:0 0 60px
            width:60px
            padding-right:20px
          .text
            display:flex
            flex-direction:column
            justify-content:center
            flex:1
            line-height:20px
            overflow:hidden
            font-size:$font-size-medium
            .name
              margin-bottom:10px
              color:$color-text
            .desc
              color:$color-text-d
      .loading-container
        position:absolute
        width:100%
        top:50%
        transform:translateY(-50%)
</style>