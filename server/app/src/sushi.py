import dataclasses

import sha3
from bottle import Bottle, request

from dao import Dao
from util import get_sender, make_response, get_config
from gari import transfer_gari
from decorator import require_via_chain

app = Bottle()
config = get_config()
dao = Dao(config['MEMCACHED']['HOST'], config['MEMCACHED']['PORT'])

OPERATOR_ADDRESS = config['OPERATOR_ADDRESS']


@dataclasses.dataclass
class Sushi:
    id: int = 1
    dna: str = None
    owner: str = None
    price: int = None


@app.route("/all")
def all():
    return make_response({'sushi_list': dao.get_all_osushi()}, ok=True)


@app.route("/generate", method="POST")
@require_via_chain
def generate():
    sender = get_sender()
    print('sender', sender)

    try:
        transfer_gari(sender, OPERATOR_ADDRESS, 100)
    except Exception as e:
        return make_response({'error': 'error.exception', 'body': str(e)}, ok=False)

    id = dao.incr_osushi_count()

    keccak_hash = sha3.keccak_256()
    keccak_hash.update(str(id).encode("utf-8"))
    dna = keccak_hash.hexdigest()

    osushi = dataclasses.asdict(Sushi(id, dna, sender))
    dao.set_osushi(id, osushi)

    return make_response({'sushi': osushi}, ok=True)


@app.route("/buy/:id", method="POST")
@require_via_chain
def buy(id):
    sender = get_sender()
    osushi = dao.get_osushi(id)

    if not osushi:
        return make_response({"error": "error.sushiNotFound", 'body': 'sushi not found'}, ok=False)

    if osushi["price"] is None:
        return make_response({"error": "error.alreadyBoughtOrCanceled", 'body': 'already bought or canceled'}, ok=False)

    if osushi["owner"] == sender:
        return make_response({"error": "error.canNotBuyOwnSushi", 'body': 'cannot buy your own sushi'}, ok=False)

    try:
        transfer_gari(sender, osushi["owner"], osushi["price"])
    except Exception as e:
        return make_response({'error': 'error.exception', 'body': str(e)}, ok=False)

    osushi["owner"] = sender
    osushi["price"] = None
    dao.set_osushi(id, osushi)

    return make_response({'sushi': osushi}, ok=True)


@app.route("/sell/:id", method="POST")
@require_via_chain
def sell(id):
    sender = get_sender()
    price = request.json.get("price")

    if price is None:
        return make_response({"error": "error.priceNotFound", 'body': 'price not found'}, ok=False)

    osushi = dao.get_osushi(id)
    if not osushi:
        return make_response({"error": "error.sushiNotFound", 'body': 'sushi not found'}, ok=False)

    if osushi["owner"] != sender:
        return make_response({"error": "error.canNotSellSushiNotYours", 'body': 'cannot sell sushi is not yours'}, ok=False)

    osushi["price"] = price
    dao.set_osushi(id, osushi)

    return make_response({'sushi': osushi}, ok=True)


@app.route("/sell/:id/cancel", method="POST")
@require_via_chain
def sell_cancel(id):
    sender = get_sender()
    osushi = dao.get_osushi(id)

    if not osushi:
        return make_response({"error": "error.sushiNotFound", 'body': 'sushi not found'}, ok=False)

    if osushi["price"] is None:
        return make_response({"error": "error.alreadyBought", 'body': 'already bought'}, ok=False)

    if osushi["owner"] != sender:
        return make_response({"error": "error.canNotCancelSellingSushiNotYours", 'body': 'cannot cancel selling sushi is not yours'}, ok=False)

    osushi["price"] = None
    dao.set_osushi(id, osushi)

    return make_response({'sushi': osushi}, ok=True)
