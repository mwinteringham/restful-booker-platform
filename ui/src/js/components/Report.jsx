import React from 'react';
var BarChart = require("react-chartjs").Bar;

export default class Report extends React.Component {

    constructor(){
        super();
        
        this.state = {
            data : {},
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scaleShowLabels: true
            }
        }
    }

    componentDidMount(){
        fetch('http://' + window.location.hostname + ':3005/report')
		.then(res => res.json())
        .then(body => {
            this.setState({ data : {
                labels: body.hotels,
                datasets: [
                    {
                        label: "Total price",
                        data: body.totals,
                        fillColor: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
                    }
                ]
            }
            });
        });
    }

    render(){
        if(this.state.data.labels != null){
            return <BarChart data={this.state.data} options={this.state.options} />
        } else {
            return <h1>No report data to show</h1>
        }
    }

}