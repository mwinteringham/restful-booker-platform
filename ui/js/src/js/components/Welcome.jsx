import React from 'react';
import Popup from "reactjs-popup";

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
        this.props.setWelcome(false);
    }

    render(){
		console.log(this.state.page)

        let content = null;
        let buttons = null;

        switch(this.state.page){
            case 0:
                content = <div className="col-md-10 content">
                            <h2>Welcome to Shady Meadows Booking Manager</h2>
                            <p>Shady Meadows Booking Manager is a free to use booking manager that allows you to practise your testing and automation skills.</p>
                          </div>

                buttons = <div>
                            <div className="col-sm-3"></div>
                            <div className="col-sm-1">
                                <button id="next" style={{margin : "0 auto", display : "block" }} onClick={this.increasePage}>Next</button>
                            </div>
                          </div>
                break;
            case 1: 
                content = <div className="col-md-10 content">
                            <h2>Exploring</h2>
                            <p>Testing is more than just finding bugs. Take time to hone your exploratory testing skills by diving into Shady Meadows Booking Manager to find out more about how the application works.</p>
                          </div>

                buttons = <div>
                            <div className="col-sm-1">
                                <button id="prev" style={{margin : "0 auto", display : "block" }} onClick={this.decreasePage}>Prev</button>
                            </div>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-1">
                                <button id="next" style={{margin : "0 auto", display : "block" }} onClick={this.increasePage}>Next</button>
                            </div>
                          </div>
                break;
            case 2:
                content = <div className="col-md-10 content">
                            <h2 >Automation</h2>
                            <p>Shady Meadows Booking Manager is an instance of the Open source application, restful-booker-platform. RBP offers a range of different technologies that you automate against, either online or via a locally deployed instance.</p>
                            <p>Check out the <a href="https://github.com/mwinteringham/restful-booker-platform" alt="Restful booker platform source code">restful-booker-platform source</a> to learn more about the various APIs and JavaScript features to practise your Automation in Testing skills.</p>
                          </div>

                buttons = <div>
                            <div className="col-sm-1">
                                <button id="prev" style={{margin : "0 auto", display : "block" }} onClick={this.decreasePage}>Prev</button>
                            </div>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-1">
                                <button id="next" style={{margin : "0 auto", display : "block" }} onClick={this.increasePage}>Next</button>
                            </div>
                          </div>
                break;
            case 3:
                content = <div className="col-md-10 content">
                            <h2>Infrastructure</h2>
                            <p>Shady Meadows Booking Manager is a continuously deployed application using CircleCi, Docker and Kubernetes. All the deployment assets can be found in the <a href="https://github.com/mwinteringham/restful-booker-platform" alt="Restful booker platform source code">restful-booker-platform source</a> repository for you to create your own pipeline. You can also learn more about the <a href="https://circleci.com/gh/mwinteringham/workflows/restful-booker-platform" alt="Circle CI build pipeline">build process in this public build pipeline</a>.</p>
                        </div>

                buttons = <div>
                            <div className="col-sm-1">
                                <button id="prev" style={{margin : "0 auto", display : "block" }} onClick={this.decreasePage}>Prev</button>
                            </div>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-1">
                                <button id="next" style={{margin : "0 auto", display : "block" }} onClick={this.increasePage}>Next</button>
                            </div>
                          </div>                
                break;
            case 4:
                content = <div className="col-md-10 content">
                            <h2>Getting Started</h2>
                            <p>To log into the application use the credentials admin/password and begin your journey! Please note for security purposes the database resets itself every 10 minutes.</p>
                            <br />
                            <p>To learn more about Automation in Testing, a mindset and namespace that helps you Strategise, Create, Use and Educate others in how, where and when to automate. Check out the <a href="https://automationintesting.com" alt="Automation in testing site">Automation in Testing website</a></p>
                          </div>

                buttons = <div>
                            <div className="col-sm-1">
                                <button id="prev" style={{margin : "0 auto", display : "block" }} onClick={this.decreasePage}>Prev</button>
                            </div>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-1">
                                <button id="closeModal" style={{margin : "0 auto", display : "block" }} onClick={this.closeModal}>Close</button>
                            </div>
                          </div>
                break;
        }

        return(
            <Popup defaultOpen={true} closeOnEscape={false} modal closeOnDocumentClick={false}>
                <div className="modal-body welcome">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-1"></div>
                            {content}
                            <div className="col-md-1"></div>
                        </div>
                        <div className="row">
                            <div className="col-md-4"></div>
                                {buttons}
                            <div className="col-md-4"></div>
                        </div>
                    </div>
                </div>
            </Popup>
        )
    }

}