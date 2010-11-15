from DBObject import DBObject

class Collection(DBObject):
    
    def get_documents(self):
        self.db_obj = []
        for i in self.collection.find(): self.db_obj.append(i)
        return self.json()
        
        
        