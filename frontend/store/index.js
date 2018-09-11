/* eslint no-shadow: ["error", { "allow": ["state"] }] */

export const state = () => ({
  myAddress: '',
})


export const getters = {
  getMyAddress(state) {
    return () => state.myAddress;
  },
}

export const mutations = {
  setMyAddress(state, { address }) {
    state.myAddress = address
  },
}

export const actions = {
  async nuxtClientInit(context) {
    // https://qiita.com/potato4d/items/cc5d8ea24949e86f8a5b
    context.commit('setMyAddress', { address: this.$client.address.toString() })
    await context.dispatch('sushi/fetch')
    await context.dispatch('gari/fetch')
  },
}
