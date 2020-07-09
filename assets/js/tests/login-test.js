import React from 'react'
import nock from 'nock'
import {
  render,
  fireEvent,
  cleanup
} from '@testing-library/react'

import Login from '../src/js/components/Login.jsx';

afterEach(cleanup);

test('Trialling react-testing-library', () =>{
    let authMock = nock('http://localhost')
                    .post('/auth/login', {username: 'admin', password: 'password'})
                    .reply(200, {"token":"mGsbqXmSghijf0Ln"});

    const {getByTestId} = render(
        <Login setAuthenticate={()=>{}} />,
    )

    fireEvent.change(getByTestId('username'), { target: { value: 'admin' } });
    fireEvent.change(getByTestId('password'), { target: { value: 'password' } });
    fireEvent.click(getByTestId('submit'));

    setImmediate(() => {
      let didNockAcceptRequest = authMock.isDone();
      expect(didNockAcceptRequest).toBe(true);
    });
});