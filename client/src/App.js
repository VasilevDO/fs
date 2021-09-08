import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import useRoutes from './Pages/routes';
import { AuthContext } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useDispatch,useSelector } from 'react-redux';

import { Navbar } from './components/Navbar';
import { Footbar } from './components/Footbar';
import { Loader } from './components/Loader';

import { setUser } from './redux/appActions';

function App() {
  const user=useSelector(state=>state.app.user);
  const loading=useSelector(state=>state.app.loading);
  const dispatch=useDispatch();
  const { token, login, logout, userId, userName, userRights, ready } = useAuth();

  if (token&&userId&&userName&&userRights&&!Object.keys(user).length) {
    dispatch(setUser({
      id:userId,
      name:userName,
      rights:userRights,
      token:token      
    }));
  }

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
          {loading?
          <Loader/>:null}
          {isAuthenticated &&  <Footbar />}
        </Router>
      </AuthContext.Provider>
      </div>
    </ErrorBoundary >
  );
}

export default App;
