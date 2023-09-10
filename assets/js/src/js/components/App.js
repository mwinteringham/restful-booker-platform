import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';

const AdminContainer = React.lazy(() => import('./AdminContainer.js'));
const CookiePolicy = React.lazy(() => import('./CookiePolicy.js'));
const PrivacyPolicy = React.lazy(() => import('./PrivacyPolicy.js'));

import Banner from './Banner.js';
import Home from './Home.js';
import Footer from './Footer.js';

import Loading from './Loading.js';

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

const App = () => {
    
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
                    <Route path='/admin/*' element={<React.Suspense fallback={<Loading />}><AdminContainer /></React.Suspense>} />
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/cookie' element={<React.Suspense fallback={<Loading />}><CookiePolicy /></React.Suspense>} />
                    <Route exact path='/privacy' element={<React.Suspense fallback={<Loading />}><PrivacyPolicy /></React.Suspense>} />
                </Routes>
            <Footer />
        </HashRouter>
    );
}

export default App;
