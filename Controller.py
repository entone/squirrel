from DBObject import DBObject
import settings

class Controller(DBObject):
    
    def get_databases(self):
        if settings.HARD_CODE_DATABASES:
            self.db_obj = []
            for key in settings.DATABASES: self.db_obj.append(key)
        else:
            self.db_obj = self.conn.database_names()
        return self.json()
        
        
        