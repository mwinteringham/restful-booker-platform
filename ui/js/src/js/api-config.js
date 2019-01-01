let backendHost;
let welcome;

const hostname = window && window.location && window.location.hostname;

if(hostname !== 'localhost') {
  backendHost = {
    booking : "https://" + window.location.hostname,
    room : "https://" + window.location.hostname,
    auth : "https://" + window.location.hostname + "/auth",
    report : "https://" + window.location.hostname,
  }

  welcome = true;
} else {
  backendHost = {
    booking : "http://" + window.location.hostname + ":3000",
    room : "http://" + window.location.hostname + ":3001",
    auth : "http://" + window.location.hostname + ":3004/auth",
    report : "http://" + window.location.hostname + ":3005"
  }

  welcome = false;
}

export const API_ROOT = backendHost;
export const SHOW_WELCOME = welcome;