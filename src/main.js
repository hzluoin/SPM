import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
// axios
import './axios'
// 自定义插件
import './plugs/index'
// 自定义样式
import './assets/css/index.css'
// 自定义组件
import BaseLoading from '@comp/BaseLoading'
// vant组件库
import { Icon, Collapse, CollapseItem, NavBar, Row, Col, Form, Switch, Cell, CellGroup, Field, Area, Popup, Picker, DatetimePicker, Button, RadioGroup, Radio, Overlay, Loading, Toast } from 'vant'
Vue.use(Icon).use(Collapse).use(CollapseItem).use(NavBar).use(Row).use(Col).use(Form).use(Switch).use(Cell).use(CellGroup).use(Field).use(Area).use(Popup).use(Picker).use(DatetimePicker).use(Button).use(RadioGroup).use(Radio).use(Overlay).use(Loading).use(Toast)

Vue.config.productionTip = false

Vue.component('base-loading', BaseLoading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
