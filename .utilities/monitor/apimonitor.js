const http = require('http');
const https = require('https');

makeHttpRequest = (host, apiName) => {
  http.get(host + apiName + '/actuator/health', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
        data += chunk;
    });
    
    response.on('end', () => {
      if(response.statusCode !== 200){
        process.stdout.write('.');

        setTimeout(() => {
          makeHttpRequest(host, apiName);
        }, 5000);
      } else {
        process.stdout.write('\n' + apiName + ' ready ');
      }
    });

  }).on('error', () => {
      process.stdout.write('.')
      setTimeout(() => {
        makeHttpRequest(host, apiName);
      }, 5000);
  });
}

makeHttpsRequest = (host, apiName) => {
  https.get(host + apiName + '/actuator/health', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
        data += chunk;
    });
    
    response.on('end', () => {
      if(response.statusCode !== 200){
        process.stdout.write('.');
        
        setTimeout(() => {
          makeHttpsRequest(host, apiName);
        }, 5000);
      } else {
        process.stdout.write('\n' + apiName + ' ready ');
      }
    });

  }).on('error', () => {
      process.stdout.write('.')
      setTimeout(() => {
        makeHttpsRequest(host, apiName);
      }, 5000);
  });
}

exports.checkForLife = (protocol, host, apiName) => {
  if(protocol === 'https'){
    makeHttpsRequest(host, apiName);
  } else if (protocol === 'http'){
    makeHttpRequest(host, apiName, (requestResult) => {
      if(requestResult !== 200){
        setTimeout(() => {
          makeHttpRequest(host, apiName)
        }, 5000);
      }
    });
  } else {
    console.log("Protocol not recognised. I can only handle 'http' or 'https'")
  }
}
