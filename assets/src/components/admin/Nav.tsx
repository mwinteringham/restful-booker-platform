import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'universal-cookie';

interface NavProps {
  setAuthenticate: (value: boolean) => void;
  isAuthenticated: boolean | null;
}

const Nav: React.FC<NavProps> = ({ setAuthenticate, isAuthenticated }) => {
  const pathname = usePathname();
  const [messageCount, setMessageCount] = useState(0);

  const fetchMessageCount = async () => {
    try {
      const response = await fetch('/ui-api/message/count', {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessageCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching message count:', error);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchMessageCount();
    }
  }, [isAuthenticated]);

  // Expose the fetchMessageCount function globally
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateMessageCount = fetchMessageCount;
    }
  }, []);

  const doLogout = async () => {
    try {
      // Call the auth/logout endpoint
      await fetch('/ui-api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Continue with local logout regardless of API success
      const cookies = new Cookies();
      cookies.remove('token', { path: '/' });
      setAuthenticate(false);
      window.location.href = '/';
    }
  };

  const getNavLinkClass = (path: string) => {
    return pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          Restful Booker Platform Demo
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link href="/admin/rooms" className={getNavLinkClass('/admin/rooms')}>
                    Rooms
                  </Link>
                </li>
                <li className="nav-item">
                  <Link id="reportLink" href="/admin/report" className={getNavLinkClass('/admin/report')}>
                    Report
                  </Link>
                </li>
                <li className="nav-item">
                  <Link id="brandingLink" href="/admin/branding" className={getNavLinkClass('/admin/branding')}>
                    Branding
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/message" className={getNavLinkClass('/admin/message')}>
                    Messages {messageCount > 0 && <span className="badge bg-danger text-white">{messageCount}</span>}
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" id="frontPageLink" href="/">Front Page</a>
            </li>
            <li className="nav-item">
              <button onClick={doLogout} className="btn btn-outline-danger my-2 my-sm-0">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav; 