import json
import dataclasses

import sha3
from bottle import Bottle, request

from dao import Dao
from util import get_sender, make_response, get_config
from gari import transfer_gari
from linked_list import LinkedList
from decorator import require_via_chain

app = Bottle()
config = get_config()
dao = Dao(config['MEMCACHED']['HOST'], config['MEMCACHED']['PORT'])

OPERATOR_ADDRESS = config['OPERATOR_ADDRESS']

linked_list = LinkedList(dao.db, '')


@dataclasses.dataclass
class Sushi:
    id: int = 1
    dna: str = None
    owner: str = None
    price: int = None


@app.route('/list')
def list():
    start_id = int(request.query.get('start_id', dao.get_osushi_count()))
    limit = int(request.query.get('limit', 10))
    sushi_list = dao.get_osushi_list(start_id, limit)

    start_id = None if len(sushi_list) == 0 else start_id - len(sushi_list)
    return make_response({
        'sushi_list': sushi_list,
        'start_id': start_id
    }, ok=True)


def _pagination(prefix):
    linked_list.set_prefix(prefix)
    start_id = request.query.get('start_id', linked_list.get_head_id())
    limit = int(request.query.get('limit', 10))

    if start_id is None:
        # empty
        return make_response(
            {'sushi_list': [], 'start_id': None},
            ok=True)

    values = linked_list.get_values(start_id, limit)
    sushi_list = []

    for value in values:
        sushi_list.append(dao.get_osushi(value['id']))

    start_id = values[-1]['prev_id']

    return make_response(
        {'sushi_list': sushi_list, 'start_id': start_id},
        ok=True)


@app.route('/market')
def market():
    return _pagination('market')


@app.route('/my/:address')
def my(address):
    prefix = f'sushi:{address}'
    return _pagination(prefix)


@app.route('/generate', method='POST')
@require_via_chain
def generate():
    sender = get_sender()

    try:
        transfer_gari(sender, OPERATOR_ADDRESS, 100)
    except Exception as e:
        return make_response(
            {'error': 'error.exception', 'body': str(e)},
            ok=False)

    id = dao.incr_osushi_count()

    keccak_hash = sha3.keccak_256()
    keccak_hash.update(str(id).encode('utf-8'))
    dna = keccak_hash.hexdigest()

    osushi = dataclasses.asdict(Sushi(id, dna, sender))
    dao.set_osushi(id, osushi)

    linked_list.set_prefix(f'sushi:{sender}')
    linked_list.push_head(osushi['id'])

    return make_response({'sushi': osushi}, ok=True)


@app.route('/buy/:id', method='POST')
@require_via_chain
def buy(id):
    sender = get_sender()
    osushi = dao.get_osushi(id)

    if not osushi:
        return make_response(
            {
                'error': 'error.sushiNotFound',
                'body': 'sushi not found'
            }, ok=False)

    if osushi['price'] is None:
        return make_response(
            {
                'error': 'error.alreadyBoughtOrCanceled',
                'body': 'already bought or canceled'
            }, ok=False)

    if osushi['owner'] == sender:
        return make_response(
            {
                'error': 'error.canNotBuyOwnSushi',
                'body': 'cannot buy your own sushi'
            }, ok=False)

    try:
        transfer_gari(sender, osushi['owner'], osushi['price'])
    except Exception as e:
        return make_response(
            {
                'error': 'error.exception',
                'body': str(e)
            }, ok=False)

    old_owner = osushi['owner']
    osushi['owner'] = sender
    osushi['price'] = None
    dao.set_osushi(id, osushi)

    linked_list.set_prefix(f'market')
    linked_list.erase(osushi['id'])

    linked_list.set_prefix(f'sushi:{old_owner}')
    linked_list.erase(osushi['id'])

    linked_list.set_prefix(f'sushi:{sender}')
    linked_list.push_head(osushi['id'])

    return make_response({'sushi': osushi}, ok=True)


@app.route('/sell/:id', method='POST')
@require_via_chain
def sell(id):
    sender = get_sender()

    body = request.environ['wsgi.input']
    param = json.loads(body.read().decode('utf8'))
    price = param.get("price")
    if price is None:
        return make_response(
            {
                'error': 'error.priceNotFound',
                'body': 'price not found'
            }, ok=False)

    osushi = dao.get_osushi(id)
    if not osushi:
        return make_response(
            {
                'error': 'error.sushiNotFound',
                'body': 'sushi not found'
            }, ok=False)

    if osushi['owner'] != sender:
        return make_response(
            {
                'error': 'error.canNotSellSushiNotYours',
                'body': 'cannot sell sushi is not yours'
            }, ok=False)

    osushi['price'] = price
    dao.set_osushi(id, osushi)

    linked_list.set_prefix(f'market')
    linked_list.push_head(osushi['id'])

    return make_response({'sushi': osushi}, ok=True)


@app.route('/sell/:id/cancel', method='POST')
@require_via_chain
def sell_cancel(id):
    sender = get_sender()
    osushi = dao.get_osushi(id)

    if not osushi:
        return make_response(
            {
                'error': 'error.sushiNotFound',
                'body': 'sushi not found'
            },
            ok=False)

    if osushi['price'] is None:
        return make_response(
            {
                'error': 'error.alreadyBought', 'body': 'already bought'
            },
            ok=False)

    if osushi['owner'] != sender:
        return make_response(
            {
                'error': 'error.canNotCancelSellingSushiNotYours',
                'body': 'cannot cancel selling sushi is not yours'
            },
            ok=False)

    osushi['price'] = None
    dao.set_osushi(id, osushi)

    linked_list.set_prefix(f'market')
    linked_list.erase(osushi['id'])

    return make_response({'sushi': osushi}, ok=True)
