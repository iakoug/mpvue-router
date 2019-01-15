/**
 * @description router interceptor
 * triggerAll 触发于所有路由
 * triggerMatch 触发匹配的路由
 * config 当前路由配置
 * to 跳转路由
 */

import Vue from 'vue'

import router from './lib/interceptor'

const interceptorConfig = {
  triggerAll(config, to) {
  },
  triggerMatch: {
    // '/home/pages/categoryList': [
    //   (config, to) => {
    //     if (flag) {
    //       console.log(1)
    //       to()
    //     }
    //   },
    //   (config, to) => {
    //     if (flag) {
    //       console.log(11)
    //       to()
    //     }
    //   }
    // ]
  }
}

Vue.use(router, interceptorConfig)
