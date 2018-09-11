import { EasyClientForBrowser } from '@uniqys/easy-client'

const client = new EasyClientForBrowser(process.env.DAPP_ENDPOINT)

export default (_, inject) => {
  inject('client', client)
}
