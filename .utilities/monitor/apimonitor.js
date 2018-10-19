const http = require('http');
const https = require('https');

makeHttpRequest = (host, apiName, callback) => {
  http.get(host + apiName + '/actuator/health', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
        data += chunk;
    });
    
    response.on('end', () => {
      console.log(apiName + ' UP! (' + response.statusCode + ')');
      callback(response.statusCode);
    });

  }).on('error', (err) => {
      console.log(apiName + ' NOT UP! (' + err.message + ')');
      callback(err.message);
  });
}

makeHttpsRequest = (host, apiName, callback) => {
  https.get(host + apiName + '/actuator/health', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
        data += chunk;
    });
    
    response.on('end', () => {
      console.log(apiName + ' UP! (' + response.statusCode + ')');
      callback(response.statusCode);
    });

  }).on('error', (err) => {
      console.log(apiName + ' NOT UP! (' + err.message + ')');
      callback(err.message);
  });
}
  
exports.checkForLife = (protocol, host, apiName) => {
  if(protocol === 'https'){
    makeHttpsRequest(host, apiName, (requestResult) => {
      if(requestResult !== 200){
        setTimeout(() => {
          this.checkForLife(protocol, host, apiName)
        }, 5000);
      }
    });
  } else if (protocol === 'http'){
    makeHttpRequest(host, apiName, (requestResult) => {
      if(requestResult !== 200){
        setTimeout(() => {
          this.checkForLife(protocol, host, apiName)
        }, 5000);
      }
    });
  } else {
    console.log("Protocol not recognised. I can only handle 'http' or 'https'")
  }
}
