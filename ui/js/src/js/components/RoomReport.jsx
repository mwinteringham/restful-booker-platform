import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip'

export default class RoomReport extends React.Component {

  constructor(){
    super();
  }

  render(){
    const customTitleForValue = (value) => {
      return value ? `${value.date} booked` : null;
    }

    const customTooltipDataAttrs = (value) => (value.count !== null ? {'data-tip': `${value.date} is already booked`} : {'data-tip': `No bookings on this date`});

    return <div>
                <h3>Room: {this.props.roomReport.room}</h3>
            
              <CalendarHeatmap
                startDate={new Date((this.props.year -1) + '-12-31')}
                endDate={new Date(this.props.year + '-12-31')}
                values={this.props.roomReport.values}
                titleForValue={customTitleForValue}
                tooltipDataAttrs={customTooltipDataAttrs}
              />
              <ReactTooltip place="top" type="dark" effect="float"/>
          </div>
  }
}