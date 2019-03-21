var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
    switch(true){
        case /booking/.test(req.url):
            proxy.web(req, res, { target: 'http://localhost:3000' });
            break;
        case /room/.test(req.url):
            proxy.web(req, res, { target: 'http://localhost:3001' });
            break;
        case /branding/.test(req.url):
            proxy.web(req, res, { target: 'http://localhost:3002' });
            break;
        case /auth/.test(req.url):
            proxy.web(req, res, { target: 'http://localhost:3004' });
            break;
        case /report/.test(req.url):
            proxy.web(req, res, { target: 'http://localhost:3005' });
            break;    
        default:
            proxy.web(req, res, { target: 'http://localhost:3003' });
            break;
    }
});

proxy.on('proxyReq', function(proxyReq, req) {
    req._proxyReq = proxyReq;
});

proxy.on('error', function(err, req, res) {
  if (req.socket.destroyed && err.code === 'ECONNRESET') {
    req._proxyReq.abort();
  }
});

server.listen(8080);