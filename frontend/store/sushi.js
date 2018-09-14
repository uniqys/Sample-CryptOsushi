/* eslint-disable no-alert */
/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */

import {
  mapKeys, each, assign, clone,
} from 'lodash';
import Vue from 'vue';

const SushiState = {
  Normal: 'Normal',
  SaleInput: 'SaleInput',
  Sale: 'Sale',
  SaleTx: 'SaleTx',
  SaleCancelTx: 'SaleCancelTx',
  GenerateTx: 'GenerateTx',
}

const initStartId = {
  my: null,
  market: null,
  all: null,
}

export const state = () => ({
  sushiMapper: {
    my: {},
    market: {},
    all: {},
  },
  editingPrice: '',
  generating: false,
  startId: clone(initStartId),
})

export const getters = {
  getType(_, __, rootState) {
    return () => {
      const { name } = rootState.route;
      // XXX: nuxt-i18nのlocalPathで変換した結果と比較するべき
      if (name.startsWith('index')) {
        return 'my';
      }
      if (name.startsWith('all-sushi')) {
        return 'all';
      }
      if (name.startsWith('market')) {
        return 'market';
      }

      return null;
    }
  },
  getAll(state, getters) {
    return () => state.sushiMapper[getters.getType()]
  },
  get(state, getters) {
    return id => state.sushiMapper[getters.getType()][id]
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
  getStartId(state, getters) {
    return () => state.startId[getters.getType()];
  },
  getApiPath(_, getters) {
    return () => {
      const startId = getters.getStartId();
      const type = getters.getType();

      if (type === 'my') {
        const address = getters.getMyAddress()
        return `/sushi/my/${address}?limit=10${startId ? `&start_id=${startId}` : ''}`;
      }
      if (type === 'market') {
        return `/sushi/market?limit=10${startId ? `&start_id=${startId}` : ''}`;
      }
      if (type === 'all') {
        return `/sushi/list?limit=10${startId ? `&start_id=${startId}` : ''}`;
      }
      // error
      return null;
    }
  },
}

export const mutations = {
  changeSushiState(state, { type, key, newState }) {
    Vue.set(state.sushiMapper[type][key], 'state', newState)
  },
  clearSushiMap(state, { type }) {
    state.sushiMapper[type] = {}
  },
  setSushiMap(state, { type, newSushiMap }) {
    Vue.set(state.sushiMapper, type, newSushiMap)
  },
  mergeSushiMap(state, { type, newSushiMap }) {
    Vue.set(state.sushiMapper, type, assign(clone(newSushiMap), state.sushiMapper[type]));
  },
  setSushi(state, { type, key, sushi }) {
    Vue.set(state.sushiMapper[type], key, sushi)
  },
  setPrice(state, { key, price }) {
    state.sushiMapper[key].price = price;
  },
  setEditingPrice(state, price) {
    state.editingPrice = price;
  },
  addSushi(state, { type, sushi, key }) {
    Vue.set(state.sushiMapper[type], key, sushi)
  },
  removeSushi(state, { type, key }) {
    Vue.delete(state.sushiMapper[type], key)
  },
  setStartId(state, { type, startId }) {
    state.startId[type] = startId;
  },
  resetStartId(state) {
    state.startId = clone(initStartId)
  },
  setGenerating(state, { generating }) {
    state.generating = generating
  }
}

export const actions = {
  async fetch(context) {
    const type = context.getters.getType();
    const apiPath = context.getters.getApiPath();

    const { data } = await this.$client.get(apiPath)
    const sushiList = data.sushi_list
    const newSushiMap = mapKeys(sushiList, sushi => sushi.id)

    context.commit('mergeSushiMap', { type, newSushiMap })
    each(newSushiMap, (sushi) => {
      if (sushi.price) {
        context.commit('changeSushiState', { type, key: sushi.id, newState: SushiState.Sale })
      } else {
        context.commit('changeSushiState', { type, key: sushi.id, newState: SushiState.Normal })
      }
    })

    context.commit('setStartId', { type, startId: data.start_id })
  },
  async reset(context) {
    context.commit('resetStartId');
    context.commit('clearSushiMap', { type: 'my' });
    context.commit('clearSushiMap', { type: 'market' });
    context.commit('clearSushiMap', { type: 'all' });
  },
  async generate(context) {
    if (context.state.generating) {
      return
    }
    context.commit('setGenerating', { generating: true })
    const type = 'my'
    const date = new Date()
    const tempKey = `generating-${date.getTime()}`
    const tempSushi = {
      id: Infinity,
      state: SushiState.GenerateTx,
      owner: this.$client.address.toString(),
      price: null,
    }
    context.commit('addSushi', {
      type,
      key: tempKey,
      sushi: tempSushi,
    })
    // XXX: 握り中の画面を出すためにスリープする
    await new Promise(r => setTimeout(r, 100));
    const response = await this.$client.post('/sushi/generate', {}, { sign: true }).catch(() => null)
    context.commit('setGenerating', { generating: false })
    if (!response) {
      context.commit('removeSushi', { type, key: tempKey })
      return
    }

    const { data } = response
    if (!data.ok) {
      context.commit('removeSushi', { type, key: tempKey })
      alert(this.app.i18n.t(data.error))
      return
    }
    const { sushi } = data
    context.commit('setSushi', { type, key: tempKey, sushi })
    context.commit('changeSushiState', { type, key: tempKey, newState: SushiState.Normal })

    await context.dispatch('gari/fetch', null, { root: true })
  },
  async buy(context, { id, key }) {
    const type = context.getters.getType();
    const response = await this.$client.post(`/sushi/buy/${id}`, {}, { sign: true }).catch(() => null)
    if (!response) { return }

    const { data } = response
    if (!data.ok) {
      if (data.error === 'error.alreadyBoughtOrCanceled') {
        context.commit('removeSushi', { type, key })
      }
      alert(this.app.i18n.t(data.error))
      return
    }
    const { sushi } = data
    context.commit('setSushi', { type, key, sushi })
    context.commit('changeSushiState', { type, key, newState: SushiState.Normal })

    await context.dispatch('gari/fetch', null, { root: true })
  },
  startSaleInput(context, { key }) {
    const type = context.getters.getType();
    context.dispatch('resetEditingPrice')
    const nowState = context.state.sushiMapper[type][key].state;
    if (nowState === SushiState.Normal) {
      context.commit('changeSushiState', { type, key, newState: SushiState.SaleInput })
    }
  },
  cancelSaleInput(context, { key }) {
    const type = context.getters.getType();
    if (!context.state.sushiMapper[key]) {
      return
    }
    const nowState = context.state.sushiMapper[key].state;
    if (nowState === SushiState.SaleInput) {
      context.commit('changeSushiState', { type, key, newState: SushiState.Normal })
    }
  },
  async sell(context, { id, key }) {
    const type = context.getters.getType();
    const nowState = context.getters.get(key).state
    const price = parseFloat(context.getters.getEditingPrice())

    if (!context.getters.isValidEditingPrice()) {
      alert(this.app.i18n.t('error.priceShouldBeSetAsAnIntegerOf1To999'))
      return
    }

    if (nowState === SushiState.SaleInput) {
      context.commit('changeSushiState', { type, key, newState: SushiState.SaleTx })
      const response = await this.$client.post(`/sushi/sell/${id}`, { price }, { sign: true }).catch(() => null)
      if (!response) {
        context.commit('changeSushiState', { type, key, newState: SushiState.SaleInput })
        return
      }

      const { data } = response
      if (!data.ok) {
        context.commit('changeSushiState', { type, key, newState: SushiState.SaleTx })
        alert(this.app.i18n.t(data.error))
        return
      }
      const { sushi } = data
      context.commit('setSushi', { type, key, sushi })
      context.commit('changeSushiState', { type, key, newState: SushiState.Sale })
    }
  },
  async cancelSale(context, { id, key }) {
    const type = context.getters.getType();
    const nowState = context.getters.get(key).state;

    if (nowState === SushiState.Sale) {
      context.commit('changeSushiState', { type, key, newState: SushiState.SaleCancelTx })
      const response = await this.$client.post(`/sushi/sell/${id}/cancel`, {}, { sign: true }).catch(() => null)
      if (!response) {
        return context.commit('changeSushiState', { type, key, newState: SushiState.Sale })
      }

      const { data } = response
      if (!data.ok) {
        if (data.error === 'error.alreadyBought') {
          context.commit('removeSushi', { type, key })
          return alert(this.app.i18n.t(data.error))
        }
      }
      const { sushi } = data
      context.commit('setSushi', { type, key, sushi })
      context.commit('changeSushiState', { type, key, newState: SushiState.Normal })
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
