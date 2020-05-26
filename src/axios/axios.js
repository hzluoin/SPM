// 为vue实例引入axios组件
const Axios = {}
Axios.install = function (Vue, options) {
  const axios = require('axios')
  Vue.prototype.$axios = axios
  Vue.$axios = axios
}
export default Axios
