import React from 'react';
import LoginComponent from '../../components/admin/Login';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('Login component is created', () => {
    const { asFragment } = render(
        <BrowserRouter>
            <LoginComponent setAuthenticate={() => {}} />
        </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

test('Login component sends correct payload', async () => {
    // Mock the fetch response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: '123ABC' })
        })
    ) as jest.Mock;

    const { getByTestId } = render(
        <BrowserRouter>
            <LoginComponent setAuthenticate={() => {}} />
        </BrowserRouter>
    );

    // Fill in the LoginComponent form fields and submit it
    fireEvent.change(getByTestId('username'), { target: { value: 'admin' } });
    fireEvent.change(getByTestId('password'), { target: { value: 'password' } });
    fireEvent.click(getByTestId('submit'));

    // Check if fetch was called with the correct payload
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
        'http://localhost/auth/login',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": "admin",
                "password": "password"
            })
        }
    ));
});
