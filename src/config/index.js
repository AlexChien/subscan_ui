// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {
  waitForData: true,
  transitionOnLoad: true,
  mode: 'history',
  base: '/',
  scrollBehavior (to) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
}

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  maxContentLength: 2000,
  headers: {},
  timeout: 20000, // 超时时间
  retry: 4, // 超时再次请求次数
  retryDelay: 1000, // 超时后再次发起请求的时间间隔
  withCredentials: true
}

// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== 'production'
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  baseURL: '/api',
  isTestEnv: process.env.NODE_ENV === 'production' ? false : false,
  testEnvBaseURLPrefix: '/test',
  apiKey: '30f098f2217b1e3be'
}

// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
  sep: '/'
}

// 还有一些业务相关的配置
// ...

// pusher 配置
export const PUSHER_CONFIG = {
  wsHost: '52.79.46.240',
  wsPort: '8080',
  APP_KEY: '***'
}