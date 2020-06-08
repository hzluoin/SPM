import JSEncrypt from 'jsencrypt'

const rsa = new JSEncrypt()
const DEFAULT_PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd0y6Y8P28YVHVgMSRBZA6F8jiwH1J3+IcmlzzKguVPPy+ifOpGe4qimW3Kydljmg/4/IZ3uyReReR6rq/LeGML3rCIKXIR7oPNvWyH2Y023GgDrZbXhOPc6bEXWD3uAC2/qFUyl7EYWs2mAd4uhR9/AmpFcP532OQPih71bGLowIDAQAB'
rsa.setPublicKey(DEFAULT_PUBLIC_KEY)

const RSA = {
  setPublicKey (key) {
    rsa.setPublicKey(key)
  },
  encrypt (message) {
    return rsa.encrypt(message)
  },
  decrypt (message) {
    return rsa.decrypt(message)
  }
}
RSA.install = function (Vue, option) {
  Vue.RSA = RSA
}

export default RSA
