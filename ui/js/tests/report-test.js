import React from 'react';
import Report from '../src/js/components/Report.jsx';
import moment from 'moment';

test('Multiple reports can be created in the Report component', () => {
    const multipleReports = {
      currentTimestamp : moment("2019-01-01"),
      report : [
        {
          start: "2019-04-01",
          end: "2019-04-03",
          title: "101"
        },{
          start: "2019-04-02",
          end: "2019-04-04",
          title: "102"
        },{
          start: "2019-04-02",
          end: "2019-04-04",
          title: "103"
        }
      ]
    }

    const reportComponent = shallow(
        <Report />
    )

    reportComponent.setState(multipleReports);
    reportComponent.update();

    expect(reportComponent).toMatchSnapshot();
});