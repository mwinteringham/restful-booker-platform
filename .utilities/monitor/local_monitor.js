const apiMonitor = require('./apimonitor.js');

process.stdout.write("Waiting for RBP to turn on");

apiMonitor.checkForLife('http', 'http://localhost:3000', '/booking');
apiMonitor.checkForLife('http', 'http://localhost:3001', '/room');
apiMonitor.checkForLife('http', 'http://localhost:3002', '/branding');
apiMonitor.checkForLife('http', 'http://localhost:3003', '/');
apiMonitor.checkForLife('http', 'http://localhost:3004', '/auth');
apiMonitor.checkForLife('http', 'http://localhost:3005', '/report');
apiMonitor.checkForLife('http', 'http://localhost:3006', '/message');