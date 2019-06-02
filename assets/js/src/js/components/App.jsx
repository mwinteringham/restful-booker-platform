import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { SHOW_WELCOME } from '../api-config';
import ReactModal from 'react-modal';
import Cookies from 'universal-cookie';

import AdminContainer from './AdminContainer.jsx';
import Welcome from './Welcome.jsx';
import CookiePolicy from './CookiePolicy.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Home from './Home.jsx';
import Footer from './Footer.jsx';

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            showWelcome : false
        }
        
        this.setWelcome = this.setWelcome.bind(this);
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
            <div>
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
            </div>
        );
    }
}
