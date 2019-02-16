import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom'
import { API_ROOT, SHOW_WELCOME } from '../api-config';

import Nav from './Nav.jsx';
import Login from './Login.jsx'
import Report from './Report.jsx';
import Welcome from './Welcome.jsx';
import Cookies from 'universal-cookie';
import CookiePolicy from './CookiePolicy.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Loading from './Loading.jsx';
import Home from './Home.jsx';
import Branding from './Branding.jsx';
import Footer from './Footer.jsx';
import ReactModal from 'react-modal';

const RoomListings = React.lazy(() => import('./RoomListings.jsx'));
const RoomDetails = React.lazy(() => import('./RoomDetails.jsx'));

ReactModal.setAppElement('#root');

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            isAuthenticated : false,
            showWelcome : false
        }
        
        this.setAuthenticate = this.setAuthenticate.bind(this);
        this.setWelcome = this.setWelcome.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

        if(typeof cookies.get('welcome') === 'undefined' && SHOW_WELCOME){
           this.setState({
                isAuthenticated : this.state.isAuthenticated,
                showWelcome : true
            })
        }

        fetch(API_ROOT.auth + '/validate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({ token: cookies.get('token')})
            })
            .then(res => {
                if(res.status == 200){
                    this.setAuthenticate(true);
                }
            })
    }

    setAuthenticate(e){
        this.setState({
            isAuthenticated : e,
            showWelcome : this.state.showWelcome
        });
    }

    setWelcome(e){
        this.setState({
            isAuthenticated : this.state.isAuthenticated,
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
                            <div>
                                <Nav setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated} />
                                <div className="container">
                                    <div>
                                        {this.state.isAuthenticated ? (
                                            <div>
                                                <Route exact path='/admin/' render={(props) => (
                                                    <div>
                                                        <Suspense fallback={<Loading />}>
                                                            <RoomListings {...props} />
                                                        </Suspense>
                                                    </div>
                                                )} />
                                                <Route exact path='/admin/room/:id' render={({ location, match }) => (
                                                    <div>
                                                        <Suspense fallback={<Loading />}>
                                                            <RoomDetails params={match.params}/>
                                                        </Suspense>
                                                    </div>
                                                )} />
                                                <Route exact path='/admin/report' component={Report} />
                                                <Route exact path='/admin/branding' component={Branding} />
                                            </div>
                                        ) : (
                                            <div>
                                                <Login setAuthenticate={this.setAuthenticate} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
