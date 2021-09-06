import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LinksPage from './LinksPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import GamesPage from './GamesPage';
import ServicesPage from './ServicesPage';
import ResetPage from './ResetPage.js'
import BioPage from './BioPage';
import VideoPage from './VideoPage';

const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/home' exact>
                    <HomePage />
                </Route>
                <Route path='/links' exact>
                    <LinksPage />
                </Route>
                <Route path='/services' exact>
                    <ServicesPage />
                </Route>
                <Route path='/services/:service' exact>
                    <ServicesPage />
                </Route>
                <Route path='/games' exact>
                    <GamesPage />
                </Route>
                <Route path='/games/:game' exact>
                    <GamesPage />
                </Route>
                <Route path='/bio' exact>
                    <BioPage />
                </Route>
                <Route path='/video' exact>
                    <VideoPage/>
                </Route>
                <Redirect to='/home' />
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path='/auth' exact>
                    <AuthPage />
                </Route>
                <Route path='/reset/:id' exact>
                    <ResetPage />
                </Route>
                <Redirect to='/auth' />
            </Switch>
        )
    }
}

export default useRoutes;