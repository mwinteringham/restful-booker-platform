import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import Footer from './components/Footer.jsx';
import { HashRouter } from 'react-router-dom';
import '../styles/style.scss';

ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));

ReactDOM.render((
  <Footer />
), document.getElementById('footer'));