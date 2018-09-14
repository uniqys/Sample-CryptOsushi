import json
import dataclasses

from pymemcache.client.base import Client

import sushi


class Dao:
    def __init__(self, host, port):
        self.db = Client(
            (host, port),
            default_noreply=False,
            serializer=self.__json_serializer,
            deserializer=self.__json_deserializer
        )

    def __json_serializer(self, key, value):
        if type(value) == str:
            return value, 1
        return json.dumps(value), 2

    def __json_deserializer(self, key, value, flags):
        if flags == 1:
            return value.decode('utf-8')
        if flags == 2:
            return json.loads(value.decode('utf-8'))
        raise Exception('Unknown serialization format')

    def get_osushi(self, id):
        osushi = self.db.get(f'osushi:{id}')
        return osushi

    def get_osushi_list(self, start_id, n):
        osushi_list = []
        for i in range(n):
            id = start_id - i
            osushi = self.db.get(f'osushi:{id}')
            if osushi is None:
                break
            osushi_list.append({
                'id': id,
                **osushi
            })

        return osushi_list

    def get_all_osushi(self):
        count = self.get_osushi_count()
        ids = range(1, count+1)
        result = self.db.get_multi([f'osushi:{id}' for id in ids])
        return [{'id': id, **result[f'osushi:{id}']} for id in ids]

    def get_osushi_count(self):
        count = self.db.get('osushi:count')
        return count if count else 0

    def set_osushi(self, id, osushi):
        if type(osushi) is sushi.Sushi:
            osushi = dataclasses.asdict(osushi)
        self.db.set(f'osushi:{id}', osushi)

    def incr_osushi_count(self):
        count = self.db.get('osushi:count')
        if count:
            return self.db.incr('osushi:count', 1)
        else:
            self.db.set('osushi:count', 1)
            return 1

    def is_first_time(self, address):
        key = f'visited:{address}'
        result = self.db.get(key)
        if result is None:
            return True

        return False

    def visit_user(self, address):
        key = f'visited:{address}'
        self.db.set(key, True)
