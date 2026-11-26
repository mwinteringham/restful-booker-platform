import React from 'react';
import MessageList from '../components/admin/MessageList';
import { render, waitFor, fireEvent } from '@testing-library/react';

describe('MessageList Component', () => {
  const mockMessages = {
    messages: [
      {
        "id": 1,
        "name": "Mark Winteringham",
        "subject": "Subject description here",
        "read": true
      }, {
        "id": 2,
        "name": "James Dean",
        "subject": "Another description here",
        "read": false
      }, {
        "id": 3,
        "name": "Janet Samson",
        "subject": "Lorem ipsum dolores est",
        "read": true
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial messages fetch
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMessages)
      }));
  });

  test('Renders the list of messages correctly', async () => {
    const { asFragment, getByTestId } = render(<MessageList />);

    await waitFor(() => expect(getByTestId(/messageDescription0/)).toBeInTheDocument());
    expect(asFragment()).toMatchSnapshot();
  });

  test('Deletes message when selected to delete', async () => {
    // Mock delete request and subsequent messages fetch
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMessages)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          messages: mockMessages.messages.slice(1)
        })
      }));
    
    const { getByTestId } = render(<MessageList />);
    
    await waitFor(() => fireEvent.click(getByTestId(/DeleteMessage0/)));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/ui-api/message/1', {
        method: 'DELETE'
      });
    });
  });

  test('Clicking message shows message popup', async () => {
    const messageDetails = {
      name: "Mark Winteringham",
      email: "mark@email.com",
      phone: "01234556789",
      subject: "Subject here",
      description: "Lorem ipsum"
    };

    // Mock initial messages fetch and message details fetch
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMessages)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(messageDetails)
      }));

    const { asFragment, getByTestId } = render(<MessageList />);

    await waitFor(() => { fireEvent.click(getByTestId(/message0/))});

    expect(asFragment()).toMatchSnapshot();
  });
});
