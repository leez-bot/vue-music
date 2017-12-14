<template>
  <div class="progress-bar" ref='progressBar' @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref='progress'></div>
      <div class="progress-btn-wrapper"
        @touchstart.prevent='progressTouchStart'
        @touchmove.prevent='progressTouchMove'
        @touchend.prevent='progressTouchEnd'
      >
        <div class="progress-btn" ref='progressBtn'></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  // 按钮直径
  const progressBtnWidth = 16;
  const transform = prefixStyle('transform');
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      // 用于在不同的回调里面共享数据时直接将数据挂载到该对象上
      this.touch = {};
    },
    methods: {
      progressTouchStart(e) {
        //初始化完成
        this.touch.initiated = true;
        // 开始移动时的X轴位置及已经播放的进度条长度
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if(!this.touch.initiated){
          return;
        }
        // 手指移动时可以获取在移动型开始时定义的值,计算出移动的距离
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(Math.max(0,this.touch.left + deltaX),this.$refs.progressBar.clientWidth);
        this._offset(offsetWidth);
      },
      progressTouchEnd(e) {
        this.touch.initiated = false;
        this._triggerPercent();
      },
      // 点击选择进度事件
      progressClick(e) {
        // 获取进度按钮在屏幕上的位置
        const rect = this.$refs.progressBar.getBoundingClientRect();
        // e.pageX代表点击位置距离屏幕左边的距离
        const offsetWidth = e.pageX - rect.left;
        this._offset(offsetWidth);
        // 点击按钮本身会跳转到开始位置BUG(e.offsetX获取有误)
        // this._offset(e.offsetX);
        this._triggerPercent();
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      // 拖动改变百分比，向外部组件派发事件
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChange',percent)
      }
    },
    watch: {
      percent(newPercent) {
        // percent为接收外部组件传入的进度百分比
        if(newPercent >= 0 && !this.touch.initiated){
          //获取进度条总长度
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
          // 偏移长度
          const offsetWidth = newPercent * barWidth;
          this._offset(offsetWidth);
        }
      },
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>