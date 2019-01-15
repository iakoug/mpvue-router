### mpvue-router
_为了方便个人使用 这里是一波在 `mpvue-router-patch` 和 `mpvue-router-patch-interceptor` 基础上简单修改糅合在一起_
  - 更改 `mpvue-router-patch-interceptor` 调用方式
  - 页面堆栈溢出处理
  - 其他细节调整等
> https://blog.csdn.net/mate_ge/article/details/81197348
> https://github.com/F-loat/mpvue-router-patch

### use

```js
  /**
   * @description router interceptor
   * triggerAll 触发于所有路由
   * triggerMatch 触发匹配的路由
   * config 当前路由配置
   * to 跳转路由
   */

  import Vue from 'mpvue'

  import router from './src'
  import interceptor from './lib/interceptor'

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

  // 不使用拦截器
  // Vue.use(router)
  // use interceptor
  Vue.use(router, interceptor, interceptorConfig)
```