import os
from distutils.util import strtobool

from bottle import request


def get_sender():
    return request.get_header("uniqys-sender")


def is_via_chain():
    sender = get_sender()
    return sender is not None


def get_config():
    return {
        'HOST': os.environ.get('HOST', 'localhost'),
        'PORT': os.environ.get('PORT', '56080'),
        'MEMCACHED': {
            'HOST': os.environ.get('MEMCACHED_HOST', 'localhost'),
            'PORT': int(os.environ.get('MEMCACHED_PORT', '56011'))
        },
        'OPERATOR_ADDRESS':
            os.environ.get('OPERATOR_ADDRESS',
                           '767f8f53ad2fa6c78ca097fd3e331b4454f58188'),
        'API_BASE': os.environ.get('API_BASE', 'http://localhost:56010'),
        'SERVER': os.environ.get('SERVER', 'gunicorn'),
        'WORKER_NUM': int(os.environ.get('WORKER_NUM', '9')),
        'DEBUG': strtobool(os.environ.get('DEBUG', '0')),
        'AUTO_RELOAD': strtobool(os.environ.get('AUTO_RELOAD', '0')),
    }


def make_response(res, ok):
    return {'ok': ok, **res}
