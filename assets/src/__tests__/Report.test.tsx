import React from 'react';
import Report from '../components/admin/Report';
import { render, waitFor, screen } from '@testing-library/react';

interface ReportItem {
  start: string;
  end: string;
  title: string;
}

describe('Report Component', () => {
  test('Multiple reports can be created in the Report component', async () => {
    // Setup mock response
    const mockReports: ReportItem[] = [
      {
        start: "2019-04-01",
        end: "2019-04-03",
        title: "101"
      },
      {
        start: "2019-04-02",
        end: "2019-04-04",
        title: "102"
      },
      {
        start: "2019-04-02",
        end: "2019-04-04",
        title: "103"
      }
    ];

    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ report: mockReports })
      })
    );

    render(
      <div id="root-container">
        <Report defaultDate={new Date("2019-04-02")} />
      </div>
    );

    // Wait for fetch mock to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/ui-api/report');
    });

    const items = await screen.findAllByText(/103/);
    expect(items).toHaveLength(1);
  });
});
