/* 
* @Author: anchen
* @Date:   2017-08-22 23:39:40
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-29 22:59:28
*/

import Vue from 'vue'
import Router from 'vue-router'

// import Rank from 'components/rank/rank.vue'
// import Recommend from 'components/recommend/recommend.vue'
// import Singer from 'components/singer/singer.vue'
// import Search from 'components/search/search.vue'
// import UserCenter from 'components/user-center/user-center'

// // 歌手页子路由：歌手详情页
// import SingerDetail from 'components/singer-detail/singer-detail'

// // 歌单页子路由：歌单详情页
// import Disc from 'components/disc/disc'

// // 排行榜子路由：排行榜详情
// import TopList from 'components/top-list/top-list'

// 路由实行异步加载，减少打包JS体积
const Recommend = (resolve) => {
    import ('components/recommend/recommend').then((module) => {
        resolve(module)
    })
}
const Singer = (resolve) => {
    import ('components/singer/singer').then((module) => {
        resolve(module)
    })
}
const Rank = (resolve) => {
    import ('components/rank/rank').then((module) => {
        resolve(module)
    })
}
const Search = (resolve) => {
    import ('components/search/search').then((module) => {
        resolve(module)
    })
}
const UserCenter = (resolve) => {
    import ('components/user-center/user-center').then((module) => {
        resolve(module)
    })
}
const SingerDetail = (resolve) => {
    import ('components/singer-detail/singer-detail').then((module) => {
        resolve(module)
    })
}
const Disc = (resolve) => {
    import ('components/disc/disc').then((module) => {
        resolve(module)
    })
}
const TopList = (resolve) => {
    import ('components/top-list/top-list').then((module) => {
        resolve(module)
    })
}

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'/recommend'
        },
        {
            path: '/rank',
            component: Rank,
            children: [
                {
                    path: ':id',
                    component: TopList
                }
            ]
        },
        {
            path: '/recommend',
            component: Recommend,
            children: [
                {
                    path: ":id",
                    component: Disc
                }
            ]
        },
        {
            path: '/singer',
            component: Singer,
            children: [
                {
                    // 表明路由跳转是通过ID跳转
                    path:':id',
                    component: SingerDetail
                }
                
            ]
        },
        {
            path: '/search',
            component: Search,
            children: [
                {
                    // 表明路由跳转是通过ID跳转
                    path:':id',
                    component: SingerDetail
                }
                
            ]
        },
        {
            path: '/user',
            component: UserCenter
        }
    ]
})