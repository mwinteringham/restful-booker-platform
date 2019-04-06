let backendHost;
let welcome = true;

if(window.location.origin.match('localhost')) {
  welcome = false;
}

export const API_ROOT = window.location.origin;
export const SHOW_WELCOME = welcome;