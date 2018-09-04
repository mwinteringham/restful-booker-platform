let backendHost;

const hostname = window && window.location && window.location.hostname;

if(process.env.NODE_ENV === 'production'){
  backendHost = {
    booking : "https://" + window.location.hostname,
    room : "https://" + window.location.hostname,
    search : "https://" + window.location.hostname,
    auth : "https://" + window.location.hostname + "/auth",
    report : "https://" + window.location.hostname,
  }
} else {
  backendHost = {
    booking : "http://" + window.location.hostname + ":3000",
    room : "http://" + window.location.hostname + ":3001",
    search : "http://" + window.location.hostname + ":3002",
    auth : "http://" + window.location.hostname + ":3004/auth",
    report : "http://" + window.location.hostname + ":3005"
  }  
}

export const API_ROOT = backendHost;