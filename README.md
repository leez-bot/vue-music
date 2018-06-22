# vue-music

> 基于vue2.0制作的音乐播放器

## Build Setup

``` bash
# install dependencies// 安装依赖
npm install

# serve with hot reload at localhost:8080 // 运行项目
npm run dev

# build for production with minification // 打包项目
npm run build

## 线上预览地址
  http://tudoumusic.applinzi.com

## 存在需要解决的问题
- 项目打包上线后，无法获取到首页推荐歌单、推荐歌单详情、歌词数据
- QQ音乐现在需要加入vkey参数获取播放源，但是自己通过接口去拿到vkey并拼接上后，并不能正常播放，如果写死一个vkey，有效期只有一天


# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
