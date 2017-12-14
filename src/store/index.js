/* 
* @Author: anchen
* @Date:   2017-09-25 22:26:58
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-25 23:06:18
*/

// vuex入口
// 

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 每次通过mutation修改时通过日志打印
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex)

// npm run dev 命令进行启动时，dubug为true
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    //严格模式，如果数据不是通过mutation进行修改会警告
    strict: debug,
    plugins: debug ? [createLogger()] : []
})