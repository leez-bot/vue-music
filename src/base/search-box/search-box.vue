<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref='query' class="box" v-model='query' :placeholder='placeholder' />
    <i class="icon-dismiss" v-show='query' @click='clear'></i>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入截流函数，只有当连续输入停止时才会进行请求
  import {debounce} from 'common/js/util'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      // 在子组件定义方法，由父组件调用
      setQuery(query) {
        this.query = query
      },
      blur() {
        this.$refs.query.blur()
      }
    },
    created() {
      // 监听输入的关键字，交将这个关键字放到方法里面暴露给父组件
      this.$watch('query', debounce((newQeury) => {
        this.$emit('query', newQeury)
      }, 200))
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  
  @import "~common/stylus/variable";
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlignt-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlignt-background
      color: $color-text
      font-size: $font-size-medium
      border: 2px solid rgba(255,255,255,0.1);
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>