let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'rbp.info') {
  backendHost = {
    auth : "http://" + window.location.hostname + "/auth"
  }
} else {
  backendHost = {
    auth : "http://" + window.location.hostname + ":3004"
  }  
}

export const API_ROOT = backendHost;