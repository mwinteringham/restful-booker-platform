import React from 'react';
import Footer from '../src/js/components/Footer.jsx';
import App from '../src/js/components/App.jsx';

test('App container component', () => {
    const app = shallow(
        <App />
    );

    expect(app).toMatchSnapshot();
});

test('Footer component', () => {
    const footer = shallow(
        <Footer />
    );

    expect(footer).toMatchSnapshot();
});