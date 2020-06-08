const Type = function (o) {
  const s = Object.prototype.toString.call(o)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

Type.install = function (Vue, option) {
  ['Null', 'Undefined', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'RegExp'].forEach(function (t) {
    Type['is' + t] = function (o) {
      return Type(o) === t.toLowerCase()
    }
  })
  Vue.Type = Type
  Vue.prototype.$type = Type
}

export default Type
