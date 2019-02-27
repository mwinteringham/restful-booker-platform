import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { HashRouter } from 'react-router-dom';
import '../styles/style.scss';

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));