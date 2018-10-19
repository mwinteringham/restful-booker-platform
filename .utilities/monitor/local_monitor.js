const apiMonitor = require('./apimonitor.js');

apiMonitor.checkForLife('http', 'http://localhost:3000', '/booking');
apiMonitor.checkForLife('http', 'http://localhost:3001', '/room');
apiMonitor.checkForLife('http', 'http://localhost:3002', '/search');
apiMonitor.checkForLife('http', 'http://localhost:3003', '/');
apiMonitor.checkForLife('http', 'http://localhost:3004', '/auth');
apiMonitor.checkForLife('http', 'http://localhost:3005', '/report');