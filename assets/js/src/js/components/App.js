import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';
import { createBrowserHistory as createHistory } from 'history'
import ReactGA from 'react-ga';

import AdminContainer from './AdminContainer.js';
import CookiePolicy from './CookiePolicy.js';
import PrivacyPolicy from './PrivacyPolicy.js';
import Banner from './Banner.js';
import Home from './Home.js';
import Footer from './Footer.js';

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

const history = createHistory();

ReactGA.initialize('UA-118712228-3');

history.listen((location) => {
    ReactGA.pageview(location.pathname + location.hash);
});

const App = () => {
    
    ReactGA.pageview(window.location.pathname + window.location.hash);
    const [showBanner, toggleBanner] = useState(false);

    useEffect(() => {
        const cookies = new Cookies();
    
        if(typeof cookies.get('banner') === 'undefined'){
            toggleBanner(true);
        }
    }, [])

    let welcome = null;

    if(showBanner){
        welcome = <div>
            <Banner setWelcome={toggleBanner}/>
        </div>
    }

    return(
        <HashRouter>
            {welcome}
                <Routes>
                    <Route path='/admin/*' element={<AdminContainer />} />
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/cookie' element={<CookiePolicy />} />
                    <Route exact path='/privacy' element={<PrivacyPolicy />} />
                </Routes>
            <Footer />
        </HashRouter>
    );
}

export default App;
