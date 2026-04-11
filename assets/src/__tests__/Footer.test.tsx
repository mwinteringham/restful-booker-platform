import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import '@testing-library/jest-dom';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the package.json import
jest.mock('../../package.json', () => ({
  version: '2.0.0'
}));

describe('Footer Component', () => {
  const mockBranding = {
    name: 'Test B&B',
    logoUrl: '/logo.png',
    description: 'A lovely place to stay',
    map: {
      latitude: 51.5074,
      longitude: -0.1278
    },
    directions: 'Turn left, then right',
    contact: {
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com'
    },
    address: {
      line1: '123 Test Street',
      line2: 'Test Village',
      postTown: 'Testington',
      county: 'Testshire',
      postCode: 'TE1 1ST'
    }
  };

  it('renders the B&B name correctly', () => {
    render(<Footer branding={mockBranding} />);
    expect(screen.getByText('Test B&B')).toBeInTheDocument();
  });

  it('renders the B&B description correctly', () => {
    render(<Footer branding={mockBranding} />);
    expect(screen.getByText('A lovely place to stay')).toBeInTheDocument();
  });

  it('renders the contact information correctly', () => {
    render(<Footer branding={mockBranding} />);
    
    // Check for address
    const addressText = `${mockBranding.address.line1}, ${mockBranding.address.line2}, ${mockBranding.address.postTown}, ${mockBranding.address.county}, ${mockBranding.address.postCode}`;
    expect(screen.getByText(addressText)).toBeInTheDocument();
    
    // Check for phone
    expect(screen.getByText(mockBranding.contact.phone)).toBeInTheDocument();
    
    // Check for email
    expect(screen.getByText(mockBranding.contact.email)).toBeInTheDocument();
  });

  it('renders quick links section correctly', () => {
    render(<Footer branding={mockBranding} />);
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders version number and copyright info', () => {
    render(<Footer branding={mockBranding} />);
    
    // Check for version
    expect(screen.getByText(/restful-booker-platform v/)).toBeInTheDocument();
    
    // Check for copyright year range
    expect(screen.getByText(/©\s+2019-26/)).toBeInTheDocument();
    
    // Check for creator
    expect(screen.getByText('Mark Winteringham')).toBeInTheDocument();
  });

  it('renders policy and admin links', () => {
    render(<Footer branding={mockBranding} />);
    
    // Get links by their text content
    const cookieLink = screen.getByText('Cookie-Policy');
    const privacyLink = screen.getByText('Privacy-Policy');
    const adminLink = screen.getByText('Admin panel');
    
    // Check if links have correct href
    expect(cookieLink).toHaveAttribute('href', '/cookie');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(adminLink).toHaveAttribute('href', '/admin');
  });
});