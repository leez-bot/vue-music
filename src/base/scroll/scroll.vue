<template>
  <div ref='wrapper'>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType:{
        type: Number,
        default:1
      },
      click:{
        type:Boolean,
        default:true
      },
      data:{
        type:Array,
        default:null
      },
      // 是否监听滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 是否实现上拉刷新
      pullup: {
        type: Boolean,
        default: false
      },
      // 开始滚动时事件，搜索框搜索后，滚动时收起手机键盘
      beforeScroll: {
        type: Boolean,
        default: false
      },
      // 刷新延迟（当滚动列表高度的改变有动画执行时，需要在动画执行完成之后中再重新计算高度，否则计算的高度不正确）
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted(){
      setTimeout(()=>{
        this._initScroll()
      }, 20)
    },
    methods:{
      _initScroll(){
        if(!this.$refs.wrapper){
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType:this.probeType,
          click:this.click
        })

        if(this.listenScroll){
          let me = this
          this.scroll.on('scroll', (pos)=>{
            // pos是一个位置对象，有x和y属性标记当前滚动位置
            // 监听滚动事件并派发事件
            me.$emit('scroll', pos)
          })
        }

        // 如果开启了上拉加载功能，则监听scroll组件的滚动结束事件
        if(this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // 如果滚动结束时，滚动的距离小于等于最大滚动值时，则向外派发事件
            if(this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if(this.beforeScroll) {
          this.scroll.on('beforeScrollStart',() => {
            this.$emit('beforeScroll')
          })
        }
        
      },
      enable(){
        thiss.scroll && this.scroll.enable();
      },
      disable(){
        this.scroll && this.scroll.disable();
      },
      refresh(){
        this.scroll && this.scroll.refresh();
      },
      // 方法扩展，滚动至某一位置
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement(){
        // 这里把scrollToElement写成了scrollTo，导致点击/滑动滚动事件错误
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch:{
      data(){
        setTimeout(()=>{
          this.refresh();
        }, this.refreshDelay)
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  
</style>