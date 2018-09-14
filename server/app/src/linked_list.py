class LinkedList:
    def __init__(self, db, prefix):
        self.db = db
        self.prefix = prefix

    def set_prefix(self, prefix):
        self.prefix = prefix

    def __full_key(self, key):
        return f'{self.prefix}:{key}'

    def set_head_id(self, id):
        return self.db.set(self.__full_key('head:id'), id)

    def get_head_id(self):
        return self.db.get(self.__full_key('head:id'))

    def get_value(self, id):
        assert id is not None
        return self.db.get(self.__full_key(f'value:{id}'))

    def set_value(self, id, value):
        assert id is not None
        return self.db.set(self.__full_key(f'value:{id}'), value)

    def delete_value(self, id):
        assert id is not None
        return self.db.delete(self.__full_key(f'value:{id}'))

    def insert_after(self, prev_id, id):
        prev = self.get_value(prev_id)
        assert prev is not None

        if prev['next_id'] is None:
            target = {
                'id': id,
                'next_id': None,
                'prev_id': prev['id'],
            }
            prev['next_id'] = target['id']

            self.set_value(prev['id'], prev)
            self.set_value(target['id'], target)
            self.set_head_id(target['id'])
            return

        next = self.get_value(prev['next_id'])
        target = {
            'id': id,
            'next_id': next['id'],
            'prev_id': prev['id'],
        }
        prev['next_id'] = target['id']
        next['prev_id'] = target['id']

        self.set_value(prev['id'], prev)
        self.set_value(target['id'], target)
        self.set_value(next['id'], next)

    def erase(self, target_id):
        target = self.get_value(target_id)
        if target['next_id'] is None:
            # erase head value
            if target['prev_id'] is None:
                # empty
                self.set_head_id(None)
            else:
                prev = self.get_value(target['prev_id'])
                prev['next_id'] = None
                self.set_value(prev['id'], prev)
                self.set_head_id(prev['id'])

            self.delete_value(target['id'])

            return

        next = self.get_value(target['next_id'])

        if target['prev_id'] is None:
            # erase back value
            next['prev_id'] = None
            self.set_value(next['id'], next)
            self.delete_value(target['id'])

            return

        prev = self.get_value(target['prev_id'])

        next['prev_id'] = prev['id']
        prev['next_id'] = next['id']

        self.delete_value(target['id'])
        self.set_value(next['id'], next)
        self.set_value(prev['id'], prev)

    def push_head(self, id):
        head_id = self.get_head_id()
        if head_id is None:
            target = {
                'id': id,
                'next_id': None,
                'prev_id': None,
            }
            self.set_value(target['id'], target)
            self.set_head_id(target['id'])
        else:
            self.insert_after(head_id, id)

    def pop_head(self):
        head_id = self.get_head_id()
        assert head_id is not None
        head = self.get_value(head_id)
        prev = self.get_value(head['prev_id'])

        if prev is None:
            self.delete_value(id)
            self.set_head_id(None)
        else:
            prev['next_id'] = None

            self.delete_value(head_id)

            self.set_value(prev['id'], prev)
            self.set_head_id(prev['id'])

    def get_values(self, id, count):
        values = []
        for _ in range(count):
            value = self.get_value(id)
            values.append(value)
            id = value['prev_id']
            if id is None:
                break

        return values

    def validate(self):
        head_id = self.get_head_id()
        if head_id is None:
            return

        value = self.get_value(head_id)
        while value['prev_id'] is not None:
            prev = self.get_value(value['prev_id'])
            assert prev['id'] == value['prev_id']
            assert prev['next_id'] == value['id']

            value = prev
