import json

import requests
from bottle import Bottle, request

from dao import Dao
from util import (get_config, is_via_chain, get_sender,
                  make_response)
from decorator import require_via_chain

config = get_config()

app = Bottle()
dao = Dao(config['MEMCACHED']['HOST'], config['MEMCACHED']['PORT'])

OPERATOR_ADDRESS = config['OPERATOR_ADDRESS']
DEFAULT_GARI = 10000

API_BASE = config['API_BASE']


@app.route('/tap', method='POST')
@require_via_chain
def index():
    sender = get_sender()

    balance = request.json.get('balance')
    if balance is None:
        return make_response(
            {
                'error': 'exception.balanceNotFound',
                'body': 'balance not found'
            }, ok=False)

    operator_gari = refer_gari(OPERATOR_ADDRESS)
    if operator_gari < DEFAULT_GARI * 10:
        put_gari(OPERATOR_ADDRESS, DEFAULT_GARI * 10)

    try:
        transfer_gari(OPERATOR_ADDRESS, sender, balance)
    except Exception as e:
        return make_response(
            {
                'error': 'error.exception',
                'body': str(e)
            }, ok=False)

    updated_balance = refer_gari(sender)
    return make_response({'balance': updated_balance}, ok=True)


@app.route('/refer/:address')
def tap(address):
    balance = refer_gari(address)
    return make_response({'balance': balance}, ok=True)


def refer_gari(address):
    if dao.is_first_time(address):
        if is_via_chain():
            # BC経由のアクセスならしれっと書き込む
            dao.visit_user(address)
            put_gari(address, DEFAULT_GARI)

        return DEFAULT_GARI

    api_url = f'{API_BASE}/accounts/{address}/balance'
    res = requests.get(api_url)
    return res.json()[0] if res else 0


def put_gari(address, value):
    api_url = f'{API_BASE}/accounts/{address}/balance'
    return requests.put(
        api_url,
        data=json.dumps([int(value)]),
        headers={'Content-Type': 'application/json'}
    )


def transfer_gari(sender, to, value):
    sender_gari = refer_gari(sender)
    if int(sender_gari) < int(value):
        raise Exception('not enough gari.')

    api_url = f'{API_BASE}/accounts/{sender}/transfer'
    res = requests.post(
        api_url,
        data=json.dumps(dict({'to': str(to), 'value': int(value)})),
        headers={'Content-Type': 'application/json'}
    )
    if res.status_code != requests.codes.ok:
        raise Exception(res.text)
