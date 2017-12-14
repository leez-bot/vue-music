<template>
  <div class="progress-circle">
    <!-- viewBox表示图画开始位置及坐标，从左上角0，0开始，拉到宽100%，高100% -->
    <svg :width='radius' :height='radius' viewBox="0 0 100 100" version='1.1' xmlns="http://www.w3.org/2000/svg">
      <!-- r为半径，cx/cy分别为圆心 -->
      <circle class='progress-background' r="50" cx="50" cy="50" fill="transparent"/>
      <!-- stroke-dasharray描边的周长 -->
      <circle class='progress-bar' r='50' cx='50' cy='50' fill='transparent' :stroke-dasharray='dasharray' :stroke-dashoffset='dashOffset'/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        typpe: Number,
        default: 0
      }
    },
    data() {
      return {
        // 计算周长
        dasharray: Math.PI * 100
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dasharray
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        /*stroke: $color-theme-d*/
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>