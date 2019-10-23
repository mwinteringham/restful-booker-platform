const apiMonitor = require('./apimonitor.js');

process.stdout.write("Waiting for RBP to turn on");

apiMonitor.checkForLife('https', 'https://automationintesting.online', '/booking');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/room');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/branding');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/auth');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/report');
apiMonitor.checkForLife('https', 'https://automationintesting.online', '/message');