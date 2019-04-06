import React from 'react';
import RoomReport from './RoomReport.jsx';
import { API_ROOT } from '../api-config';
const fetch = require('node-fetch')

export default class Report extends React.Component {

  constructor(){
    super();
    
    this.state = {
        year : 2019,
        report : []
    }

    this.increaseYear.bind(this);
    this.decreaseYear.bind(this);
  }

  componentDidMount(){
    fetch(API_ROOT + '/report/')
      .then(res => res.json())
      .then(body => {
        this.setState({ report : body.report });
      });
  }

  increaseYear(){
    this.setState({
      year : this.state.year + 1
    })
  }

  decreaseYear(){
    this.setState({
      year : this.state.year - 1
    })
  }

  render(){
    let report;

    if(this.state.report.length === 0){
      report = <h2>Building report</h2>
    } else {
      report = <div style={{paddingBottom : "30px"}}>
                <h2 style={{textAlign : "center"}}><button id="lastYear" className="btn btn-light" onClick={() => this.decreaseYear()}> &lt; </button> {this.state.year} <button id="nextYear" className="btn btn-light" onClick={() => this.increaseYear()}> &gt; </button></h2>

                {this.state.report.map((report) => {
                  return <div key={report.room}><RoomReport year={this.state.year} roomReport={report} /></div>
                })}
              </div>
    }

    return report
  }
}