var long_strings = {};

function show_string(key){
    var st = "<h2>"+key+"</h2>"+long_strings[key];
    $.modal(st, {overlayClose:true, maxWidth:700});
}

function base(obj){
    this.url = "/";
    this.__init__(obj);    
}

base.prototype.__init__ = function(obj){
    for(var i in obj) if(!this[i]) this[i] = obj[i];
}

base.prototype.__constructor__ = function(){
    if (this && this.constructor && this.constructor.toString) {
        var arr = this.constructor.toString().match(/function\s*(\w+)/);
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }
    return undefined;
}

base.prototype.ajax = function(method, callback, data){
    if(!data) data = {}
    data['object'] = this.__constructor__();
    data['method'] = method;
    $.ajax({
       url: this.url,
       data: data,
       type: "POST",
       dataType:"json",
       success: callback
    });
}

base.prototype.__callback__ = function(obj,fn){
    return function(){fn.apply(obj, arguments)}
}

function Controller(){
    this.__init__(arguments);
    this.databases = [];
    this.long_strings = {};
}

Controller.prototype = new base();
Controller.prototype.constructor = Controller;

Controller.prototype.init = function(){
    this.ajax('get_databases', this.__callback__(this, this.got_dbs));
}

Controller.prototype.render = function(root){
    var dbs = $("<div id='databases'></div>");
    for(var i = 0; i < this.databases.length; i++){
        this.databases[i].render(dbs);
    }
    $(root).append(dbs);
}

Controller.prototype.got_dbs = function(data){
    for(var i=0; i<data.length; i++){       
        var db = new Database({name:data[i]});
        this.databases.push(db);
    }    
}

function Database(obj){
    this.__init__(obj);
    this.collections = [];
    this.get_collections();
}

Database.prototype = new base();
Database.prototype.constructor = Database;

Database.prototype.get_collections = function(){
    this.ajax('get_collections', this.__callback__(this, this.got_collections), {database:this.name});
}

Database.prototype.got_collections = function(data){
    console.log(data);
    for(var i=0; i<data.length; i++){       
        this.collections.push(new Collection({name:data[i], database:this.name}));
    }
}


Database.prototype.render = function(root){
    var db_header = $("<h3><a href='#'>"+this.name+"</a></h3>");
    $(root).append(db_header);
    var cols = $('<div></div>');
    $(root).append(cols);
    for(var i=0; i<this.collections.length; i++){
        this.collections[i].render(cols);
    }
}

function Collection(obj){
    this.__init__(obj);
    this.documents = [];
}

Collection.prototype = new base();
Collection.prototype.constructor = Collection;

Collection.prototype.get_documents = function(){
    this.ajax('get_documents', this.__callback__(this, this.got_documents), {database:this.database, collection:this.name});
}

Collection.prototype.got_documents = function(data){
    var headers = [];
    $('#docs thead tr').empty();
    $('#docs tbody').empty();
    if(data.length){
        for(h in data[0]) headers.push(h);
        for(var i=0; i < headers.length; i++){
            $('#docs thead tr').append("<th>"+headers[i]+"</th>");
        }
    }
    
    for(var i=0; i<data.length; i++){
        var row = $("<tr></tr>");
        $('#docs tbody').append(row);
        for(var n in headers){
            if(typeof(data[i][headers[n]]) == 'string'){
                var st = data[i][headers[n]] ? data[i][headers[n]] : "&nbsp;";
            }else{
                var st = this.parse_object(data[i][headers[n]]);
            }
            if(st.length > 255 || typeof(data[i][headers[n]]) != 'string'){
                var key = headers[n]+" "+i;
                long_strings[key] = st;
                var st = "<a href='#' onclick='show_string(\""+key+"\"); return false'>Show "+st.length+" characters</a>";
            }
            $(row).append("<td>"+st+"</td>");
        }
    }
    $('#docs').tablesorter();
}

Collection.prototype.parse_object = function(obj){
    var str = "<ul>";
    for(var n in obj){
        str+="<li>"+n+": ";
        if(typeof(obj[n]) == 'string'){
            str+=obj[n];
        }else{
            str+= this.parse_object(obj[n]);
        }
        str+="</li>";
    }
    str+="</ul>";
    return str;
}

Collection.prototype.render = function(root){
    var a = $("<a href='#'>"+this.name+"</a>");
    a.click(this.__callback__(this, this.get_documents));
    $(root).append(a);
}


var controller = null;

$(document).ready(function(){
    controller = new Controller();
    controller.init();    
    setTimeout(function(){
        controller.render($('#collections'));
        $('#databases').accordion();                
    }, 2000);
});