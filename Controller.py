from DBObject import DBObject

class Controller(DBObject):
    
    def get_databases(self):
        self.db_obj = self.conn.database_names()
        return self.json()
        
        
        