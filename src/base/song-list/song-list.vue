<!-- 信息列表组件 -->
<template>
  <div class="song-list">
    <ul>
      <li @click='seletItem(song,index)' v-for='(song,index) in songs' class="item">
        <div class="ranks" v-show='rank'>
          <span :class='getRankCls(index)' v-text='getRankText(index)'></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <div class="desc">{{getDesc(song)}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
        songs: {
            type: Array,
            default: []
        },
        rank: {
          type: Boolean,
          defaul: false
        }
    },
    methods:{
      getDesc(song) {
        return `${song.singer}-${song.album}`
      },
      seletItem(song,index) {
        this.$emit('select', song, index);
      },
      getRankCls(index) {
        if(index <= 2) {
          return `icon icon${index}`
        }else {
          return `text`
        }
      },
      getRankText(index) {
        if(index > 2) {
          return index + 1;
        }
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .ranks
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-img('first')
          &.icon1
            bg-img('second')
          &.icon2
            bg-img('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>