import React from 'react';
import Nav from '../src/js/components/Nav.jsx';

test('Nav bar renders', () => {
    let navComponent = shallow(<Nav />);

    expect(navComponent).toMatchSnapshot();
})