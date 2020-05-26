import router from './router'
import store from '../store'
import { Toast } from 'vant'

router.beforeEach((to, from, next) => {
  store.getters.hasLimit(to.meta)
  const routLimit = (to.meta || {})['limit']
  if (!routLimit) {
    next()
  } else if (store.getters.hasLimit(routLimit)) {
    next()
  } else {
    Toast.fail('请先登录!')
    router.push({ name: 'Login' })
  }
})
