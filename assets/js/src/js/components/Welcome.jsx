import React from 'react';
import Popup from "reactjs-popup";
import Cookies from 'universal-cookie';
import glassIcon from '../../images/glass.png';
import bracketsIcon from '../../images/brackets.png';
import blockIcon from '../../images/block.png';
import goArrowIcon from '../../images/goarrow.png';

export default class Welcome extends React.Component {

    constructor(){
        super();

        this.state = {
            page : 0
        }

        this.closeModal = this.closeModal.bind(this);
        this.increasePage = this.increasePage.bind(this);
        this.decreasePage = this.decreasePage.bind(this);
    }

    increasePage(){
        const up = this.state.page + 1;

        this.setState({
            page : up
        })
    }

    decreasePage(){
        const down = this.state.page - 1;

        this.setState({
            page : down
        })
    }

    closeModal(){
        const cookies = new Cookies();
        cookies.set('welcome', true, { path: '/' });

        this.props.setWelcome(false);
    }

    render(){
		let content = null;
        let buttons = null;

        switch(this.state.page){
            case 0:
                content = <div className="col-sm-10 content">
                            <br />
                            <br />
                            <h2>Welcome to Restful Booker Platform</h2>
                            <br />
                            <br />
                            <h4>Your one stop shop to practise Software Testing!</h4>
                          </div>

                buttons = <div>
                            <div className="btn-group mr-2" role="group">
                                <button id="prev" className="btn btn-outline-primary disabled" onClick={this.decreasePage}>Prev</button>
                                <button id="next" className="btn btn-outline-primary" onClick={this.increasePage}>Next</button>
                            </div>
                          </div>
                break;
            case 1: 
                content = <div className="col-sm-10 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={glassIcon} alt="Magnifying glass" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Exploration: </span> Testing is more than just finding bugs. With Restful-booker-platform you can use it to hone your exploratory testing skills by diving into the application to find out more about how it works. There are many features for you to explore, with more being continuously added. So there will always be something else to explore!</p>
                          </div>

                buttons = <div>
                            <div className="btn-group mr-2" role="group">
                                <button id="prev" className="btn btn-outline-primary" onClick={this.decreasePage}>Prev</button>
                                <button id="next" className="btn btn-outline-primary" onClick={this.increasePage}>Next</button>
                            </div>
                          </div>
                break;
            case 2: 
                content = <div className="col-sm-10 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={bracketsIcon} alt="Brackets" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Automation:</span> Restful-booker-platform is an open source application and it offers a range of different technologies that you can automate against, either online or via a locally deployed instance.</p>
                            <p>Check out the <a href="https://github.com/mwinteringham/restful-booker-platform" alt="Restful booker platform source code">restful-booker-platform source code</a> to learn more about the various APIs and JavaScript features to practise your Automation in Testing skills.</p>
                          </div>

                buttons = <div>
                            <div className="btn-group mr-2" role="group">
                                <button id="prev" className="btn btn-outline-primary" onClick={this.decreasePage}>Prev</button>
                                <button id="next" className="btn btn-outline-primary" onClick={this.increasePage}>Next</button>
                            </div>
                          </div>
                break;
            case 3:
                content = <div className="col-sm-10 content">
                            <br />
                            <img style={{height : "60px", marginLeft : "auto", marginRight : "auto", display : "block"}} src={blockIcon} alt="Building blocks" />
                            <br />
                            <p><span style={{fontWeight: "bold"}}>Infrastructure:</span> Restful-booker-platform is a continuously deployed application using CircleCi, Docker and Kubernetes. All the deployment assets can be found in the <a href="https://github.com/mwinteringham/restful-booker-platform" alt="Restful booker platform source code">restful-booker-platform source</a> repository for you to create your own pipeline. You can also learn more about the <a href="https://circleci.com/gh/mwinteringham/workflows/restful-booker-platform" alt="Circle CI build pipeline">build process in this public build pipeline</a>.</p>
                        </div>

                buttons = <div>
                            <div className="btn-group mr-2" role="group">
                                <button id="prev" className="btn btn-outline-primary" onClick={this.decreasePage}>Prev</button>
                                <button id="next" className="btn btn-outline-primary" onClick={this.increasePage}>Next</button>
                            </div>
                          </div>                
                break;
            case 4:
                content = <div className="col-sm-10 content">
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

                buttons = <div>
                            <div className="btn-group mr-2" role="group">
                                <button id="prev"  className="btn btn-outline-primary" onClick={this.decreasePage}>Prev</button>
                                <button id="closeModal" className="btn btn-outline-success" onClick={this.closeModal}>Close</button>
                            </div>
                          </div>
                break;
        }

        return(
            <Popup defaultOpen={true} closeOnEscape={false} modal closeOnDocumentClick={false}>
                <div className="modal-body welcome">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-1"></div>
                            {content}
                            <div className="col-sm-1"></div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-sm-3"></div>
                                {buttons}
                            <div className="col-sm-3"></div>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    }

}