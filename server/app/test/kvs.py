class KVS:
    def __init__(self):
        self.data = {}

    def get(self, key):
        if key in self.data:
            return self.data[key]
        return None

    def set(self, key, value):
        self.data[key] = value
        return value

    def delete(self, key):
        del self.data[key]
