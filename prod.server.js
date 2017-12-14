/* 
* @Author: leeZ
* @Date:   2017-11-29 22:40:19
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-29 22:50:44
*/

// 模拟本地服务器
// 
var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()

// 自定义服务器端请求(一些数据接口做了数据保护，对发出请求的请求头referer做了规定，故在这里改写对应接口的referer,将其伪装成官网访问)
var apiRoutes = express.Router()
// 获取歌单列表页面数据
apiRoutes.get('/getDiscList',function(req,res){
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

// 获取歌单详情数据
apiRoutes.get('/getSongList',function(req,res){
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url,{
    headers:{
      authority:"c.y.qq.com",
      referer:'https://y.qq.com/n/yqq/playlist/'+req.disstid+'.html',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    res.json(response.data)
  }).catch((e)=>{
    console.log(e)
  })
})

// 获取歌词数据
apiRoutes.get('/lyric',function(req,res){
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url,{
    headers:{
      // 将请求头伪装成官网的地址，绕过安全校验，否则获取不到数据
      referer:'https://c.y.qq.com',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response)=>{
    // 如果接收到的数据不是json数据，进行转化
    var ret = response.data;
    if(typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var mathes = ret.match(reg)
      if(mathes) {
        ret = JSON.parse(mathes[1])
      }
    }
    res.json(ret)
  }).catch((e)=>{
    console.log(e)
  })
})

app.use('/api', apiRoutes);

// 引用静态资源
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port
module.exports = app.listen(port, function(err) {
  if(err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

