import unittest

from .kvs import KVS
from src.linked_list import LinkedList


class TestLinkedList(unittest.TestCase):
    def setUp(self):
        db = KVS()
        self.linked_list = LinkedList(db, 'test')

    def _validate(self):
        head_id = self.linked_list.get_head_id()
        if head_id is None:
            return
        value = self.linked_list.get_value(head_id)
        while value['prev_id'] is not None:
            prev = self.linked_list.get_value(value['prev_id'])
            self.assertEqual(prev['id'], value['prev_id'])
            self.assertEqual(prev['next_id'], value['id'])

            value = prev

    def test_push_head(self):
        [self.linked_list.push_head(2 ** i) for i in range(10)]
        self._validate()

    def test_pop_head(self):
        [self.linked_list.push_head(2 ** i) for i in range(10)]
        self.linked_list.pop_head()
        self._validate()
        head = self.linked_list.get_value(self.linked_list.get_head_id())
        self.assertEqual(head['id'], 2 ** 8)

        self.linked_list.pop_head()
        self.linked_list.pop_head()
        head = self.linked_list.get_value(self.linked_list.get_head_id())
        self.assertEqual(head['id'], 2 ** 6)

    def test_erase(self):
        [self.linked_list.push_head(2 ** i) for i in range(10)]

        self.linked_list.erase(8)
        self._validate()

        v1 = self.linked_list.get_value(8)
        self.assertIsNone(v1)

        v1 = self.linked_list.get_value(4)
        v2 = self.linked_list.get_value(16)

        self.assertEqual(v1['next_id'], v2['id'])
        self.assertEqual(v1['id'], v2['prev_id'])

    def test_erase_back(self):
        [self.linked_list.push_head(2 ** i) for i in range(10)]

        self.linked_list.erase(1)
        self._validate()

        v1 = self.linked_list.get_value(1)
        self.assertIsNone(v1)

        v2 = self.linked_list.get_value(2)
        v3 = self.linked_list.get_value(4)
        self.assertIsNone(v2['prev_id'])

        self.assertEqual(v2['id'], v3['prev_id'])
        self.assertEqual(v2['next_id'], v3['id'])

    def test_erase_head(self):
        [self.linked_list.push_head(2 ** i) for i in range(10)]

        self.linked_list.erase(512)
        self._validate()

        v1 = self.linked_list.get_value(512)
        self.assertIsNone(v1)

        v2 = self.linked_list.get_value(256)
        v3 = self.linked_list.get_value(128)
        self.assertIsNone(v2['next_id'])

        self.assertEqual(v2['id'], v3['next_id'])
        self.assertEqual(v2['prev_id'], v3['id'])

    def test_edge_case1(self):
        self.linked_list.push_head(1)

        self._validate()

        self.linked_list.erase(1)
        self._validate()

    def test_erase_empty(self):
        [self.linked_list.push_head(2 ** i) for i in range(10)]

        for i in range(10):
            self.linked_list.erase(2 ** i)
            self._validate()

        self.assertIsNone(self.linked_list.get_head_id())


if __name__ == "__main__":
    unittest.main()
