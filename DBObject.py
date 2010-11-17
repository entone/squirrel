import json
from pymongo import Connection
from libraries import JsonEncoders
from pymongo.objectid import ObjectId
import datetime
import settings

class DBObject(object):
    conn = None
    db = None
    collection = None
    id = None
    collection = None #override in subclass
    db_obj = None

    def __init__(self, database=None, collection=None, id=None, obj=None, json_string=None):        
        self.conn = Connection(host=settings.MONGO_HOST, port=settings.MONGO_PORT)
        if database: self.db = self.conn[database]
        if self.db and (database in settings.DATABASES): 
            self.db.authenticate(settings.DATABASES[database]['username'], settings.DATABASES[database]['password'])
        if collection: self.collection = self.db[collection]
        if id: 
            self.id = id
            db_obj = self.collection.find_one({"_id":ObjectId(self.id)})
        
        
        
    def json(self): return json.dumps(self.db_obj, cls=JsonEncoders.ComplexEncoder)