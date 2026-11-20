import React from 'react';
import HotelContact from '../components/home/HotelContact';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const message = {
  name: 'Mark',
  email: 'email@test.com',
  phone: '018392391183',
  subject: 'I want to book a room',
  description: 'And I want a bottle of wine with the booking',
};

const contactDetails = {
  name: 'Another B&B',
  address: 'Somewhere else',
  phone: '99999999999',
  email: 'another@fakeemail.com'
};

describe('HotelContact Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders the contact form correctly', () => {
    const { getByTestId, getByText } = render(
      <HotelContact contactDetails={contactDetails} />
    );
    
    expect(getByText('Send Us a Message')).toBeInTheDocument();
    expect(getByTestId('ContactName')).toBeInTheDocument();
    expect(getByTestId('ContactEmail')).toBeInTheDocument();
    expect(getByTestId('ContactPhone')).toBeInTheDocument();
    expect(getByTestId('ContactSubject')).toBeInTheDocument();
    expect(getByTestId('ContactDescription')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  test('updates form values when user inputs data', async () => {
    const { getByTestId } = render(
      <HotelContact contactDetails={contactDetails} />
    );
    
    await act(async () => {
      fireEvent.change(getByTestId('ContactName'), { target: { value: message.name } });
      fireEvent.change(getByTestId('ContactEmail'), { target: { value: message.email } });
      fireEvent.change(getByTestId('ContactPhone'), { target: { value: message.phone } });
      fireEvent.change(getByTestId('ContactSubject'), { target: { value: message.subject } });
      fireEvent.change(getByTestId('ContactDescription'), { target: { value: message.description } });
    });
    
    expect(getByTestId('ContactName')).toHaveValue(message.name);
    expect(getByTestId('ContactEmail')).toHaveValue(message.email);
    expect(getByTestId('ContactPhone')).toHaveValue(message.phone);
    expect(getByTestId('ContactSubject')).toHaveValue(message.subject);
    expect(getByTestId('ContactDescription')).toHaveValue(message.description);
  });

  test('Contact form sends request to message API', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        status: 201
      }));

    const { getByText, getByTestId } = render(
      <HotelContact contactDetails={contactDetails} />
    );
  
    await act(async () => {
      fireEvent.change(getByTestId('ContactName'), { target: { value: message.name } });
      fireEvent.change(getByTestId('ContactEmail'), { target: { value: message.email } });
      fireEvent.change(getByTestId('ContactPhone'), { target: { value: message.phone } });
      fireEvent.change(getByTestId('ContactSubject'), { target: { value: message.subject } });
      fireEvent.change(getByTestId('ContactDescription'), { target: { value: message.description } });
    });

    await act(async () => {
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/message',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        }
      );
    });
  });

  test('shows success message after successful submission', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        status: 201
      })
    );

    const { getByText, getByTestId } = render(
      <HotelContact contactDetails={contactDetails} />
    );
    
    await act(async () => {
      fireEvent.change(getByTestId('ContactName'), { target: { value: message.name } });
      fireEvent.change(getByTestId('ContactEmail'), { target: { value: message.email } });
      fireEvent.change(getByTestId('ContactPhone'), { target: { value: message.phone } });
      fireEvent.change(getByTestId('ContactSubject'), { target: { value: message.subject } });
      fireEvent.change(getByTestId('ContactDescription'), { target: { value: message.description } });
    });

    await act(async () => {
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => {
      expect(getByText(`Thanks for getting in touch ${message.name}!`)).toBeInTheDocument();
      expect(getByText('We\'ll get back to you about')).toBeInTheDocument();
      expect(getByText(message.subject)).toBeInTheDocument();
      expect(getByText('as soon as possible.')).toBeInTheDocument();
    });
  });

  test('displays error message when API request fails', async () => {
    const errorMessage = ['Name may not be blank', 'Email is required'];
    
    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorMessage)
      })
    );

    const { getByText, getByTestId } = render(
      <HotelContact contactDetails={contactDetails} />
    );
    
    await act(async () => {
      fireEvent.change(getByTestId('ContactName'), { target: { value: '' } });
      fireEvent.change(getByTestId('ContactEmail'), { target: { value: '' } });
    });

    await act(async () => {
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => {
      expect(getByText('Name may not be blank')).toBeInTheDocument();
      expect(getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('handles unexpected errors during form submission', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      throw new Error('Network error');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, getByTestId } = render(
      <HotelContact contactDetails={contactDetails} />
    );
    
    await act(async () => {
      fireEvent.change(getByTestId('ContactName'), { target: { value: message.name } });
    });

    await act(async () => {
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => {
      expect(getByText('An unexpected error occurred. Please try again later.')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
