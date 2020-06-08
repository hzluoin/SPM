import aes from 'crypto-js/aes'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import ECB from 'crypto-js/mode-ecb'
import Pkcs7 from 'crypto-js/pad-pkcs7'

const AES = {
  encrypt (message, keyStr) {
    // 字符串类型的key用之前需要用uft8先parse一下才能用
    const key = Utf8.parse(keyStr)
    const encrypted = aes.encrypt(message, key, {
      mode: ECB,
      padding: Pkcs7
    })
    // 加密出来是一个16进制的字符串,进行Base64转码
    // return encrypted.ciphertext.toString()
    return Base64.stringify(encrypted.ciphertext)
  },
  decrypt (ciphertext, keyStr) {
    // 字符串类型的key用之前需要用uft8先parse一下才能用
    const key = Utf8.parse(keyStr)
    // 拿到字符串类型的密文需要先将其用Hex方法parse一下，如果密文已转为Base64编码，则不需要该步骤
    // const encryptedHexStr = Hex.parse(ciphertext)
    // 将密文转为Base64的字符串，只有Base64类型的字符串密文才能对其进行解密
    // const encryptedBase64Str = Base64.stringify(encryptedHexStr)
    const decrypted = aes.decrypt(ciphertext, key, {
      mode: ECB,
      padding: Pkcs7
    })
    // 以utf-8的形式输出解密过后内容
    return decrypted.toString(Utf8)
  }
}
AES.install = function (Vue, option) {
  Vue.AES = AES
}

export default AES
