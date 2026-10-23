import React from 'react';
import {
    render,
    fireEvent,
    cleanup
} from '@testing-library/react';
import BookingListing from '../../components/admin/BookingListing';
import contract from './contract.json';

test('Rooms list component', () => {
    const booking = render(
        <BookingListing booking={contract} getBookings={() => {}}/>
    );

    expect(booking).toMatchSnapshot();
});
