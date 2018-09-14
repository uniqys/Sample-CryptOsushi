from functools import wraps

import util


def require_via_chain(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not util.is_via_chain():
            return util.make_response(
                {'error': 'access via chain required.'}, ok=False)

        return func(*args, **kwargs)

    return wrapper
