import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import useRoutes from './Pages/routes';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
import { ErrorBoundary } from './components/ErrorBoundary';

import 'materialize-css';




function App() {
  const { token, login, logout, userId, userName, userRights, ready} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />
  }

  console.log(userRights);

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{
        token, login, logout, userId, userName, isAuthenticated, userRights
      }}>
        <Router>
          {isAuthenticated && <Navbar />}
          <div className='pwnz-container'>{routes}</div>
        </Router>

      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
