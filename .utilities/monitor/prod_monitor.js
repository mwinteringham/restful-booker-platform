const apiMonitor = require('./apimonitor.js');

apiMonitor.checkForLife('https', 'https://automationintesting.online', '/booking');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/room');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/auth');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/report');