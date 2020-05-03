import React from 'react';
import Report from '../src/js/components/Report.jsx';
import moment from 'moment/moment';
import nock from 'nock';

test('Multiple reports can be created in the Report component', (done) => {
    nock('http://localhost')
      .get('/report/')
      .reply(200,  {
        currentTimestamp : moment.utc([2019, 0, 1, 1]),
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
      });

    const reportComponent = shallow(
        <Report />
    )

    setTimeout(() => {
      expect(reportComponent).toMatchSnapshot();
      done()
    }, 100);
});