const ByteArray = {}
ByteArray.install = function (Vue, option) {
  const getByteArray = function (str) {
    let i = str.length
    let n = 0
    let ba = []
    for (let j = 0; j < i;) {
      let c = str.codePointAt(j)
      if (c < 128) {
        ba[n++] = c
        j++
      } else if ((c > 127) && (c < 2048)) {
        ba[n++] = (c >> 6) | 192
        ba[n++] = (c & 63) | 128
        j++
      } else if ((c > 2047) && (c < 65536)) {
        ba[n++] = (c >> 12) | 224
        ba[n++] = ((c >> 6) & 63) | 128
        ba[n++] = (c & 63) | 128
        j++
      } else {
        ba[n++] = (c >> 18) | 240
        ba[n++] = ((c >> 12) & 63) | 128
        ba[n++] = ((c >> 6) & 63) | 128
        ba[n++] = (c & 63) | 128
        j += 2
      }
    }
    return new Uint8Array(ba).buffer
  }
  Vue.getByteArray = getByteArray
  Vue.prototype.$getByteArray = getByteArray
}

export default ByteArray
