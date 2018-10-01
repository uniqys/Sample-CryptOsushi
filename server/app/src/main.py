from bottle import mount, route, run, static_file, redirect

import sushi
import gari
from util import get_config

config = get_config()
static_dir_path = '/static'

@route('/')
def index():
    return static_file('index.html', root=static_dir_path)


@route('/<path:path>')
def file_path(path):
    return static_file(path, root=static_dir_path)


mount('/sushi', sushi.app)
mount('/gari', gari.app)

run(server=config['SERVER'],
    workers=config['WORKER_NUM'],
    host=config['HOST'],
    port=config['PORT'],
    debug=config['DEBUG'],
    reloader=config['AUTO_RELOAD'])
