import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import useRoutes from './Pages/routes';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footbar } from './components/Footbar';
import { Loader } from './components/Loader';
import { ErrorBoundary } from './components/ErrorBoundary';

import 'materialize-css';




function App() {
  const { token, login, logout, userId, userName, userRights, ready } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />
  }

  return (

    <ErrorBoundary>
      <div className='page-container'>
      <AuthContext.Provider value={{
        token, login, logout, userId, userName, isAuthenticated, userRights
      }}>
        <Router>
          {isAuthenticated && <Navbar />}
          <div className='pwnz-container'>{routes}</div>
          {isAuthenticated &&  <Footbar />}
         
        </Router>

      </AuthContext.Provider>
      </div>
    </ErrorBoundary >
   
  );
}

export default App;
