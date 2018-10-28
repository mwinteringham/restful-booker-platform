import React from 'react';
import RoomReport from './RoomReport.jsx';

export default class Report extends React.Component {

  constructor(){
    super();
    
    this.state = {
        year : 2018,
        report : [{
          room : "101",
          values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2019-02-01' }
          ]
        }, {
          room : "102",
          values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2018-02-01' }
          ]
        }, {
          room : "103",
          values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2018-02-01' }
          ]
        }, {
          room : "104",
          values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2018-02-01' }
          ]
        }]
    }

    this.increaseYear.bind(this);
    this.decreaseYear.bind(this);
  }

  componentDidMount(){
    // fetch(API_ROOT.report + '/report/')
    // .then(res => res.json())
    // .then(body => {
    //     this.setState({ data : {
    //         labels: body.rooms,
    //         datasets: [
    //             {
    //                 label: "Total price",
    //                 data: body.totals,
    //                 fillColor: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    //             }
    //         ]
    //     }
    //     });
    // });
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
    return <div style={{paddingBottom : "30px"}}>
            <h2 style={{textAlign : "center"}}><button id="lastYear" className="btn btn-light" onClick={() => this.decreaseYear()}> &lt; </button> {this.state.year} <button id="nextYear" className="btn btn-light" onClick={() => this.increaseYear()}> &gt; </button></h2>

            {this.state.report.map((report) => {
              return <div key={report.room}><RoomReport year={this.state.year} roomReport={report} /></div>
            })}
          </div>
  }
}