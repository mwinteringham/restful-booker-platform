import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { SHOW_WELCOME } from '../api-config';
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';
import { createBrowserHistory as createHistory } from 'history'
import ReactGA from 'react-ga';

import AdminContainer from './AdminContainer.jsx';
import Welcome from './Welcome.jsx';
import CookiePolicy from './CookiePolicy.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Home from './Home.jsx';
import Footer from './Footer.jsx';

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

const history = createHistory();

ReactGA.initialize('UA-118712228-3');

history.listen((location) => {
    ReactGA.pageview(location.pathname + location.hash);
});

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            showWelcome : false
        }
        
        this.setWelcome = this.setWelcome.bind(this);

        ReactGA.pageview(window.location.pathname + window.location.hash);
    }

    componentDidMount(){
        const cookies = new Cookies();

        if(typeof cookies.get('welcome') === 'undefined' && SHOW_WELCOME){
           this.setState({
                showWelcome : true
            })
        }
    }

    setWelcome(e){
        this.setState({
            showWelcome : e
        });
    }

    render() {
        let welcome = null;

        if(this.state.showWelcome){
            welcome = <div>
                <Welcome setWelcome={this.setWelcome} />
            </div>
        }

        return(
            <HashRouter>
                {welcome}
                    <Switch>
                        <Route path='/admin/' render={() => (
                            <AdminContainer />
                        )} />
                        <Route exact path='/' component={Home} />
                        <Route exact path='/cookie' component={CookiePolicy} />
                        <Route exact path='/privacy' component={PrivacyPolicy} />
                    </Switch>
                <Footer />
            </HashRouter>
        );
    }
}
