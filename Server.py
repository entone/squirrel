import datetime
import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.escape
import settings
from Controller import Controller
from Database import Database
from Collection import Collection

class BaseHandler(tornado.web.RequestHandler):
    
    classes = {"Controller":Controller,"Database":Database, "Collection":Collection}
    protected = ['object', 'method', 'database', 'collection', 'id']
    
    def get(self):
        self.render("index.html", title="Heyo")
    
    def post(self):
        object = self.get_argument("object", None)
        method = self.get_argument("method", None)
        db = self.get_argument("database", None)
        collection = self.get_argument("collection", None)
        id = self.get_argument("id", None)
        ars = {}
        for key,val in self.request.arguments.items():
            _in = True
            for i in self.protected: 
                if key == i: _in = False
            if _in: ars[key]=val
            
        res = getattr(self.classes[object](db, collection, id), method)(**ars)
        self.write(res)
        
        
paths={"static_path": os.path.join(os.path.dirname(__file__), "static")}

application = tornado.web.Application([
    (r"/", BaseHandler),
], **paths)

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(settings.SERVER_PORT)
    tornado.ioloop.IOLoop.instance().start()