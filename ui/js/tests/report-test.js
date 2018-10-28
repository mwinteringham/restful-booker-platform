import React from 'react';
import RoomReport from '../src/js/components/RoomReport.jsx';
import Report from '../src/js/components/Report.jsx';

test('Report for individual room renders', () => {
    const reportDetails = {
        room : "101",
        values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2019-02-01' }
        ]
    }

    const roomReportComponent = shallow(
        <RoomReport year={2018} roomReport={reportDetails} />
    )

    expect(roomReportComponent).toMatchSnapshot();
});

test('Multiple reports can be created in the Report component', () => {
    const multipleReports = {
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
        }]
    }

    const reportComponent = shallow(
        <Report />
    )

    reportComponent.setState(multipleReports);
    reportComponent.update();

    expect(reportComponent).toMatchSnapshot();
});

test('Moving forward a year by selecting button', () => {
    const multipleReports = {
        year : 2018,
        report : [{
          room : "101",
          values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2019-02-01' }
          ]
        }]
    }

    const reportComponent = shallow(
        <Report />
    )

    reportComponent.setState(multipleReports);
    reportComponent.update();

    reportComponent.find('#nextYear').simulate('click');

    const newDate = reportComponent.state().year;

    expect(newDate).toBe(2019);
});

test('Moving backward a year by selecting button', () => {
    const multipleReports = {
        year : 2018,
        report : [{
          room : "101",
          values : [
            { date: '2018-01-01' },
            { date: '2018-01-02' },
            { date: '2019-02-01' }
          ]
        }]
    }

    const reportComponent = shallow(
        <Report />
    )

    reportComponent.setState(multipleReports);
    reportComponent.update();

    reportComponent.find('#lastYear').simulate('click');

    const newDate = reportComponent.state().year;

    expect(newDate).toBe(2017);
});