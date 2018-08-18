let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'rbp.info') {
  backendHost = {
    booking : "http://" + window.location.hostname + "/booking",
    room : "http://" + window.location.hostname + "/",
    search : "http://" + window.location.hostname + "/search",
    auth : "http://" + window.location.hostname + "/auth",
    report : "http://" + window.location.hostname + "/report",
  }
} else {
  backendHost = {
    booking : "http://" + window.location.hostname + ":3000",
    room : "http://" + window.location.hostname + ":3001",
    search : "http://" + window.location.hostname + ":3002",
    auth : "http://" + window.location.hostname + ":3004",
    report : "http://" + window.location.hostname + ":3005"
  }  
}

export const API_ROOT = backendHost;