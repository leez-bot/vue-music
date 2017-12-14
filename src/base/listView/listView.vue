<template>
  <scroll @scroll = 'scroll'
          :listen-scroll = 'listenScroll'
          :probeType='probeType'
          :data='data'
          class='listView'
          ref='listview'>
    <ul>
      <li v-for='group in data' class="list-group" ref='listGroup'>
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for='item in group.items' class="list-group-item">
            <img class="avatar" v-lazy='item.avatar'/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 右侧快速列表 -->
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent='onShortcutTouchMove' @touchend.stop>
      <ul>
        <li v-for='(item,index) in shortcutList' class="item" :data-index='index' :class="{'current':currentIndex == index}">
          {{item}}
        </li>
      </ul>
    </div>

    <!-- 固定顶部区块 -->
    <div class="list-fixed" v-show='fixedTitle' ref='fixed'>
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>

    <div class="loading-container" v-show='!data.length'>
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'
// 快速导航栏元素高度
const ANCHOR_HEIGHT = 18
//固定标题高度
const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed:{
      shortcutList(){
        return this.data.map((group)=>{
          return group.title.substr(0,1)
        })
      },
      fixedTitle(){
        if(this.scrollY > 0){
          return ''
        }
        // console.log(this.currentIndex)
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data(){
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1 //固定标题区块向 上偏移
      }
    },
    created(){
      // 存储快速导航栏手指滑动的偏移值
      this.touch = {}
      this.listenScroll = true
      this.listHeight = [] //列表高度数组
      this.probeType = 3
    },
    // 这里把methods写成method导致事件无效
    methods:{
      refresh() {
        this.$refs.listview.refresh();
      },
      // 派发点击事件，进入歌手详情页
      selectItem(item){
        this.$emit('select', item)
      },
      // 点击右侧菜单跳转到歌手组
      onShortcutTouchStart(e){
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0] // 刚开始触摸时手指位置
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      // 滑动右侧菜单左侧联动
      onShortcutTouchMove(e){
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // 计算出手指滑动的Y轴元素距离并向下取整
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      //实时计算滚动高度
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i=0;i<list.length;i++){
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
        // console.log(this.listHeight)
      },
      _scrollTo(index){
        if(!index && index !== 0){
          return
        }
        if(index < 0) {
          index = 0
        }else  if(index > this.listHeight.length - 2){
        // 处理划到顶部/底部继续滑的边界问题
          index = this.listHeight.length - 2
        }
        // console.log(this.listHeight[index])
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    watch: {
      data(){
        setTimeout(()=>{
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY){
        const listHeight = this.listHeight
        // 滚动到顶部，newY>0
        if(newY > 0){
          this.currentIndex = 0
          return
        }
        //中间区域滚动
        for(let i=0;i<listHeight.length-1;i++){
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          if(-newY >= height1 && -newY < height2){
            this.currentIndex = i
            this.diff = height2 + newY
            // console.log(this.currentIndex)
            return
          }
        }
        // 滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal){
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop){
          return
        }
        this.fixedTop = fixedTop
        // 这里把translate3D写成tranlate3D导致滚动动画失效
        this.$refs.fixed.style.transform = `translate3D(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll, Loading
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable';
  
  .listView
    position:relative
    width:100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom:30px
      .list-group-title
        background:#616161
        height:30px
        line-height:30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display:flex
        align-item: center
        padding: 20px 0 0 30px
        .avatar
          width:50px
          height:50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
          line-height: 50px
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top:5%
      transfrom: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size:$font-size-small
        list-style: none
        &.current
          color: $color-theme
    .list-fixed
      position:absolute
      top: -2px;
      left: 0
      width: 100%
      background:#616161
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transfrom translateY(-50%)
</style>