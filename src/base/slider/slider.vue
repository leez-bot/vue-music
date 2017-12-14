<template>
  <div class="slider" ref='slider'>
    <div class="slider-group" ref='sliderGroup'>
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom.js'

  export default {
    name:'slider',
    // 由父组件传入，控制组件的options
    props:{
      // 是否可以循环轮播
      loop:{
        type:Boolean,
        default:true
      },
      // 是否自动轮播
      autoPlay:{
        typpe:Boolean,
        default:true
      },
      // 轮播间隔
      interval:{
        type: Number,
        default:4000
      }
    },
    data(){
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    // dom渲染完成后，进行bscroll渲染
    mounted(){
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      // 监听窗口尺寸变化，动态更新dom结构的宽度
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods:{
      // 获取滚动BS区域宽度
      _setSliderWidth(isResize){
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化滚动区域
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            this._play()
          }
        })

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      // 初始化小圆点
      _initDots(){
        this.dots = new Array(this.children.length)
      },
      _play(){
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable';
  .slider
    min-height:1px
    .slider-group
      position:relative
      overflow:hidden
      white-space: nowrap
      .slider-item
        float:left
        box-sizing:border-box
        overflow:hidden
        text-align:center
        a
          display:block
          width:100%
          overflow:hidden
          text-decoration:none
        img
          display:block
          width:100%
    .dots
      position:absolute
      right:0
      left:0
      bottom:12px
      text-align:center
      .dot
        display:inline-block
        margin: 0 4px
        width:8px
        height:8px
        border-radius:50%
        background: $color-text-l
        &.active
          width:20px
          border-radius:5px
          background:$color-text-ll
</style>