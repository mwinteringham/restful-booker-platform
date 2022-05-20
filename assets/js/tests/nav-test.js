import React from 'react';
import Nav from '../src/js/components/Nav.js';
import { BrowserRouter } from 'react-router-dom';
import {
    render
  } from '@testing-library/react'

test('Nav bar renders', () => {
    const {asFragment} = render(
        <BrowserRouter><Nav setCount={() => {}} isAuthenticated={true} /></BrowserRouter>
    )

    expect(asFragment()).toMatchSnapshot();
})