var http = require('http');
http.createServer(
    function (_req,res) {
        res.write('Hello World!');
        res.end();
    }
).listen(3000);