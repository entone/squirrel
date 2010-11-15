from DBObject import DBObject

class Database(DBObject):
    
    def get_collections(self):
        self.db_obj = self.database.collection_names()
        return self.json()
        
        
        