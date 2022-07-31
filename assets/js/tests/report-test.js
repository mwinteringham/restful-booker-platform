import React from 'react';
import Report from '../src/js/components/Report.js';
import nock from 'nock';
import '@testing-library/jest-dom'

import {
  render, waitFor
} from '@testing-library/react'

test('Multiple reports can be created in the Report component', async () => {
    const mockReport = nock('http://localhost')
                        .get('/report/')
                        .reply(200,  {
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

    const {asFragment, getByText} = render(
        <Report defaultDate={new Date("2019-04-02") } />
    )

    await waitFor(() => {expect(mockReport.isDone()).toBeTruthy()})
    await getByText(/103/)

    expect(asFragment()).toMatchSnapshot();
});
