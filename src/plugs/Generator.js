const Generator = {}
Generator.install = function (Vue, option) {
  const key = (length, special) => {
    let iteration = 0
    let key = ''
    let randomNumber
    if (special === undefined) {
      special = true
    }
    while (iteration < length) {
      randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33
      if (!special) {
        if ((randomNumber >= 33) && (randomNumber <= 47)) continue
        if ((randomNumber >= 58) && (randomNumber <= 64)) continue
        if ((randomNumber >= 91) && (randomNumber <= 96)) continue
        if ((randomNumber >= 123) && (randomNumber <= 126)) continue
      }
      iteration++
      key += String.fromCharCode(randomNumber)
    }
    return key
  }
  Vue.Generator = { key }
}

export default Generator
