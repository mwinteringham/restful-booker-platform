import React from 'react';
import Cookies from 'universal-cookie';
import glassIcon from '../../images/glass.png';
import bracketsIcon from '../../images/brackets.png';
import blockIcon from '../../images/block.png';
import goArrowIcon from '../../images/goarrow.png';

export default class Banner extends React.Component {

    constructor(){
        super();

        this.closeBanner = this.closeBanner.bind(this);
    }

    closeBanner(){
        let date = new Date()
        date.setDate(date.getDate() + 1);

        const cookies = new Cookies();
        cookies.set('banner', true, { path: '/', expires: date, sameSite : 'strict'});

        this.props.setWelcome(false);
    }

    render(){
        return <div className="collapse show" id="collapseBanner">
                <div className="jumbotron">
                    <div className="row">
                        <div className="col-12">
                            <h1>Welcome to Restful Booker Platform</h1>
                            <h4>Your one stop shop to practise Software Testing!</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={glassIcon} alt="Magnifying glass" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Exploration: </span> Testing is more than just finding bugs. With Restful-booker-platform you can use it to hone your exploratory testing skills by diving into the application to find out more about how it works. There are many features for you to explore, with more being continuously added. So there will always be something new to explore!</p>
                        </div>
                        <div className="col-sm-3 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={bracketsIcon} alt="Brackets" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Automation:</span> Restful-booker-platform is an open source application and it offers a range of different technologies that you can automate against, either online or via a locally deployed instance.</p>
                            <p>Check out the <a href="https://github.com/mwinteringham/restful-booker-platform" alt="Restful booker platform source code">restful-booker-platform source code</a> to learn more about the various APIs and JavaScript features to practise your Automation in Testing skills.</p>
                        </div>
                        <div className="col-sm-3 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={blockIcon} alt="Building blocks" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Infrastructure:</span> Restful-booker-platform is a continuously deployed application using CircleCi, Docker and Kubernetes. All the deployment assets can be found in the <a href="https://github.com/mwinteringham/restful-booker-platform" alt="Restful booker platform source code">restful-booker-platform source</a> repository for you to create your own pipeline. You can also learn more about the <a href="https://circleci.com/gh/mwinteringham/workflows/restful-booker-platform" alt="Circle CI build pipeline">build process in this public build pipeline</a>.</p>
                        </div>
                        <div className="col-sm-3 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={goArrowIcon} alt="Go arrow" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Get Started:</span> How you use this application is up to you, but here are a few things to get you started:</p>
                            <ul>
                                <li>Explore the <a href="https://automationintesting.online" alt="Link to home page">home page</a></li>
                                <li>Access the <a href="https://automationintesting.online/#/admin" alt="Link to admin page">admin panel</a> with the credentials admin/password</li>
                                <li>You can <a href="https://github.com/mwinteringham/restful-booker-platform/projects/1" alt="Link to RBP project">read more about the features here</a></li>
                                <li>If you find a particularly bad bug, <a href="https://github.com/mwinteringham/restful-booker-platform/issues" alt="Bug tracker">feel free to raise it here</a></li>
                            </ul>
                            <p><span style={{fontWeight: "bold"}}>Please note:</span> for security reasons the database resets every 10 minutes.</p>
                          </div>
                    </div>
                    <div className="row">
                        <div className="col-5"></div>
                        <div className="col-2 text-center" data-toggle="collapse" data-target="#collapseBanner" aria-expanded="false" aria-controls="collapseBanner">
                            <button type="button" className="btn btn-primary" onClick={this.closeBanner}>Let me hack!</button>
                        </div>
                        <div className="col-5"></div>
                    </div>
                </div>
            </div>
    }

}