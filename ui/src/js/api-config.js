let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'realsite.com') {
  backendHost = {
    auth : "http://" + window.location.hostname + "/auth"
  }
} else {
  backendHost = {
    auth : "http://" + window.location.hostname + ":3004"
  }  
}

export const API_ROOT = backendHost;