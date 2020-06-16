/**
 * @js-watermark.js
 * @author gisonyeung
 * @Created: 17-04-05
 * @repository: https://github.com/gisonyeung/js-watermark..git
 * @description JavaScript 图片文字水印生成工具，生成 base64 编码图片。
 */
const _Watermark = function (options) {
  let self = this

  let defaults = {
    fileControlId: '',
    text: 'js-watermark',
    fontSize: '3vw',
    fontFamily: 'Microsoft Yahei',
    color: 'rgba(255,255,255,0.7)',
    addPreviewListener: null
  }

  options = options || {}
  for (let key in defaults) {
    if (typeof options[key] === 'undefined') {
      options[key] = defaults[key]
    }
  }

  self.options = options

  // 采用上传按钮的方式获取图片
  if (options.fileControlId) {
    if (typeof options.addPreviewListener === 'function') {
      let $fileControl = document.getElementById(options.fileControlId)

      $fileControl.addEventListener('change', function (event) {
        getFileBase64(event, function (src) {
          self.setImage(src)
          options.addPreviewListener.call(self, src, self.sizes)
        })
      })
    } else {
      throw Error('js-watermark: 请绑定获取base64图片信息的回调函数 addPreviewListener')
    }
  }

  function getFileBase64 (source, callback) {
    if (window.FileReader) {
      let oFileReader = new FileReader()
      let oFile = source.target.files[0]
      // 过滤非图片文件
      if (/^image*/.test(oFile.type)) {
        oFileReader.onloadend = function (e) {
          callback(e.target.result)
        }
        // 将图片转为base64格式
        oFileReader.readAsDataURL(oFile)
      } else {
        alert('请上传图片文件')
      }
    } else {
      alert('您当前使用的浏览器不支持读取文件功能')
    }
  }
}

// 通过 file 控件载入图片文件
_Watermark.prototype.setFile = function (fileId) {
  if (window.FileReader) {
    let self = this
    let source = document.getElementById(fileId)
    let oFileReader = new FileReader()

    if (source.files.length === 0) {
      alert('文件为空')
      return false
    }

    let oFile = source.files[0]
    // 过滤非图片文件
    if (/^image*/.test(oFile.type)) {
      oFileReader.onloadend = function (e) {
        self.setImage(e.target.result)
      }
      // 将图片转为base64格式
      oFileReader.readAsDataURL(oFile)
      return true
    } else {
      alert('请上传图片文件')
      return false
    }
  } else {
    alert('您当前使用的浏览器不支持读取文件功能')
  }
}

// 通过 base64 载入图片文件
_Watermark.prototype.setImage = function (src) {
  let image = new Image()
  image.src = src
  this.dataUrl = src
  this.sizes = {
    width: image.width,
    height: image.height
  }

  let canvas = document.createElement('canvas')

  canvas.width = this.sizes.width
  canvas.height = this.sizes.height
  let ctx = canvas.getContext('2d')

  ctx.drawImage(image, 0, 0)
  image = null

  this.canvas = canvas
}

_Watermark.prototype.hasImage = function () {
  return !!this.dataUrl
}

// 获取当前图片尺寸
_Watermark.prototype.getSize = function () {
  return this.sizes
}

// 清空水印
_Watermark.prototype.clearMark = function () {
  let ctx = this.canvas.getContext('2d')
  // 清空画布
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  // 重绘

  let image = new Image()
  image.src = this.dataUrl
  ctx.drawImage(image, 0, 0)
  image = null
}

// 增加文字水印
_Watermark.prototype.addText = function (text, opts) {
  /*
      opt: {
          fontSize: '20px',
          fontFamily: 'Microsoft Yahei',
          color: "rgba(255,255,255, 0.7)",
          left: 0,
          top: 0,
      }
  */
  if (typeof text === 'object') {
    opts = text
    text = this.options.text
  }

  if (opts.left == null) {
    alert('请设置文字水印水平距离')
    return false
  }
  if (opts.top == null) {
    alert('请设置文字水印垂直距离')
    return false
  }

  let ctx = this.canvas.getContext('2d')

  let _fontSize = opts.fontSize || this.options.fontSize

  // 转换 vw
  if (~_fontSize.indexOf('vw')) {
    _fontSize = this.sizes.width / 100 * _fontSize.replace('vw', '')
    // 保留三位小数
    _fontSize = _fontSize.toFixed(3) + 'px'
  }

  // 绘制水印
  ctx.font = _fontSize + ' ' + (opts.fontFamily || this.options.fontFamily)
  ctx.fillStyle = opts.color || this.options.color
  ctx.fillText(text, opts.left, opts.top)
}

_Watermark.prototype.getPreview = function () {
  return this.dataUrl
}

// 绘制图片
_Watermark.prototype.render = function (type) {
  type = type === 'png' ? 'png' : 'jpeg'
  return this.canvas.toDataURL('image/' + type)
}

const Watermark = {}
Watermark.install = function (Vue, option) {
  Vue.prototype.$watermark = _Watermark
}
export default Watermark
