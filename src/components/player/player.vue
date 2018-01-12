<template>
  <div class="player" v-show='playlist.length>0'>
    <transition name='normal' @enter='enter' @after-enter='afterEnter' @leave='leave' @after-leave='afterLeave'>
      <div class="normal-player" v-show='fullScreen'>
        <div class="background">
          <img width='100%' height="100%" :src='currentSong.image'>
        </div>
        <!-- 顶部标题/缩小操作 -->
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html='currentSong.name'></h1>
          <h2 class="subtitle" v-html='currentSong.singer'></h2>
        </div>
        <!-- 播放器中心页面 -->
        <div class="middle"
          @touchstart.prevent='middleTouchStart'
          @touchmove.prevent = 'middleTouchMove'
          @touchend.prevent = 'middleTouchEnd'
        >
          <!-- 唱片旋转页面 -->
          <div class="middle-l" ref='middleL'>
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd" :class='cdClass'>
                <img class="image" :src='currentSong.image'>
              </div>
              <!-- 当前播放歌词 -->
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric" v-text='playingLyric'></div>
              </div>
            </div>
          </div>
          <!-- 歌词展示页面 -->
          <scroll class="middle-r" ref='lyricList' :data='currentLyric && currentLyric.lines'>
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p ref='lyricLine'
                :class="{'current': currentLineNum === index}"
                class="text"
                v-for='(line,index) in currentLyric.lines'
                v-text='line.txt'></p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 操作区域 -->
        <div class="bottom">
          <!-- CD/歌词页面切换样式 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow == 'CD'}"></span>
            <span class="dot" :class="{'active': currentShow == 'lyric'}"></span>
          </div>
          <!-- 播放进度操作 -->
          <div class="progress-wrapper">
            <span class="time time-l" v-text='forfat(currentTime)'></span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent='percent' @percentChange='onProgressBarChange'></progress-bar>
            </div>
            <span class="time time-r" v-text='forfat(currentSong.duration)'></span>
          </div>

          <!-- 按钮操作 -->
          <div class="operators">
            <div class="icon i-left" @click='changeMode'>
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class='disableClass'>
              <i class="icon-prev" @click='prev'></i>
            </div>
            <div class="icon i-center" :class='disableClass'>
              <i :class="playIcon" @click='togglePlaying'></i>
            </div>
            <div class="icon i-right" :class='disableClass'>
              <i class="icon-next" @click='next'></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class='getFavoriteIcon(currentSong)' @click='toggleFavorite(currentSong)'></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name='mini'>
      <div class="mini-player" v-show='!fullScreen' @click='open'>
        <div class="icon">
          <img width="40" height="40" :src='currentSong.image' :class='cdClass'>
        </div>
        <div class="text">
          <h2 class="name" v-html='currentSong.name'></h2>
          <p class="desc" v-html='currentSong.singer'></p>
        </div>
        <div class="control">
          <progress-circle :radius='radius' :percent='percent'>
            <!-- 以下dom结构会被插入到组件的slot插槽 -->
            <i :class='miniIcon' @click.stop='togglePlaying' class='icon-mini'></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop='showPlaylist'>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <playlist ref='playlist'></playlist>

    <!-- 播放器功能 -->
    <audio :src='currentSong.url' ref='audio' @play='ready' @error='error' @timeupdate='updateTime' @ended='end'></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {shuffle} from 'common/js/util'
  // 引入歌词处理插件
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  // 引入播放模式
  import {playMode} from 'common/js/config'
  // 引入外部插件，以JS语法写CSS3动画
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import Playlist from 'components/playlist/playlist'
  import {playerMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    mixins:[playerMixin],
    data() {
      return {
        songReady: false, //标识当前歌曲是否已经加载完全，用于控制加载完成后才能进行的操作，防止出现过快切换歌曲导致错误
        // 当前歌曲时间相关
        currentTime: 0,
        radius: 32,
        // 当前歌曲歌词
        currentLyric: null,
        // 当前歌词所处行数
        currentLineNum: 0,
        // 当前中心展示内容：CD/歌词
        currentShow: 'CD',
        playingLyric:'' // 当前歌曲进度对应歌词
      }
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdClass() {
        return this.playing ? 'play' : 'play pause'
      },
      disableClass() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen',// 全屏状态
        'playing',// 播放状态
        'currentIndex', // 当前播放歌曲索引
      ])
    },
    created() {
      // 屏幕左右滑动切换CD/歌词页面
      this.touch = {};
      console.log(this.currentSong);
    },
    methods: {
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      },
      // 自定义动画
      enter(el,done) {
        const {x,y,scale} = this._getPosAndScale();
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      afterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave(el,done) {
        this.$refs.cdWrapper.style.transition = 'all .4s';
        const {x,y,scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      // 播放停止音乐
      togglePlaying() {
        if(!this.songReady) {
          return;
        }
        this.setPlayingState(!this.playing)
        // 如果当前有歌词滚动，切换状态时歌词滚动状态跟着切换
        if(this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      // 歌曲播放完成后自动切换
      end() {
        if(this.mode === playMode.loop) {
          this.loop();
        }else {
          this.next();
        }
      },
      // 单曲循环
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        // 循环播放时，当歌曲进入下一次播放，将当前歌词滚动到最顶部
        if(this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      // 切换播放歌曲
      prev() {
        if(!this.songReady) {
          return;
        }
        if(this.playlist.length === 1) {
          this.loop()
          return;
        }else {
          let index = this.currentIndex - 1;
          if(index === -1) {
            index = this.playlist.length-1;
          }
          this.setCurrentIndex(index);
          // 如果切歌时当前处于暂停状态，将把状态改为播放
          if(!this.playing){
            this.togglePlaying();
          }
          this.songReady = false;
        }
        
      },
      next() {
        if(!this.songReady) {
          return;
        }
        if(this.playlist.length === 1) {
          // 如果播放列表只有一首歌，则点下一曲的时候执行循环播放操作
          this.loop()
          return;
        }else {
          let index = this.currentIndex + 1;
          if(index === this.playlist.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if(!this.playing){
            this.togglePlaying();
          }
          this.songReady = false;
        }
        
      },
      // 播放器正常播放/无播放地址错误回调
      ready() {
        this.songReady = true;
        this.savePlayHistory(this.currentSong)
      },
      error() {
        // 当歌曲不可用时或者断网时（歌曲加载失败）,操作将不可用，这时手动将歌曲状态置为true
        this.songReady = true;
      },
      // 监听音乐播放时派发的当前时间进度
      updateTime(e) {
        // e对应当前播放器对象，其对应一个currentTime属性表示当前播放进度
        // 返回的时间是时间戳的形式(5.263544545)，需要进行转化为时：分：秒
        this.currentTime = e.target.currentTime;
      },
      //格式化时间
      forfat(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`;
      },
      // 监听到子组件派发的进度条改变事件
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent;

        this.$refs.audio.currentTime = currentTime;
        if(!this.playing){
          this.togglePlaying();
        }
        // 改变歌曲播放进度时，调用seek方法，切换到对应播放时间对应的歌词
        if(this.currentLyric) {
          // console.log(currentTime)
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 处理歌词
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          // 歌曲切换太快时，因为歌词是异步获取，会导致播放时和歌曲歌词无法同步。因此在获取歌词时如果当前歌词不为获取的歌词，则返回
          if(this.currentSong.lyric != lyric) {
            return;
          }
          this.currentLyric = new Lyric(lyric,this.handleLyric);
          // 获取到歌词后，如果当前播放状态，则滚动歌词
          if(this.playing) {
            this.currentLyric.play();
          }
          // console.log(this.currentLyric)
        })
      },
      // 歌词进行到每一句时的回调
      handleLyric(currentLine) {
        // handleLyric回调返回一个对象，lineNum属性为当前歌词行数，txt对象为当前行歌词
        this.currentLineNum = currentLine.lineNum;
        this.playingLyric = currentLine.txt;
        // 当当前歌词行数小于5时，组件不滚动。大于5行时，组件滚动到当前歌词行数减去5的地方，保证高亮在中间显示
        if (currentLine.lineNum > 5) {
          let lineEl = this.$refs.lyricLine[currentLine.lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      },
      // 屏幕左右滑动切换CD/歌词界面
      middleTouchStart(e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if(!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        // 监听纵轴的滑动距离，如果大于横轴，则不进行操作
        if(Math.abs(deltaY) > Math.abs(deltaX)){
          return;
        }
        const left = this.currentShow === 'CD' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      middleTouchEnd(e) {
        let offsetWidth
        let opacity
        if(this.currentShow === 'CD') {
          // 从左往右滑动
          if(this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0;
            this.currentShow = 'lyric'
          }else {
            offsetWidth = 0
            opacity = 1
          }
        }else {
          // 从右往左滑动
          if(this.touch.percent < 0.9) {
            offsetWidth = 0;
            this.currentShow = 'CD'
            opacity = 1;
          }else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        // 切换延迟时间
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      },
      showPlaylist() {
        this.$refs.playlist.show();
      },
      // 时间补零操作(当时间为一位数时补为两位数)
      _pad(num,n = 2) {
        let len = num.toString().length;
        while(len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      //获取动画开始时的位置坐标及缩放比例
      _getPosAndScale() {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth/width;
        const x = -(window.innerWidth/2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width/2 - paddingBottom;
        return {
          x,y,scale
        }
      },
      // mutation代理操作
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(newSong,oldSong) {
        // 当删除列表中最后一首歌曲时，没有下一首歌曲，不用再切换
        if(!newSong.id) {
          return;
        }
        // 歌曲暂停后，改变播放模式，会触发当前歌曲在列表中的位置变化，触发播放事件。加入新的判断后，如果id不变，则表明当前歌曲并未发生切换，则不作播放处理
        if(!newSong.id) {
          return;
        }
        if(newSong.id === oldSong.id){
          return;
        }
        // 当歌词滚动时会生成一个计时器，切换到下一首歌曲时，如果当前已经有歌词了，先停止上首歌的计时器
        if(this.currentLyric) {
          this.currentLyric.stop();
          this.currentTime = 0;
          this.playingLyric = '';
          this.currentLineNum = 0;
        }
        clearTimeout(this.timer)
        // 设置计时器是防止手机端前后台切换导致的BUG，同时解决切换太快导致的播放紊乱的问题
        this.timer = setTimeout(() => {
          this.$refs.audio.play();
          // 处理歌词
          this.getLyric();
        },1000)
      },
      playing(newPlaying) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause();
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,// 歌词滚动
      Playlist
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlignt-background
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>