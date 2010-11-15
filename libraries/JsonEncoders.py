import json
import datetime
from pymongo.objectid import ObjectId

class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime): return obj.isoformat()
        if isinstance(obj, ObjectId): return str(obj)
        return json.JSONEncoder.default(self, obj)