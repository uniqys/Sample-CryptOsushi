/* eslint no-shadow: ["error", { "allow": ["state"] }] */

export const state = () => ({
  balance: 0,
})

export const getters = {
  getBalance(state) {
    return () => state.balance
  },
}

export const mutations = {
  setBalance(state, { newBalance }) {
    state.balance = newBalance
  },
}

export const actions = {
  async fetch(context) {
    const address = context.rootGetters.getMyAddress()
    const { data } = await this.$client.get(`/gari/refer/${address}`)
    const { balance } = data;
    context.commit('setBalance', { newBalance: balance })
  },
}
