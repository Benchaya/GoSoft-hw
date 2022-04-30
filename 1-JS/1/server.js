const http = require('http');

const handler = (req, res) => {
    res.write("Benchaya Rakpongthai, " + Date());
    res.end();
}

const server = http.createServer(handler);

server.listen(2337);