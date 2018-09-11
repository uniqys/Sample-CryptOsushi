/* eslint-disable no-alert */
/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */

import {
  pickBy, mapKeys, each
} from 'lodash';
import Vue from 'vue'

const SushiState = {
  Normal: 'Normal',
  SaleInput: 'SaleInput',
  Sale: 'Sale',
  SaleTx: 'SaleTx',
  SaleCancelTx: 'SaleCancelTx',
  GenerateTx: 'GenerateTx',
}

export const state = () => ({
  sushiMapper: {},
  myAddress: '',
  editingPrice: '',
})

export const getters = {
  getAll(state) {
    return () => state.sushiMapper
  },
  get(state) {
    return id => state.sushiMapper[id]
  },
  getMyAll(state, getters) {
    return () => pickBy(state.sushiMapper, sushi => (
      sushi.owner === getters.getMyAddress()
    ))
  },
  getMarketAll(state, getters) {
    return () => pickBy(state.sushiMapper, sushi => (
      sushi.state === SushiState.Sale
    ))
  },
  getMyAddress(_, __, rootState) {
    return () => rootState.myAddress;
  },
  getEditingPrice(state) {
    return () => state.editingPrice;
  },
  isValidEditingPrice(state) {
    return () => {
      const price = parseFloat(state.editingPrice)
      if (price <= 0 || price > 999) {
        return false
      }
      if (!Number.isInteger(price)) {
        return false
      }
      return true
    };
  },
}

export const mutations = {
  changeSushiState(state, { key, newState }) {
    Vue.set(state.sushiMapper[key], 'state', newState)
  },
  clearSushiMap(state) {
    state.sushiMapper = {}
  },
  setSushiMap(state, { newSushiMap }) {
    Vue.set(state, 'sushiMapper', newSushiMap)
  },
  setSushi(state, { key, sushi }) {
    Vue.set(state.sushiMapper, key, sushi)
  },
  setPrice(state, { key, price }) {
    state.sushiMapper[key].price = price;
  },
  setEditingPrice(state, price) {
    state.editingPrice = price;
  },
  addSushi(state, { sushi, key }) {
    Vue.set(state.sushiMapper, key, sushi)
  },
  removeSushi(state, { key }) {
    Vue.delete(state.sushiMapper, key)
  },
}

export const actions = {
  async fetch(context) {
    context.commit('clearSushiMap')
    const { data } = await this.$client.get('/sushi/all')
    const sushiList = data.sushi_list
    const newSushiMap = mapKeys(sushiList, sushi => sushi.id)
    context.commit('setSushiMap', { newSushiMap })
    each(newSushiMap, (sushi) => {
      if (sushi.price) {
        context.commit('changeSushiState', { key: sushi.id, newState: SushiState.Sale })
      } else {
        context.commit('changeSushiState', { key: sushi.id, newState: SushiState.Normal })
      }
    })
  },
  async generate(context) {
    const date = new Date()
    const tempKey = `generating-${date.getTime()}`
    const tempSushi = {
      id: Infinity,
      state: SushiState.GenerateTx,
      owner: this.$client.address.toString(),
      price: null,
    }
    context.commit('addSushi', {
      key: tempKey,
      sushi: tempSushi
    })
    await new Promise(r => setTimeout(r, 100));
    const response = await this.$client.post('/sushi/generate', {}, { sign: true }).catch(() => null)
    if (!response) {
      context.commit('removeSushi', { key: tempKey })
      return
    }

    const { data } = response
    if (!data.ok) {
      alert(this.app.i18n.t(data.error))
      return
    }
    const { sushi } = data
    context.commit('setSushi', { key: tempKey, sushi })
    context.commit('changeSushiState', { key: tempKey, newState: SushiState.Normal })

    await context.dispatch('gari/fetch', null, { root: true })
  },
  async buy(context, { id, key }) {
    const response = await this.$client.post(`/sushi/buy/${id}`, {}, { sign: true }).catch(() => null)
    if (!response) { return }

    const { data } = response
    if (!data.ok) {
      if (data.error === 'error.alreadyBoughtOrCanceled') {
        context.commit('removeSushi', { key })
      }
      alert(this.app.i18n.t(data.error))
      return
    }
    const { sushi } = data
    context.commit('setSushi', { key, sushi })
    context.commit('changeSushiState', { key, newState: SushiState.Normal })

    await context.dispatch('gari/fetch', null, { root: true })
  },
  startSaleInput(context, { key }) {
    context.dispatch('resetEditingPrice')
    const nowState = context.state.sushiMapper[key].state;
    if (nowState === SushiState.Normal) {
      context.commit('changeSushiState', { key, newState: SushiState.SaleInput })
    }
  },
  cancelSaleInput(context, { key }) {
    if (!context.state.sushiMapper[key]) {
      return
    }
    const nowState = context.state.sushiMapper[key].state;
    if (nowState === SushiState.SaleInput) {
      context.commit('changeSushiState', { key, newState: SushiState.Normal })
    }
  },
  async sell(context, { id, key }) {
    const nowState = context.getters.get(key).state
    const price = parseFloat(context.getters.getEditingPrice())

    if (!context.getters.isValidEditingPrice()) {
      alert(this.app.i18n.t('error.priceShouldBeSetAsAnIntegerOf1To999'))
      return
    }

    if (nowState === SushiState.SaleInput) {
      context.commit('changeSushiState', { key, newState: SushiState.SaleTx })
      const response = await this.$client.post(`/sushi/sell/${id}`, { price }, { sign: true }).catch(() => null)
      if (!response) {
        context.commit('changeSushiState', { key, newState: SushiState.SaleInput })
        return
      }

      const { data } = response
      if (!data.ok) {
        context.commit('changeSushiState', { key, newState: SushiState.SaleTx })
        alert(this.app.i18n.t(data.error))
        return
      }
      const { sushi } = data
      context.commit('setSushi', { key, sushi })
      context.commit('changeSushiState', { key, newState: SushiState.Sale })
    }
  },
  async cancelSale(context, { id, key }) {
    const nowState = context.getters.get(key).state;

    if (nowState === SushiState.Sale) {
      context.commit('changeSushiState', { key, newState: SushiState.SaleCancelTx })
      const response = await this.$client.post(`/sushi/sell/${id}/cancel`, {}, { sign: true }).catch(() => null)
      if (!response) {
        return context.commit('changeSushiState', { key, newState: SushiState.Sale })
      }

      const { data } = response
      if (!data.ok) {
        if (data.error === 'error.alreadyBought') {
          context.commit('removeSushi', { key })
          return alert(this.app.i18n.t(data.error))
        }
      }
      const { sushi } = data
      context.commit('setSushi', { key, sushi })
      context.commit('changeSushiState', { key, newState: SushiState.Normal })
    }
    return null
  },
  resetEditingPrice(context) {
    context.commit('setEditingPrice', 1);
  },
  editPrice(context, { price }) {
    context.commit('setEditingPrice', price);
  },
}
