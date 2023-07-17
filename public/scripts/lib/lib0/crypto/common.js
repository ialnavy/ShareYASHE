import * as webcrypto from '../webcrypto'

/**
 * @param {CryptoKey} key
 */
export const exportKey = async key => {
  const jwk = await webcrypto.subtle.exportKey('jwk', key)
  jwk.key_ops = key.usages
  return jwk
}
