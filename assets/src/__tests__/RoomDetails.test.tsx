import React from 'react';
import RoomDetails from '../components/admin/RoomDetails';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { render, waitFor, fireEvent } from '@testing-library/react';

interface RoomObject {
  roomid: number;
  roomName: string;
  type: string;
  accessible: boolean;
  image: string;
  description: string;
  features: string[];
  roomPrice: number;
  featuresObject?: {
    WiFi: boolean;
    TV: boolean;
    Radio: boolean;
    Refreshments: boolean;
    Safe: boolean;
    Views: boolean;
    [key: string]: boolean;
  };
}

const roomObject: RoomObject = {
  roomid: 1,
  roomName: "101",
  type: "Single",
  accessible: true,
  image: "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
  description: "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
  features: ["TV, WiFi, Safe"],
  roomPrice: 100,
  featuresObject: {
    WiFi: false,
    TV: false,
    Radio: false,
    Refreshments: false,
    Safe: false,
    Views: false,
    'TV, WiFi, Safe': true
  }
};

describe('RoomDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the bookings endpoint by default
    global.fetch = jest.fn()
      .mockImplementation((url: string) => {
        if (url.includes('/ui-api/booking/')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ bookings: [] })
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(roomObject)
        });
      });
  });

  test('Room details component renders', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/admin/room/1']}>
        <Routes>
          <Route path="/admin/room/:id" element={<RoomDetails id="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText(/101/)).toBeInTheDocument());
    
    expect(asFragment()).toMatchSnapshot();
  });

  test('Room details switches into edit mode', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/admin/room/1']}>
        <Routes>
          <Route path="/admin/room/:id" element={<RoomDetails id="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText(/101/)).toBeInTheDocument());
    
    fireEvent.click(getByText(/Edit/));

    await waitFor(() => expect(getByText(/Update/)).toBeInTheDocument());

    expect(asFragment()).toMatchSnapshot();
  });

  test('Room details can be switched out of edit mode', async () => {
    const mockFetch = jest.fn((input: RequestInfo | URL, init?: RequestInit) => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(roomObject),
          status: 200,
          headers: new Headers(),
        } as Response);
    });

    global.fetch = mockFetch;

    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/admin/room/1']}>
        <Routes>
          <Route path="/admin/room/:id" element={<RoomDetails id="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText(/101/)).toBeInTheDocument());
    
    fireEvent.click(getByText(/Edit/));
    fireEvent.click(getByText(/Cancel/));

    expect(asFragment()).toMatchSnapshot();
  });

  test('Room details can render validation errors', async () => {
    const mockFetch = jest.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      
      if (url === '/ui-api/room/1' && (!init || init.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(roomObject),
          status: 200,
          headers: new Headers(),
        } as Response);
      } else if (url === '/ui-api/booking/1') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ bookings: [] }),
          status: 200,
          headers: new Headers(),
        } as Response);
      } else if (url.includes('/ui-api/room/1') && init?.method === 'PUT') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            errorCode: 400,
            errors: ["Type can only contain the room options Single, Double, Twin, Family or Suite"]
          }),
          status: 400,
          headers: new Headers(),
        } as Response);
      }
      // Default case
      return Promise.resolve({
        ok: false,
        status: 404,
        headers: new Headers(),
        json: () => Promise.resolve({ error: "Not found" })
      } as Response);
    });

    global.fetch = mockFetch;

    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/admin/room/1']}>
        <Routes>
          <Route path="/admin/room/:id" element={<RoomDetails id="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText(/101/)).toBeInTheDocument());

    fireEvent.click(getByText(/Edit/));
    fireEvent.click(getByText(/Update/));

    await waitFor(() => expect(getByText(/Type can only contain the room options/)).toBeInTheDocument());
    
    expect(asFragment()).toMatchSnapshot();
  });

  test('Room details can be submitted', async () => {
    const mockFetch = jest.fn((input: RequestInfo | URL, init?: RequestInit) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(roomObject),
        status: 200,
        headers: new Headers(),
      } as Response);
  });

    global.fetch = mockFetch;

    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin/room/1']}>
        <Routes>
          <Route path="/admin/room/:id" element={<RoomDetails id="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText(/101/)).toBeInTheDocument());

    fireEvent.click(getByText(/Edit/));
    fireEvent.click(getByText(/Update/));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/ui-api/room/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...roomObject,
            featuresObject: {
              WiFi: false,
              TV: false,
              Radio: false,
              Refreshments: false,
              Safe: false,
              Views: false,
              'TV, WiFi, Safe': true
            }
          })
        }
      );
    });
  });
});
