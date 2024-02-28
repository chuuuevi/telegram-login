import {createHash, createHmac} from 'crypto';

/**
 *
 * @param token         token
 * @param hash          ignore hash
 * @param data          query data
 * @return {string}
 */
export default function sign(token, {hash, ...data}) {
    const secret = createHash('sha256')
        .update(token)
        .digest()
    const checkString = Object.keys(data)
        .sort()
        .map(k => `${k}=${data[k]}`)
        .join('\n')
    return createHmac('sha256', secret)
        .update(checkString)
        .digest('hex');
}