import React, { useState } from 'react';
import Cookies from 'universal-cookie';

interface LoginProps {
  setAuthenticate: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuthenticate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/ui-api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const cookies = new Cookies();
        cookies.set('token', data.token, { path: '/' });
        
        setAuthenticate(true);
        window.location.href = '/admin/rooms';
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
    }
  };

  return (
    <div className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <div className="card">
          <div className="card-header">
            <h2>Login</h2>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                Invalid credentials
              </div>
            )}
            <form onSubmit={doLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="mt-2">Password</label>
                <input
                  type="password"
                  className="form-control mt-2"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" id="doLogin" className="btn btn-primary mt-3">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-sm-2"></div>
    </div>
  );
};

export default Login; 