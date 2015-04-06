// /Users/mihail/node_js/bin/npm install // errors
// /Users/mihail/node_js/bin/node /Users/mihail/projs/three1/server.js

var port = 80;

var http = require("http");
var url = require("url");
var path = require('path');
var fs = require('fs');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css",
    "xml": "application/xhtml+xml", //"text/xml",
    "swf": "application/x-shockwave-flash"};

function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), pathname);
    var ext = path.extname(filename).split(".")[1];

    console.log("Request for " + filename + " received." + mimeTypes);

    if (ext && mimeTypes[ext]){
        fs.exists(filename, function(exists) {
            if(!exists) {
                console.log("not exists: " + filename);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('404. static not found: ' + filename);
                response.end();
                return;
            }

            var mimeType = mimeTypes[ext];
            response.writeHead(200, {
                "Content-Type": mimeType,
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*"});

            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(response);
        });
    }
    else{
        process_request(pathname, filename, request, response);
    }
}

function process_request(pathname, filename, request, response) {
    if (pathname == '/'){
        fs.readdir(filename, function (err, files){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<html><head><title>three.js apps</title></head><body><ul>");
            files.forEach(function (element, index, array){
                var file_html_name = element;
                var ext = path.extname(file_html_name).split(".")[1];
                if (ext == "html")
                    response.write("<li><a href=\"" + file_html_name + "\">" + file_html_name + "</a></li>");
            });
            response.write("</ul></body></html>");
            response.end();
        });
        return;
    }

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("command not found: " + request.url);
    response.end();
}

http.createServer(onRequest).listen(port);

console.log("Server has started on", port, "!", process.cwd());