import { URL } from 'url'

import leveldown from 'leveldown'

import { Blockchain, BlockStore, GenesisConfig } from '@uniqys/blockchain'
import { Easy } from '@uniqys/easy-framework'
import { Local } from '@uniqys/chain-core-dev'
import { LevelDownStore } from '@uniqys/store'
import { KeyConfig } from '@uniqys/signature'

// set logger enable
import debug from 'debug'
debug.enable('chain-core*,easy*,app*')

const UNIQYS_APP_URL = process.env.UNIQYS_APP_URL || 'http://localhost:56080'
const UNIQYS_GATEWAY_PORT = Number(process.env.UNIQYS_GATEWAY_PORT) || 8080
const UNIQYS_INNER_API_PORT = Number(process.env.UNIQYS_INNER_API_PORT) || 56010
const UNIQYS_MEMCACHED_PORT = Number(process.env.UNIQYS_MEMCACHED_PORT) || 56011

const LEVELDOWN_DIR = process.env.LEVELDOWN_DIR || '.leveldown'
const CONFIG_DIR = '/app/config'

async function startEasy () {
  // load config
  const genesis = new GenesisConfig().validateAsBlock(require(`${CONFIG_DIR}/genesis.json`))
  const keyPair = new KeyConfig().validateAsKeyPair(require(`${CONFIG_DIR}/validatorKey.json`))
  // state store
  const stateStore = new LevelDownStore(leveldown(LEVELDOWN_DIR + '/state'))
  const chainStore = new LevelDownStore(leveldown(LEVELDOWN_DIR + '/chain'))
  const easy = new Easy(new URL(UNIQYS_APP_URL), stateStore, (dapp) =>
    new Local(dapp, new Blockchain(new BlockStore(chainStore), genesis), keyPair)
  )
  easy.gateway().listen(UNIQYS_GATEWAY_PORT)
  easy.innerApi().listen(UNIQYS_INNER_API_PORT)
  easy.innerMemcachedCompatible().listen(UNIQYS_MEMCACHED_PORT)
  await easy.start()
}

(async () => {
  await startEasy()
})().catch(err => console.log(err))
